import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type AuthUserData = {
  clientURL: string
  userEmail: string
  userName: string
  userEmployeeNo: string
  userAvatar: string
  companyCode: string
  branchCode: string
  companyName: string
  companyAddress?: string
  companyLogo?: string
  companyCurrName?: string
  companyCurrDecimals?: number
  companyCurrSymbol?: string
  companyCurrIsIndianStandard?: boolean
  isAdmin: boolean
}

type AuthContextValue = {
  userData: AuthUserData | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (data: AuthUserData, rememberMe?: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadStoredUserData(): AuthUserData | null {
  try {
    const stored =
      sessionStorage.getItem('userData') ?? localStorage.getItem('userData')
    if (!stored) return null
    const parsed = JSON.parse(stored) as AuthUserData
    return parsed?.userEmail ? parsed : null
  } catch (error) {
    console.error('Error loading user data from storage:', error)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<AuthUserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUserData(loadStoredUserData())
    setLoading(false)
  }, [])

  const login = useCallback((data: AuthUserData, rememberMe = false) => {
    setUserData(data)
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('userData', JSON.stringify(data))
  }, [])

  const logout = useCallback(() => {
    setUserData(null)
    localStorage.removeItem('userData')
    sessionStorage.removeItem('userData')
    localStorage.removeItem('doConnectionPayload')
  }, [])

  if (loading) return null

  return (
    <AuthContext.Provider
      value={{
        userData,
        loading,
        isAuthenticated: !!userData?.userEmail,
        isAdmin: !!userData?.isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
