import { Chip } from "@mui/material";
import { getRoleColor, getRoleLabel } from "../../utils/roleHelpers";

// ─── Chip genérico con variantes ──────────────────────────────────────────────
export const AppChip = ({
  label,
  color = "default",
  size = "small",
  ...props
}) => <Chip label={label} color={color} size={size} {...props} />;

// ─── Chip específico para roles ───────────────────────────────────────────────
export const RoleChip = ({ role, size = "small" }) => (
  <Chip label={getRoleLabel(role)} color={getRoleColor(role)} size={size} />
);

// ─── Chip para estado activo/inactivo ─────────────────────────────────────────
export const StatusChip = ({ active, size = "small" }) => (
  <Chip
    label={active ? "Activo" : "Inactivo"}
    color={active ? "success" : "default"}
    size={size}
    variant={active ? "filled" : "outlined"}
  />
);
