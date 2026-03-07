import {
  Circle,
  Logout,
  Menu as MenuIcon,
  Notifications,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useUiStore from "../../store/uiStore";
import { ROUTES } from "../../utils/constants";

// ─── Etiquetas y colores por rol ──────────────────────────────────────────────
const ROLE_LABELS = {
  administrador: "Administrador",
  coordinador: "Coordinador",
  supervisor: "Supervisor",
  usuario: "Usuario",
  razon_social: "Razón Social",
};

const ROLE_COLORS = {
  administrador: "error",
  coordinador: "warning",
  supervisor: "info",
  usuario: "default",
  razon_social: "primary",
};

// ─── Títulos por ruta ─────────────────────────────────────────────────────────
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/usuarios": "Usuarios",
  "/roles": "Roles",
  "/razon-social": "Razón Social",
  "/jerarquia": "Jerarquía",
  "/asignaciones": "Asignaciones",
  "/reportes": "Visor Comercial de SOTs",
  "/perfil": "Mi Perfil",
};

// ─── Notificaciones mock ──────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Bienvenido al sistema SOT", time: "Ahora", unread: true },
  {
    id: 2,
    text: "Datos actualizados correctamente",
    time: "Hace 1 hora",
    unread: false,
  },
];

const Topbar = () => {
  const { user, role, logout } = useAuth();
  const { toggleSidebar } = useUiStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorNotif, setAnchorNotif] = useState(null);

  const title = PAGE_TITLES[pathname] || "SOT";
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  // ── Nombre visible ──────────────────────────────────────────────────────────
  const fullName =
    user?.name_razon_social ||
    [user?.name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "Usuario";

  const initial = fullName[0]?.toUpperCase() ?? "U";

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };
  const handleOpenNotif = (e) => setAnchorNotif(e.currentTarget);
  const handleCloseNotif = () => setAnchorNotif(null);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            gap: 2,
            minHeight: "64px !important",
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* ── Izquierda ───────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: 1,
              minWidth: 0,
            }}
          >
            <IconButton
              onClick={toggleSidebar}
              size="small"
              sx={{ color: "text.secondary", flexShrink: 0 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              component="img"
              src="/assets/claro.svg"
              alt="Claro"
              sx={{ height: 26, cursor: "pointer", flexShrink: 0 }}
              onClick={() => navigate(ROUTES.DASHBOARD)}
            />

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.5, borderColor: "divider" }}
            />

            {/* Título + fecha */}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                color="text.primary"
                noWrap
                lineHeight={1.2}
                fontSize={{ xs: "0.95rem", sm: "1.1rem" }}
              >
                {title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {new Date().toLocaleDateString("es-PE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          {/* ── Derecha ─────────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1.5 },
            }}
          >
            {/* Notificaciones */}
            <Tooltip title="Notificaciones">
              <IconButton onClick={handleOpenNotif} size="small">
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.6rem",
                      minWidth: 16,
                      height: 16,
                    },
                  }}
                >
                  <Notifications
                    sx={{ fontSize: 22, color: "text.secondary" }}
                  />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Avatar + info usuario */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                borderRadius: 2,
                px: { xs: 0.5, sm: 1 },
                py: 0.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.subtle",
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                {initial}
              </Avatar>

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  fontSize="0.875rem"
                  fontWeight={600}
                  lineHeight={1.2}
                  noWrap
                  color="text.primary"
                >
                  {fullName}
                </Typography>
                <Chip
                  label={
                    role === "razon_social"
                      ? user?.username_razon_social || "Razón Social"
                      : ROLE_LABELS[role] || role
                  }
                  color={ROLE_COLORS[role] || "default"}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    mt: 0.25,
                  }}
                />
              </Box>
            </Box>

            {/* Logout */}
            <Tooltip title="Cerrar sesión">
              <IconButton
                onClick={handleLogout}
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: "rgba(211,47,47,0.06)",
                  },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Popover notificaciones ─────────────────────────────────────────── */}
      <Popover
        open={Boolean(anchorNotif)}
        anchorEl={anchorNotif}
        onClose={handleCloseNotif}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            width: { xs: 290, sm: 320 },
            borderRadius: 3,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.subtle",
          }}
        >
          <Typography fontWeight={600} fontSize="0.875rem" color="text.primary">
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} nuevas`}
              size="small"
              color="primary"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          )}
        </Box>

        {/* Lista */}
        <List disablePadding>
          {MOCK_NOTIFICATIONS.map((notif, index) => (
            <Box key={notif.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  px: 2,
                  py: 1.25,
                  bgcolor: notif.unread ? "primary.lighter" : "transparent",
                  "&:hover": {
                    bgcolor: "background.subtle",
                    cursor: "pointer",
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
                  {notif.unread ? (
                    <Circle
                      sx={{
                        color: "primary.main",
                        fontSize: 8,
                        mt: 0.75,
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <Box sx={{ width: 8, flexShrink: 0 }} />
                  )}
                  <ListItemText
                    primary={
                      <Typography
                        fontSize="0.8rem"
                        fontWeight={notif.unread ? 600 : 400}
                        color="text.primary"
                      >
                        {notif.text}
                      </Typography>
                    }
                    secondary={
                      <Typography fontSize="0.72rem" color="text.secondary">
                        {notif.time}
                      </Typography>
                    }
                  />
                </Box>
              </ListItem>
              {index < MOCK_NOTIFICATIONS.length - 1 && (
                <Divider sx={{ borderColor: "divider" }} />
              )}
            </Box>
          ))}
        </List>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            borderTop: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            bgcolor: "background.subtle",
          }}
        >
          <Typography
            fontSize="0.8rem"
            color="primary.main"
            fontWeight={600}
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Ver todas las notificaciones
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default Topbar;
