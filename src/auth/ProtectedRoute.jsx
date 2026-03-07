import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";
import useAuth from "../hooks/useAuth";
import { ROUTES, USER_TYPES } from "../utils/constants";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, mustChangePassword, userType } =
    useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
    );
  }

  if (mustChangePassword && location.pathname !== ROUTES.CHANGE_PASSWORD) {
    return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
  }

  // ── Razón social: redirigir a reportes SOLO si está en rutas que no le corresponden
  if (
    userType === USER_TYPES.RAZON_SOCIAL &&
    location.pathname !== ROUTES.REPORTES &&
    location.pathname !== ROUTES.PERFIL &&
    location.pathname !== ROUTES.CHANGE_PASSWORD
  ) {
    return <Navigate to={ROUTES.REPORTES} replace />;
  }

  return children;
};

export default ProtectedRoute;
