import { create } from "zustand";
import { authApi } from "../api/authApi";
import { ROLES, USER_TYPES } from "../utils/constants";
import { tokenStorage } from "../utils/tokenStorage";

const initialState = {
  user: null,
  userType: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  mustChangePassword: false,
};

const useAuthStore = create((set, get) => ({
  ...initialState,

  // ── Login unificado ────────────────────────────────────────────────────────
  login: async (credentials) => {
    set({ isLoading: true });

    // ── Intento 1: usuario interno ─────────────────────────────────────────
    let internalError = null;
    try {
      const { data } = await authApi.loginInterno(credentials);
      const payload = data.data ?? data;

      const {
        access_token,
        refresh_token,
        must_change_password = false,
      } = payload;

      const jwtPayload = JSON.parse(atob(access_token.split(".")[1]));
      const userRole = jwtPayload.role || ROLES.USUARIO;

      tokenStorage.setAccess(access_token);
      tokenStorage.setRefresh(refresh_token);
      tokenStorage.setUserType(USER_TYPES.INTERNAL);

      set({
        user: {
          id: jwtPayload.sub,
          role: userRole,
        },
        userType: USER_TYPES.INTERNAL,
        role: userRole, // ← viene del JWT inmediatamente
        isAuthenticated: true,
        mustChangePassword: must_change_password,
        isLoading: false,
      });

      return {
        success: true,
        mustChangePassword: must_change_password,
        userType: USER_TYPES.INTERNAL,
      };
    } catch (err) {
      internalError = err;
    }

    // Si el error no es 401 ni 404 no tiene caso probar razón social
    const status = internalError?.response?.status;
    if (status !== 401 && status !== 404) {
      set({ isLoading: false });
      throw internalError;
    }

    // ── Intento 2: razón social ────────────────────────────────────────────
    try {
      const { data } = await authApi.loginRazonSocial(credentials);
      const payload = data.data ?? data;

      const {
        access_token,
        refresh_token,
        must_change_password = false,
        name_razon_social = credentials.username,
      } = payload;

      tokenStorage.setAccess(access_token);
      tokenStorage.setRefresh(refresh_token);
      tokenStorage.setUserType(USER_TYPES.RAZON_SOCIAL);

      set({
        user: {
          name_razon_social,
          must_change_password,
        },
        userType: USER_TYPES.RAZON_SOCIAL,
        role: ROLES.RAZON_SOCIAL, // ← 'razon_social' exacto
        isAuthenticated: true,
        mustChangePassword: must_change_password,
        isLoading: false,
      });

      return {
        success: true,
        mustChangePassword: must_change_password,
        userType: USER_TYPES.RAZON_SOCIAL,
      };
    } catch (err) {
      set({ isLoading: false });
      if (err?.response?.status === 401) throw internalError;
      throw err;
    }
  },

  // ── Logout ─────────────────────────────────────────────────────────────────
  logout: async () => {
    const { userType } = get();
    try {
      if (userType === USER_TYPES.RAZON_SOCIAL)
        await authApi.logoutRazonSocial();
      else await authApi.logoutInterno();
    } catch (_) {
      // silenciar error de red
    } finally {
      tokenStorage.clearAll();
      set({ ...initialState });
    }
  },

  // ── Rehidratar sesión al recargar ──────────────────────────────────────────
  rehydrate: () => {
    const accessToken = tokenStorage.getAccess();
    const userType = tokenStorage.getUserType();

    if (accessToken && userType) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));

        if (userType === USER_TYPES.RAZON_SOCIAL) {
          set({
            isAuthenticated: true,
            userType,
            role: ROLES.RAZON_SOCIAL, // ← 'razon_social' exacto
            user: {
              name_razon_social: payload.name_razon_social || "",
              must_change_password: false,
            },
          });
        } else {
          const userRole = payload.role || userType;
          set({
            isAuthenticated: true,
            userType,
            role: userRole, // ← 'administrador', 'coordinador', etc.
            user: {
              id: payload.sub,
              role: userRole,
            },
          });
        }
      } catch (_) {
        tokenStorage.clearAll();
      }
    }
  },

  clearMustChangePassword: () => set({ mustChangePassword: false }),
  updateUser: (updatedUser) => set({ user: updatedUser }),
}));

export default useAuthStore;
