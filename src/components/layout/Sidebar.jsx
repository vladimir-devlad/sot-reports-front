import { Box, Divider, Drawer, List, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { getSidebarRoutes } from "../../router/routes";
import useUiStore from "../../store/uiStore";
import SidebarNavItem from "./SidebarNavItem";

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_COLLAPSED = 64;
const TOPBAR_HEIGHT = 64;

const Sidebar = () => {
  const { role } = useAuth();
  const { sidebarOpen } = useUiStore();

  console.log("SIDEBAR role:", role); // ← agregar
  console.log("SIDEBAR navRoutes:", getSidebarRoutes(role)); // ← agregar

  const navRoutes = getSidebarRoutes(role);
  const collapsed = !sidebarOpen;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
          transition: "width 0.25s ease",
          overflowX: "hidden",
          top: TOPBAR_HEIGHT,
          height: `calc(100% - ${TOPBAR_HEIGHT}px)`,
          borderRight: "1px solid",
          borderColor: "divider",
          boxSizing: "border-box",
        },
      }}
    >
      {/* ── Encabezado del sidebar ──────────────────────────────────────── */}
      {!collapsed && (
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.disabled"
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            Navegación
          </Typography>
        </Box>
      )}

      {collapsed && <Box sx={{ pt: 1.5 }} />}

      <Divider sx={{ mx: collapsed ? 1 : 2, mb: 0.5 }} />

      {/* ── Ítems de navegación ─────────────────────────────────────────── */}
      <List disablePadding sx={{ pt: 0.5 }}>
        {navRoutes.map((route) => (
          <SidebarNavItem key={route.key} route={route} collapsed={collapsed} />
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
