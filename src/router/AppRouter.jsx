import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import RoleRoute from "../auth/RoleRoute";
import LoadingScreen from "../components/common/LoadingScreen";
import { ROLES, ROUTES } from "../utils/constants";

// ─── Lazy loading de páginas ───────────────────────────────────────────────────
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ChangePasswordPage = lazy(
  () => import("../pages/auth/ChangePasswordPage"),
);
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const UsuariosPage = lazy(() => import("../pages/usuarios/UsuariosPage"));
const RolesPage = lazy(() => import("../pages/roles/RolesPage"));
const RazonSocialPage = lazy(
  () => import("../pages/razonSocial/RazonSocialPage"),
);
const JerarquiaPage = lazy(() => import("../pages/jerarquia/JerarquiaPage"));
const AsignacionesPage = lazy(
  () => import("../pages/asignaciones/AsignacionesPage"),
);
const SotReportesPage = lazy(() => import("../pages/reportes/SotReportesPage"));
const PerfilPage = lazy(() => import("../pages/perfil/PerfilPage"));
const NotFoundPage = lazy(() => import("../pages/errors/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/errors/UnauthorizedPage"));
const MainLayout = lazy(() => import("../components/layout/MainLayout"));

// ─── Router ───────────────────────────────────────────────────────────────────
const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingScreen message="Cargando..." />}>
      <Routes>
        {/* ── Rutas públicas ─────────────────────────────────────────────── */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="/403" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* ── Cambiar contraseña (auth pero sin layout) ───────────────────── */}
        <Route
          path={ROUTES.CHANGE_PASSWORD}
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        {/* ── Rutas protegidas con layout principal ───────────────────────── */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard — todos los roles */}
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

          {/* Usuarios — admin, coordinador, supervisor */}
          <Route
            path={ROUTES.USUARIOS}
            element={
              <RoleRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.COORDINADOR,
                  ROLES.SUPERVISOR,
                ]}
              >
                <UsuariosPage />
              </RoleRoute>
            }
          />

          {/* Roles — solo admin */}
          <Route
            path={ROUTES.ROLES}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <RolesPage />
              </RoleRoute>
            }
          />

          {/* Razón Social — admin, coordinador, supervisor */}
          <Route
            path={ROUTES.RAZON_SOCIAL}
            element={
              <RoleRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.COORDINADOR,
                  ROLES.SUPERVISOR,
                ]}
              >
                <RazonSocialPage />
              </RoleRoute>
            }
          />

          {/* Jerarquía — admin, coordinador */}
          <Route
            path={ROUTES.JERARQUIA}
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.COORDINADOR]}>
                <JerarquiaPage />
              </RoleRoute>
            }
          />

          {/* Asignaciones — admin, coordinador, supervisor */}
          <Route
            path={ROUTES.ASIGNACIONES}
            element={
              <RoleRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.COORDINADOR,
                  ROLES.SUPERVISOR,
                ]}
              >
                <AsignacionesPage />
              </RoleRoute>
            }
          />

          {/* SOT Reportes — todos los roles */}
          <Route path={ROUTES.REPORTES} element={<SotReportesPage />} />

          {/* Perfil — todos los roles */}
          <Route path={ROUTES.PERFIL} element={<PerfilPage />} />
        </Route>

        {/* ── Redirecciones ───────────────────────────────────────────────── */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
