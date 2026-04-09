import { Navigate } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { getDefaultRoute } from "../utils/defaultRoute";

export const DefaultRedirects = () => {
  const { defaultView } = useSettings();
  return <Navigate to={getDefaultRoute(defaultView)} replace />;
};