import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { useSettings } from "../hooks/useSettings";
import { getDefaultRoute } from "../utils/defaultRoute";

export const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const { defaultView } = useSettings();
    const defaultRoute = getDefaultRoute(defaultView);

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen space-y-3">
            <div className="w-10 h-10 border-4 border-(--accent) border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-(--text-muted)">Checking authentication...</p>
        </div>
      );
    }

    if (isAuthenticated) {
        return <Navigate to={defaultRoute} replace />
    }

  return <Outlet />;
}
