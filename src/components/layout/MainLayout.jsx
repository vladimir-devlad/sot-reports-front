import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import useUiStore from "../../store/uiStore";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_COLLAPSED = 64;

const MainLayout = () => {
  const { sidebarOpen } = useUiStore();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Barra superior fija ─────────────────────────────────────────── */}
      <Topbar />

      {/* ── Sidebar permanente ──────────────────────────────────────────── */}
      <Sidebar />

      {/* ── Contenido principal ─────────────────────────────────────────── */}
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED}px)`,
          ml: `${sidebarOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED}px`,
          transition: "margin-left 0.25s ease, width 0.25s ease",
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      > */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          transition: "width 0.25s ease",
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        {/* Spacer para el Topbar */}
        <Toolbar /> {/* quita variant="dense" */}
        {/* Contenido de cada página */}
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
