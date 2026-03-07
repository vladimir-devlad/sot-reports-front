// ─── Roles del sistema ─────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN: "administrador",
  COORDINADOR: "coordinador",
  SUPERVISOR: "supervisor",
  USUARIO: "usuario",
  RAZON_SOCIAL: "razon_social",
};

// ─── Tipos de usuario (dos sistemas de login separados) ───────────────────────
export const USER_TYPES = {
  INTERNAL: "internal",
  RAZON_SOCIAL: "razon_social",
};

// ─── Keys de localStorage ─────────────────────────────────────────────────────
export const TOKEN_KEYS = {
  ACCESS: "sot_access_token",
  REFRESH: "sot_refresh_token",
  USER_TYPE: "sot_user_type",
};

// ─── URL base de la API ───────────────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// ─── Rutas de la aplicación ───────────────────────────────────────────────────
export const ROUTES = {
  // Auth
  LOGIN: "/login",
  CHANGE_PASSWORD: "/cambiar-password",

  // App
  DASHBOARD: "/dashboard",
  USUARIOS: "/usuarios",
  USUARIOS_NUEVO: "/usuarios/nuevo",
  USUARIOS_EDITAR: "/usuarios/:id/editar",
  USUARIOS_DETALLE: "/usuarios/:id",
  ROLES: "/roles",
  RAZON_SOCIAL: "/razon-social",
  RAZON_SOCIAL_NUEVO: "/razon-social/nuevo",
  RAZON_SOCIAL_EDITAR: "/razon-social/:id/editar",
  JERARQUIA: "/jerarquia",
  ASIGNACIONES: "/asignaciones",
  REPORTES: "/reportes",
  PERFIL: "/perfil",

  // Errores
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/403",
};

// ─── Permisos por ruta (qué roles pueden acceder) ─────────────────────────────
export const ROUTE_PERMISSIONS = {
  [ROUTES.DASHBOARD]: [
    ROLES.ADMIN,
    ROLES.COORDINADOR,
    ROLES.SUPERVISOR,
    ROLES.USUARIO,
    ROLES.RAZON_SOCIAL,
  ],
  [ROUTES.USUARIOS]: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
  [ROUTES.ROLES]: [ROLES.ADMIN],
  [ROUTES.RAZON_SOCIAL]: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
  [ROUTES.JERARQUIA]: [ROLES.ADMIN, ROLES.COORDINADOR],
  [ROUTES.ASIGNACIONES]: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
  [ROUTES.REPORTES]: [
    ROLES.ADMIN,
    ROLES.COORDINADOR,
    ROLES.SUPERVISOR,
    ROLES.USUARIO,
    ROLES.RAZON_SOCIAL,
  ],
  [ROUTES.PERFIL]: [
    ROLES.ADMIN,
    ROLES.COORDINADOR,
    ROLES.SUPERVISOR,
    ROLES.USUARIO,
    ROLES.RAZON_SOCIAL,
  ],
};

// ─── Paginación por defecto ───────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ─── Configuración de seguridad ───────────────────────────────────────────────
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 10;
