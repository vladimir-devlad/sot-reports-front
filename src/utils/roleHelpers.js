import { ROLES, ROUTE_PERMISSIONS } from "./constants";

// ─── Etiquetas legibles por rol ───────────────────────────────────────────────
export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.COORDINADOR]: "Coordinador",
  [ROLES.SUPERVISOR]: "Supervisor",
  [ROLES.USUARIO]: "Usuario",
  [ROLES.RAZON_SOCIAL]: "Razón Social",
};

// ─── Colores MUI por rol ──────────────────────────────────────────────────────
export const ROLE_COLORS = {
  [ROLES.ADMIN]: "error",
  [ROLES.COORDINADOR]: "primary",
  [ROLES.SUPERVISOR]: "warning",
  [ROLES.USUARIO]: "success",
  [ROLES.RAZON_SOCIAL]: "secondary",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getRoleLabel = (role) => ROLE_LABELS[role] || capitalize(role);

export const getRoleColor = (role) => ROLE_COLORS[role] || "default";

export const canAccess = (userRole, route) => {
  const allowed = ROUTE_PERMISSIONS[route];
  if (!allowed) return true;
  return allowed.includes(userRole);
};

export const isInternalRole = (role) =>
  [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR, ROLES.USUARIO].includes(
    role,
  );

export const isAdmin = (role) => role === ROLES.ADMIN;

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}
