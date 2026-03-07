import { yupResolver } from "@hookform/resolvers/yup";
import {
  CheckCircle,
  LockReset,
  RadioButtonUnchecked,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { authApi } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import { ROUTES, USER_TYPES } from "../../utils/constants";

// ─── Estilos ───────────────────────────────────────────────────────────────────
const PageContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 440,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${theme.palette.divider}`,
}));

// ─── Reglas de contraseña ─────────────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "length", label: "Mínimo 8 caracteres", test: (v) => v.length >= 8 },
  {
    id: "upper",
    label: "Al menos una mayúscula",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: "lower",
    label: "Al menos una minúscula",
    test: (v) => /[a-z]/.test(v),
  },
  { id: "number", label: "Al menos un número", test: (v) => /\d/.test(v) },
  {
    id: "special",
    label: "Al menos un carácter especial",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = yup.object({
  current_password: yup.string().required("La contraseña actual es requerida"),
  new_password: yup
    .string()
    .required("La nueva contraseña es requerida")
    .min(8, "Mínimo 8 caracteres")
    .matches(/[A-Z]/, "Debe tener al menos una mayúscula")
    .matches(/[a-z]/, "Debe tener al menos una minúscula")
    .matches(/\d/, "Debe tener al menos un número")
    .matches(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial"),
  confirm_password: yup
    .string()
    .required("Confirma tu nueva contraseña")
    .oneOf([yup.ref("new_password")], "Las contraseñas no coinciden"),
});

// ─── Campo de contraseña con toggle ───────────────────────────────────────────
const PasswordField = ({
  label,
  fieldId,
  error,
  helperText,
  disabled,
  registration,
}) => {
  const [show, setShow] = useState(false);
  return (
    <FormControl>
      <FormLabel htmlFor={fieldId}>{label}</FormLabel>
      <TextField
        id={fieldId}
        type={show ? "text" : "password"}
        placeholder="••••••••"
        fullWidth
        size="small"
        error={error}
        helperText={helperText}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShow((p) => !p)}
                edge="end"
                size="small"
                tabIndex={-1}
              >
                {show ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...registration}
      />
    </FormControl>
  );
};

// ─── Página ────────────────────────────────────────────────────────────────────
const ChangePasswordPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { userType, clearMustChangePassword, logout } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const newPassword = watch("new_password", "");

  const onSubmit = async (values) => {
    setError("");
    try {
      const payload = {
        current_password: values.current_password,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      };

      if (userType === USER_TYPES.RAZON_SOCIAL) {
        await authApi.changePasswordRazonSocial(payload);
      } else {
        await authApi.changePasswordInterno(payload);
      }

      setSuccess(true);
      clearMustChangePassword();
      setTimeout(() => navigate(ROUTES.DASHBOARD, { replace: true }), 1500);
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      if (status === 400)
        setError(message || "La contraseña actual es incorrecta.");
      else
        setError(
          message || "No se pudo cambiar la contraseña. Intenta de nuevo.",
        );
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      <CssBaseline />
      <PageContainer>
        <FormCard variant="outlined">
          {/* ── Ícono + título ────────────────────────────────────────── */}
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "primary.lighter",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
              }}
            >
              <LockReset color="primary" sx={{ fontSize: 28 }} />
            </Box>
            <Typography component="h1" variant="h5" fontWeight={700}>
              Cambiar contraseña
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Por seguridad debes establecer una nueva contraseña antes de
              continuar.
            </Typography>
          </Box>

          <Divider />

          {/* ── Alertas ───────────────────────────────────────────────── */}
          {success && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              ¡Contraseña actualizada! Redirigiendo al sistema...
            </Alert>
          )}
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
            {/* Contraseña actual */}
            <PasswordField
              label="Contraseña actual"
              fieldId="current_password"
              error={!!errors.current_password}
              helperText={errors.current_password?.message}
              disabled={isSubmitting || success}
              registration={register("current_password")}
            />

            <Divider />

            {/* Nueva contraseña */}
            <PasswordField
              label="Nueva contraseña"
              fieldId="new_password"
              error={!!errors.new_password}
              helperText={errors.new_password?.message}
              disabled={isSubmitting || success}
              registration={register("new_password")}
            />

            {/* Confirmar contraseña */}
            <PasswordField
              label="Confirmar nueva contraseña"
              fieldId="confirm_password"
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              disabled={isSubmitting || success}
              registration={register("confirm_password")}
            />

            {/* ── Indicador de reglas en tiempo real ─────────────────── */}
            {newPassword.length > 0 && (
              <Box
                sx={{
                  backgroundColor: "background.subtle",
                  borderRadius: 2,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  Requisitos
                </Typography>
                <List dense disablePadding sx={{ mt: 0.5 }}>
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(newPassword);
                    return (
                      <ListItem key={rule.id} disablePadding sx={{ py: 0.15 }}>
                        <ListItemIcon sx={{ minWidth: 26 }}>
                          {passed ? (
                            <CheckCircle
                              sx={{ fontSize: 15 }}
                              color="success"
                            />
                          ) : (
                            <RadioButtonUnchecked
                              sx={{ fontSize: 15 }}
                              color="disabled"
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={rule.label}
                          primaryTypographyProps={{
                            variant: "caption",
                            color: passed ? "success.main" : "text.secondary",
                            fontWeight: passed ? 600 : 400,
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting || success}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
              sx={{ mt: 0.5, py: 1.2 }}
            >
              {isSubmitting ? "Guardando..." : "Cambiar contraseña"}
            </Button>
          </Box>

          {/* ── Cerrar sesión ─────────────────────────────────────────── */}
          <Typography
            variant="caption"
            color="text.disabled"
            textAlign="center"
          >
            ¿No eres tú?{" "}
            <Link
              component="button"
              type="button"
              variant="caption"
              underline="hover"
              color="primary"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Link>
          </Typography>
        </FormCard>
      </PageContainer>
    </>
  );
};

export default ChangePasswordPage;
