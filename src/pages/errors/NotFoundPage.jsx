import { ArrowBack, HomeOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const NotFoundPage = () => {
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
      {/* Número grande decorativo */}
      <Typography
        variant="h1"
        fontWeight={800}
        sx={{
          fontSize: { xs: "6rem", sm: "10rem" },
          lineHeight: 1,
          color: "primary.lighter",
          textShadow: (t) => `0 4px 24px ${t.palette.primary.light}44`,
          userSelect: "none",
        }}
      >
        404
      </Typography>

      <Box>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={400}>
          La página que buscas no existe o fue movida a otra dirección.
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

export default NotFoundPage;
