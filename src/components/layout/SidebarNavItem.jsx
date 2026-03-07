import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarNavItem = ({ route, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive =
    location.pathname === route.path ||
    location.pathname.startsWith(route.path + "/");
  const { Icon } = route;

  const button = (
    <ListItemButton
      onClick={() => navigate(route.path)}
      selected={isActive}
      sx={{
        borderRadius: 2,
        mx: 1,
        mb: 0.5,
        minHeight: 44,
        justifyContent: collapsed ? "center" : "flex-start",
        px: collapsed ? 1 : 2,

        "&.Mui-selected": {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
          color: "primary.main",
          "& .MuiListItemIcon-root": { color: "primary.main" },
          "&:hover": {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.18),
          },
        },
        "&:hover": {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.06),
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? "auto" : 36,
          color: isActive ? "primary.main" : "text.secondary",
          fontSize: "1.2rem",
        }}
      >
        <Icon fontSize="small" />
      </ListItemIcon>

      {!collapsed && (
        <ListItemText
          primary={route.label}
          primaryTypographyProps={{
            fontSize: "0.875rem",
            fontWeight: isActive ? 600 : 400,
          }}
        />
      )}
    </ListItemButton>
  );

  // Cuando el sidebar está colapsado mostramos tooltip con el nombre
  return (
    <ListItem disablePadding>
      {collapsed ? (
        <Tooltip title={route.label} placement="right">
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </ListItem>
  );
};

export default SidebarNavItem;
