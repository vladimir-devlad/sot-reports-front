import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import useAuth from "../../hooks/useAuth";
import { ROUTES, USER_TYPES } from "../../utils/constants";

// ─── Styled components ────────────────────────────────────────────────────────
const PageContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100dvh",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage: `radial-gradient(ellipse at 50% 50%, ${theme.palette.primary.lighter}, ${theme.palette.background.default})`,
    backgroundRepeat: "no-repeat",
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: theme.shadows[4],
  [theme.breakpoints.up("sm")]: {
    maxWidth: 450,
  },
}));

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  username: yup
    .string()
    .required("El usuario es requerido")
    .min(3, "Mínimo 3 caracteres"),
  password: yup
    .string()
    .required("La contraseña es requerida")
    .min(4, "Mínimo 4 caracteres"),
});

// ─── Parsear error del backend ─────────────────────────────────────────────────
const parseError = (error) => {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message || error?.response?.data?.detail;
  if (status === 401) return "Usuario o contraseña incorrectos.";
  if (status === 403)
    return message || "Cuenta bloqueada. Intente en 10 minutos.";
  if (status === 423)
    return "Cuenta bloqueada por múltiples intentos fallidos.";
  if (!status) return "No se pudo conectar con el servidor.";
  return message || "Ocurrió un error inesperado.";
};

// ─── Página ────────────────────────────────────────────────────────────────────
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const from = location.state?.from || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    setError("");
    try {
      const result = await login(values);

      if (result.mustChangePassword) {
        navigate(ROUTES.CHANGE_PASSWORD, { replace: true });
        return;
      }

      // ── Razón social siempre va directo a reportes ─────────────────────
      if (result.userType === USER_TYPES.RAZON_SOCIAL) {
        navigate(ROUTES.REPORTES, { replace: true });
      } else {
        navigate(from !== ROUTES.LOGIN ? from : ROUTES.DASHBOARD, {
          replace: true,
        });
      }
    } catch (err) {
      setError(parseError(err));
    }
  };

  return (
    <PageContainer direction="column" justifyContent="space-between">
      <FormCard variant="outlined">
        {/* ── Logo ──────────────────────────────────────────────────── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            component="img"
            src="/assets/claro.svg"
            alt="Claro"
            sx={{
              height: 40,
              width: "auto",
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              color="primary.main"
              lineHeight={1.1}
            >
              SOT
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Sistema de Reportes
            </Typography>
          </Box>
        </Box>

        {/* ── Título ────────────────────────────────────────────────── */}
        <Typography component="h1" variant="h4" fontWeight={700}>
          Iniciar sesión
        </Typography>

        {/* ── Error global ──────────────────────────────────────────── */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* ── Formulario ────────────────────────────────────────────── */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Usuario */}
          <FormControl>
            <FormLabel htmlFor="username">Usuario</FormLabel>
            <TextField
              id="username"
              placeholder="Tu nombre de usuario"
              autoComplete="username"
              autoFocus
              fullWidth
              variant="outlined"
              size="small"
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={isLoading}
              {...register("username")}
            />
          </FormControl>

          {/* Contraseña */}
          <FormControl>
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              fullWidth
              variant="outlined"
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register("password")}
            />
          </FormControl>

          {/* Botón */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={18} color="inherit" /> : null
            }
            sx={{ mt: 1, py: 1.3, fontWeight: 600 }}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </Box>

        <Divider />

        {/* ── Footer ────────────────────────────────────────────────── */}
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Acceso exclusivo para personal autorizado y razones sociales
          registradas.
        </Typography>
      </FormCard>

      {/* ── Copyright ─────────────────────────────────────────────────── */}
      <Typography
        variant="caption"
        color="text.disabled"
        textAlign="center"
        sx={{ py: 2 }}
      >
        © {new Date().getFullYear()} SOT — Todos los derechos reservados
      </Typography>
    </PageContainer>
  );
};

export default LoginPage;
