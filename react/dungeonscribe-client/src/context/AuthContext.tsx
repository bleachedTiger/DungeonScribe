import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    const login = (newToken: string): void => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setIsAuthenticated(true)
    }

    const logout = (): void => {
        localStorage.removeItem('token')
        setToken(null)
        setIsAuthenticated(false)
    }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
//Hook for using the context
export function UseAuth(): AuthContextType {

  const context = useContext(AuthContext);
    if (!context) {
        throw new Error('UseAuth must be used within an AuthProvider');
    }
    return context;
}