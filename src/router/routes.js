import {
  AccountTree,
  AdminPanelSettings,
  Assessment,
  Business,
  Dashboard,
  LinkOff,
  People,
  Person,
} from "@mui/icons-material";
import { ROLES, ROUTES } from "../utils/constants";

// ─── Definición de rutas con metadata ─────────────────────────────────────────
// Usada tanto en AppRouter como en Sidebar para generar la navegación
export const APP_ROUTES = [
  {
    key: "dashboard",
    path: ROUTES.DASHBOARD,
    label: "Dashboard",
    Icon: Dashboard,
    showInSidebar: true,
    allowedRoles: [
      ROLES.ADMIN,
      ROLES.COORDINADOR,
      ROLES.SUPERVISOR,
      ROLES.USUARIO,
    ],
  },
  {
    key: "usuarios",
    path: ROUTES.USUARIOS,
    label: "Usuarios",
    Icon: People,
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
  },
  {
    key: "roles",
    path: ROUTES.ROLES,
    label: "Roles",
    Icon: AdminPanelSettings,
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    key: "razon-social",
    path: ROUTES.RAZON_SOCIAL,
    label: "Razón Social",
    Icon: Business,
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
  },
  {
    key: "jerarquia",
    path: ROUTES.JERARQUIA,
    label: "Jerarquía",
    Icon: AccountTree,
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN, ROLES.COORDINADOR],
  },
  {
    key: "asignaciones",
    path: ROUTES.ASIGNACIONES,
    label: "Asignaciones",
    Icon: LinkOff,
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
  },
  {
    key: "reportes",
    path: ROUTES.REPORTES,
    label: "SOT Reportes",
    Icon: Assessment,
    showInSidebar: true,
    allowedRoles: [
      ROLES.ADMIN,
      ROLES.COORDINADOR,
      ROLES.SUPERVISOR,
      ROLES.USUARIO,
      ROLES.RAZON_SOCIAL,
    ],
  },
  {
    key: "perfil",
    path: ROUTES.PERFIL,
    label: "Mi Perfil",
    Icon: Person,
    showInSidebar: false,
    allowedRoles: [
      ROLES.ADMIN,
      ROLES.COORDINADOR,
      ROLES.SUPERVISOR,
      ROLES.USUARIO,
      ROLES.RAZON_SOCIAL,
    ],
  },
];

// Sidebar filtra por rol automáticamente — razon_social solo verá "SOT Reportes"
export const getSidebarRoutes = (role) =>
  APP_ROUTES.filter(
    (route) => route.showInSidebar && route.allowedRoles.includes(role),
  );
