import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import usersApi from "../../api/usersApi";

// ─── Schema de validación ──────────────────────────────────────────────────────
const createSchema = yup.object({
  name: yup.string().required("El nombre es requerido"),
  middle_name: yup.string(),
  last_name: yup.string().required("El apellido es requerido"),
  second_last_name: yup.string(),
  username: yup.string().required("El username es requerido"),
  password: yup
    .string()
    .required("La contraseña es requerida")
    .min(8, "Mínimo 8 caracteres"),
  role_id: yup
    .number()
    .required("El rol es requerido")
    .typeError("Selecciona un rol"),
  is_active: yup.boolean(),
});

const editSchema = yup.object({
  name: yup.string().required("El nombre es requerido"),
  middle_name: yup.string(),
  last_name: yup.string().required("El apellido es requerido"),
  second_last_name: yup.string(),
  username: yup.string().required("El username es requerido"),
  role_id: yup
    .number()
    .required("El rol es requerido")
    .typeError("Selecciona un rol"),
  is_active: yup.boolean(),
});

const UserFormDrawer = ({ open, user, roleOptions, onClose, onSuccess }) => {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(isEditing ? editSchema : createSchema),
    defaultValues: {
      name: "",
      middle_name: "",
      last_name: "",
      second_last_name: "",
      username: "",
      password: "",
      role_id: "",
      is_active: true,
    },
  });

  // Cargar datos al editar
  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        second_last_name: user.second_last_name || "",
        username: user.username || "",
        role_id: user.role?.id || "",
        is_active: user.is_active ?? true,
      });
    } else if (open && !user) {
      reset({
        name: "",
        middle_name: "",
        last_name: "",
        second_last_name: "",
        username: "",
        password: "",
        role_id: "",
        is_active: true,
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await usersApi.update(user.id, values);
      } else {
        await usersApi.create(values);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 480 }, p: 0 } }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {isEditing ? "Editar usuario" : "Nuevo usuario"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Formulario */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ flex: 1, overflow: "auto", px: 3, py: 3 }}
      >
        <Grid container spacing={2}>
          {/* Nombre */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre *"
              size="small"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name")}
            />
          </Grid>

          {/* Segundo nombre */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Segundo nombre"
              size="small"
              fullWidth
              {...register("middle_name")}
            />
          </Grid>

          {/* Apellido paterno */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido paterno *"
              size="small"
              fullWidth
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              {...register("last_name")}
            />
          </Grid>

          {/* Apellido materno */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido materno"
              size="small"
              fullWidth
              {...register("second_last_name")}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Username */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username *"
              size="small"
              fullWidth
              error={!!errors.username}
              helperText={errors.username?.message}
              {...register("username")}
            />
          </Grid>

          {/* Rol */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Rol *"
              size="small"
              fullWidth
              defaultValue=""
              error={!!errors.role_id}
              helperText={errors.role_id?.message}
              {...register("role_id")}
            >
              <MenuItem value="">Seleccionar</MenuItem>
              {roleOptions.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Contraseña — solo en creación */}
          {!isEditing && (
            <Grid item xs={12}>
              <TextField
                label="Contraseña *"
                type="password"
                size="small"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
              />
            </Grid>
          )}

          {/* Estado activo */}
          <Grid item xs={12}>
            <FormControl>
              <FormLabel sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                Estado
              </FormLabel>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="success"
                      />
                    }
                    label={field.value ? "Activo" : "Inactivo"}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 1,
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
          }
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear usuario"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default UserFormDrawer;
