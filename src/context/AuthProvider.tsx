import { createContext, ReactNode, useEffect, useState } from 'react'
import { API_CONFIG } from '../config/config'

interface AuthState {
  user?: string
  token?: string
}

interface AuthContextType {
  auth: AuthState
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem(API_CONFIG.tokenStorageKey)
    return token ? { token } : {}
  })

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(API_CONFIG.tokenStorageKey, auth.token)
    } else {
      localStorage.removeItem(API_CONFIG.tokenStorageKey)
    }
  }, [auth.token])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
