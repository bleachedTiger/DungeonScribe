import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))

    const login = (newToken) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

//Hook for using the context
export function UseAuth() {
  return useContext(AuthContext)
}