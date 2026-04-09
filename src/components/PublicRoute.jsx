import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { useSettings } from "../hooks/useSettings";
import { getDefaultRoute } from "../utils/defaultRoute";

export const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const { defaultView } = useSettings();
    const defaultRoute = getDefaultRoute(defaultView);

    if (loading) return null;

    if (isAuthenticated) {
        return <Navigate to={defaultRoute} replace />
    }

  return <Outlet />;
}
