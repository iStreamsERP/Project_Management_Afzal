/**
 * SOAP client for the iStreams ERP web services, ported from the HRMS module
 * (`istreams-HRMS-Module-react/src/api/callSoapService.jsx`) so this app
 * authenticates against the same ERP backend.
 */
import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'

const NAMESPACE = 'http://tempuri.org/'

type SoapParams = Record<string, string | number | boolean | null | undefined>

const escapeXml = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'string') return String(value)

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const buildSoapEnvelope = (methodName: string, paramXML: string) =>
  `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <${methodName} xmlns="${NAMESPACE}">
      ${paramXML}
    </${methodName}>
  </soap:Body>
</soap:Envelope>`

async function callSoapServiceForMethod(
  url: string,
  methodName: string,
  parameterDetails: SoapParams,
): Promise<unknown> {
  const paramXML = Object.entries(parameterDetails)
    .map(([key, value]) => `<${key}>${escapeXml(value)}</${key}>`)
    .join('')

  const soapEnvelope = buildSoapEnvelope(methodName, paramXML)
  const soapAction = `"${NAMESPACE}${methodName}"`

  try {
    const { data } = await axios.post<string>(url, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: soapAction,
      },
    })

    const parser = new XMLParser({ ignoreAttributes: false })
    const response = parser.parse(data)

    const body = response['soap:Envelope']['soap:Body']
    const methodResponse = body[`${methodName}Response`]
    return methodResponse[`${methodName}Result`]
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('SOAP error:', error.message, error.response?.data)
    } else {
      console.error('SOAP error:', error)
    }
    throw error
  }
}

/**
 * Calls a SOAP method on the given service URL. Every call is preceded by a
 * `doConnection` using the payload stashed in localStorage by the login flow
 * — the ERP service is stateless per-request and expects the connection to
 * be (re)established before each method call.
 */
export async function callSoapService(
  url: string,
  methodName: string,
  parameterDetails: SoapParams,
): Promise<any> {
  try {
    const storedPayloadRaw = localStorage.getItem('doConnectionPayload')
    const storedPayload = storedPayloadRaw ? (JSON.parse(storedPayloadRaw) as SoapParams) : null

    if (storedPayload && typeof storedPayload === 'object') {
      await callSoapServiceForMethod(url, 'doConnection', storedPayload)
    } else {
      console.warn('doConnection payload is missing or invalid.')
    }

    const response = await callSoapServiceForMethod(url, methodName, parameterDetails)

    if (typeof response !== 'string') return response

    try {
      const parsed = JSON.parse(response)
      return typeof parsed === 'object' ? parsed : response
    } catch {
      return response
    }
  } catch (error) {
    console.error('SOAP error (main call):', error)
    throw error
  }
}
