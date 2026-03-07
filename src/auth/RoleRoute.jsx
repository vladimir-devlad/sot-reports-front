import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

// ─── Guard de roles ────────────────────────────────────────────────────────────
// Recibe un array de roles permitidos y bloquea el acceso si el rol
// del usuario autenticado no está incluido.
//
// Uso:
//   <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.COORDINADOR]}>
//     <UsuariosPage />
//   </RoleRoute>
const RoleRoute = ({ allowedRoles = [], children }) => {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
};

export default RoleRoute;
