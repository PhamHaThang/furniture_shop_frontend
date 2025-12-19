import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts";
import { LoadingScreen } from "../ui";
import { ROUTES } from "../../config";

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
