import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Checking authentication...</p>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

  return children;
}
