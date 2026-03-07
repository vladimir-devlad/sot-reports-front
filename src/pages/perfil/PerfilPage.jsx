import { Box, Typography } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";

const PerfilPage = () => (
  <Box>
    <PageHeader
      title="Mi Perfil"
      subtitle="Gestión de tu cuenta"
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Mi Perfil" },
      ]}
    />
    <Typography variant="body2" color="text.secondary">
      Módulo en construcción...
    </Typography>
  </Box>
);

export default PerfilPage;
