import { InboxOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

// ─── Uso ───────────────────────────────────────────────────────────────────────
// <EmptyState
//   title="Sin usuarios"
//   description="No se encontraron usuarios con los filtros aplicados."
//   actionLabel="Nuevo usuario"
//   onAction={() => navigate(ROUTES.USUARIOS_NUEVO)}
// />
const EmptyState = ({
  title = "Sin resultados",
  description = "No se encontraron datos.",
  actionLabel,
  onAction,
  Icon = InboxOutlined,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 8,
      gap: 1.5,
      color: "text.secondary",
    }}
  >
    <Icon sx={{ fontSize: 56, opacity: 0.35 }} />

    <Typography variant="h6" fontWeight={600} color="text.primary">
      {title}
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      textAlign="center"
      maxWidth={360}
    >
      {description}
    </Typography>

    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
