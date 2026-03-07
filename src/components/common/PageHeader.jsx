import { NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// ─── Uso ───────────────────────────────────────────────────────────────────────
// <PageHeader
//   title="Usuarios"
//   subtitle="Gestión de usuarios del sistema"
//   breadcrumbs={[
//     { label: 'Dashboard', to: '/dashboard' },
//     { label: 'Usuarios' },
//   ]}
//   actions={<Button>Nuevo</Button>}
// />
const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      mb: 3,
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    <Box>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 0.5 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={index} variant="caption" color="text.secondary">
                {crumb.label}
              </Typography>
            ) : (
              <MuiLink
                key={index}
                component={Link}
                to={crumb.to}
                variant="caption"
                underline="hover"
                color="text.secondary"
              >
                {crumb.label}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      )}

      <Typography variant="h4" fontWeight={700} color="text.primary">
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>

    {actions && (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>{actions}</Box>
    )}
  </Box>
);

export default PageHeader;
