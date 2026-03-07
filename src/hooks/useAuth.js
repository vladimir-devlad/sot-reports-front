import useAuthStore from "../store/authStore";
import { ROLES } from "../utils/constants";

const useAuth = () => {
  const {
    user,
    userType,
    role,
    isAuthenticated,
    isLoading,
    mustChangePassword,
    login,
    logout,
    rehydrate,
    clearMustChangePassword,
    updateUser,
  } = useAuthStore();

  return {
    user,
    userType,
    role,
    isAuthenticated,
    isLoading,
    mustChangePassword,

    // Acciones
    login,
    logout,
    rehydrate,
    clearMustChangePassword,
    updateUser,

    // Helpers de rol
    isAdmin: role === ROLES.ADMIN,
    isCoordinador: role === ROLES.COORDINADOR,
    isSupervisor: role === ROLES.SUPERVISOR,
    isUsuario: role === ROLES.USUARIO,
    isRazonSocial: role === ROLES.RAZON_SOCIAL,
  };
};

export default useAuth;
