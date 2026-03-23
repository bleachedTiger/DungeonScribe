import { Navigate } from 'react-router-dom'
import { UseAuth } from "../context/AuthContext"

function ProtectedRoute({ children }) {
    const { isAuthenticated } = UseAuth()

    if (!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute