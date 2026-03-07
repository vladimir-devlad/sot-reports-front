import { TOKEN_KEYS } from "./constants";

export const tokenStorage = {
  // ─── Access Token ──────────────────────────────────────────────────────────
  getAccess: () => localStorage.getItem(TOKEN_KEYS.ACCESS),
  setAccess: (token) => localStorage.setItem(TOKEN_KEYS.ACCESS, token),
  removeAccess: () => localStorage.removeItem(TOKEN_KEYS.ACCESS),

  // ─── Refresh Token ─────────────────────────────────────────────────────────
  getRefresh: () => localStorage.getItem(TOKEN_KEYS.REFRESH),
  setRefresh: (token) => localStorage.setItem(TOKEN_KEYS.REFRESH, token),
  removeRefresh: () => localStorage.removeItem(TOKEN_KEYS.REFRESH),

  // ─── Tipo de usuario ───────────────────────────────────────────────────────
  getUserType: () => localStorage.getItem(TOKEN_KEYS.USER_TYPE),
  setUserType: (type) => localStorage.setItem(TOKEN_KEYS.USER_TYPE, type),
  removeUserType: () => localStorage.removeItem(TOKEN_KEYS.USER_TYPE),

  // ─── Limpiar todo ──────────────────────────────────────────────────────────
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    localStorage.removeItem(TOKEN_KEYS.USER_TYPE);
  },

  // ─── Verificar si hay sesión activa ───────────────────────────────────────
  hasSession: () => !!localStorage.getItem(TOKEN_KEYS.ACCESS),
};
