import { ArrowBack, HomeOutlined, LockOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
        textAlign: "center",
        gap: 2,
      }}
    >
      {/* Ícono decorativo */}
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "error.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.12,
          position: "absolute",
        }}
      />
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "error.lighter",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LockOutlined sx={{ fontSize: 40, color: "error.main" }} />
      </Box>

      {/* Número */}
      <Typography
        variant="h1"
        fontWeight={800}
        sx={{
          fontSize: { xs: "5rem", sm: "8rem" },
          lineHeight: 1,
          color: "error.main",
          opacity: 0.15,
          userSelect: "none",
          mt: -2,
        }}
      >
        403
      </Typography>

      <Box sx={{ mt: -4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          Acceso denegado
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={400}>
          No tienes permisos para acceder a esta página. Contacta al
          administrador si crees que es un error.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Volver atrás
        </Button>
        <Button
          variant="contained"
          startIcon={<HomeOutlined />}
          onClick={() => navigate(ROUTES.DASHBOARD, { replace: true })}
        >
          Ir al Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default UnauthorizedPage;
