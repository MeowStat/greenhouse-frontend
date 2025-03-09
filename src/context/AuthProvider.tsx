import { createContext, ReactNode, useEffect, useState } from 'react';

interface AuthState {
  user?: string;
  token?: string;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ( { children } : {children: ReactNode}) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem("accessToken");
    return token ? { token } : {};
  });
  
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem("accessToken", auth.token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext