import { callSoapService } from '../soap/callSoapService'
import { getNameFromEmail } from './emailHelpers'
import type { AuthUserData } from '../../contexts/AuthContext'

const PUBLIC_SERVICE_URL = import.meta.env.VITE_SOAP_ENDPOINT ?? ''

type BranchInfoRow = {
  ADDRESS_POSTAL?: string
  CURRENCY_NAME?: string
}

type CurrencyInfoRow = {
  CURRENCY_CODE?: string
  NO_OF_DECIMALS?: number
  IS_INDIANCURRENCY_FORMAT?: boolean
}

type EmployeeRow = {
  EMP_NO?: string
  USER_NAME?: string
}

/**
 * Single source of truth for the login flow, ported from the HRMS module's
 * `buildClientLoginPayload` (istreams-HRMS-Module-react/src/pages/HomeAndLogin/LoginFormPage.jsx).
 * Establishes a connection with the public ERP service, resolves the
 * client's own service URL, verifies credentials against it, then pulls
 * employee, company, branch and currency details for the session.
 */
export async function buildLoginPayload(email: string, password: string): Promise<AuthUserData> {
  const userName = getNameFromEmail(email)

  const doConnectionPayload = { LoginUserName: email }
  localStorage.setItem('doConnectionPayload', JSON.stringify(doConnectionPayload))

  // ── public service ────────────────────────────────────────────────────
  const publicDoConnectionResponse = await callSoapService(
    PUBLIC_SERVICE_URL,
    'doConnection',
    doConnectionPayload,
  )
  if (publicDoConnectionResponse !== 'SUCCESS') {
    throw new Error(String(publicDoConnectionResponse))
  }

  const clientURL: string = await callSoapService(PUBLIC_SERVICE_URL, 'GetServiceURL', doConnectionPayload)

  // ── client service ────────────────────────────────────────────────────
  const clientDoConnectionResponse = await callSoapService(clientURL, 'doConnection', doConnectionPayload)
  if (clientDoConnectionResponse !== 'SUCCESS') {
    throw new Error(String(clientDoConnectionResponse))
  }

  // ── authentication ────────────────────────────────────────────────────
  const authenticationResponse = await callSoapService(clientURL, 'verifyauthentication', {
    username: userName,
    password,
  })
  if (authenticationResponse !== 'Authetication passed') {
    throw new Error(String(authenticationResponse))
  }

  // ── employee details ──────────────────────────────────────────────────
  const employeeRows: EmployeeRow[] = await callSoapService(clientURL, 'getemployeename_and_id', {
    userfirstname: userName,
  })
  const employeeNo = employeeRows?.[0]?.EMP_NO ?? ''

  let userAvatar = ''
  if (employeeNo) {
    const employeeImageResponse: string = await callSoapService(clientURL, 'getpic_bytearray', {
      EmpNo: employeeNo,
    })
    userAvatar = employeeImageResponse ? `data:image/jpeg;base64,${employeeImageResponse}` : ''
  }

  // ── company / branch / currency ─────────────────────────────────────
  const companyCode: string = await callSoapService(clientURL, 'General_Get_DefaultCompanyCode', {})

  let branchCode = ''
  let companyName = ''
  let companyLogo = ''
  let branchInfo: BranchInfoRow | undefined
  let currencyInfo: CurrencyInfoRow | undefined

  if (companyCode) {
    branchCode = await callSoapService(clientURL, 'General_Get_DefaultBranchCode', {
      CompanyCode: companyCode,
    })

    companyName = await callSoapService(clientURL, 'General_Get_DefaultCompanyName', {
      CompanyCode: companyCode,
      BranchCode: branchCode,
    })

    companyLogo = await callSoapService(clientURL, 'General_Get_CompanyLogo', {
      CompanyCode: companyCode,
      BranchCode: branchCode,
    })

    const branchRows: BranchInfoRow[] = await callSoapService(clientURL, 'DataModel_GetDataFrom_Query', {
      SQLQuery: `SELECT * FROM BRANCH_MASTER WHERE COMPANY_CODE = ${companyCode} AND DEFAULT_STATUS = 'T'`,
    })
    branchInfo = branchRows?.[0]

    if (branchInfo?.CURRENCY_NAME) {
      const currencyRows: CurrencyInfoRow[] = await callSoapService(clientURL, 'DataModel_GetDataFrom_Query', {
        SQLQuery: `SELECT * FROM COUNTRY_MASTER WHERE CURRENCY_NAME = '${branchInfo.CURRENCY_NAME}'`,
      })
      currencyInfo = currencyRows?.[0]
    }
  }

  // ── admin check ──────────────────────────────────────────────────────
  const isAdminResponse = await callSoapService(clientURL, 'DMS_Is_Admin_User', {
    UserName: employeeRows?.[0]?.USER_NAME ?? '',
  })

  return {
    userEmail: email,
    userName: employeeRows?.[0]?.USER_NAME ?? userName,
    userEmployeeNo: employeeNo,
    userAvatar,
    clientURL,
    companyCode: companyCode ?? '',
    branchCode: branchCode ?? '',
    isAdmin: isAdminResponse === 'Yes',
    companyName: companyName ?? '',
    companyAddress: branchInfo?.ADDRESS_POSTAL ?? '',
    companyLogo: companyLogo ?? '',
    companyCurrName: branchInfo?.CURRENCY_NAME ?? '',
    companyCurrDecimals: currencyInfo?.NO_OF_DECIMALS ?? 0,
    companyCurrSymbol: currencyInfo?.CURRENCY_CODE ?? '',
    companyCurrIsIndianStandard: currencyInfo?.IS_INDIANCURRENCY_FORMAT ?? false,
  }
}
