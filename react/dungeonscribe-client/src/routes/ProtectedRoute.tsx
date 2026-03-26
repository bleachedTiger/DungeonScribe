import { Navigate } from 'react-router-dom'
import { UseAuth } from "../context/AuthContext"
import { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = UseAuth()

    if (!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute