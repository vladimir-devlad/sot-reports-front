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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import razonSocialApi from "../../api/razonSocialApi";
import userRazonSocialApi from "../../api/userRazonSocialApi";
import usersApi from "../../api/usersApi";

const createSchema = yup.object({
  user_id: yup
    .number()
    .required("El usuario es requerido")
    .typeError("Selecciona un usuario"),
  razon_social_id: yup
    .number()
    .required("La razón social es requerida")
    .typeError("Selecciona una razón social"),
});

const editSchema = yup.object({
  is_active: yup.boolean(),
});

const AsignacionFormDrawer = ({ open, asignacion, onClose, onSuccess }) => {
  const isEditing = !!asignacion;
  const [users, setUsers] = useState([]);
  const [razonesSociales, setRazonesSociales] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // ── Cargar usuarios y razones sociales para los selects ───────────────────
  useEffect(() => {
    if (!open || isEditing) return;
    setLoadingOptions(true);
    Promise.all([
      usersApi.list({ page: 1, page_size: 200 }),
      razonSocialApi.list({ page: 1, page_size: 200 }),
    ])
      .then(([usersRes, razonRes]) => {
        setUsers(usersRes.data.data);
        setRazonesSociales(razonRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoadingOptions(false));
  }, [open, isEditing]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(isEditing ? editSchema : createSchema),
    defaultValues: isEditing
      ? { is_active: asignacion?.is_active ?? true }
      : { user_id: "", razon_social_id: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (isEditing) {
      reset({ is_active: asignacion?.is_active ?? true });
    } else {
      reset({ user_id: "", razon_social_id: "" });
    }
  }, [open, asignacion, isEditing, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await userRazonSocialApi.update(asignacion.id, values);
      } else {
        await userRazonSocialApi.assign(values);
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
      PaperProps={{ sx: { width: { xs: "100%", sm: 440 }, p: 0 } }}
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
          {isEditing ? "Editar asignación" : "Nueva asignación"}
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
          {!isEditing ? (
            <>
              {/* Usuario */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Usuario *"
                  size="small"
                  fullWidth
                  defaultValue=""
                  error={!!errors.user_id}
                  helperText={errors.user_id?.message}
                  disabled={loadingOptions}
                  {...register("user_id")}
                >
                  <MenuItem value="">
                    {loadingOptions ? "Cargando..." : "Seleccionar usuario"}
                  </MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name} {u.last_name} — {u.role?.name || u.username}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Razón Social */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Razón Social *"
                  size="small"
                  fullWidth
                  defaultValue=""
                  error={!!errors.razon_social_id}
                  helperText={errors.razon_social_id?.message}
                  disabled={loadingOptions}
                  {...register("razon_social_id")}
                >
                  <MenuItem value="">
                    {loadingOptions
                      ? "Cargando..."
                      : "Seleccionar razón social"}
                  </MenuItem>
                  {razonesSociales.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name_razon_social}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </>
          ) : (
            <>
              {/* Info de la asignación al editar */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "background.subtle",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    USUARIO
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {asignacion?.user?.name} {asignacion?.user?.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {asignacion?.user?.role?.name}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    RAZÓN SOCIAL
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {asignacion?.razon_social?.name_razon_social}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {asignacion?.razon_social?.username_razon_social}
                  </Typography>
                </Box>
              </Grid>

              {/* Estado */}
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
            </>
          )}
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
          disabled={isSubmitting || loadingOptions}
          startIcon={
            isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
          }
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Asignar"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default AsignacionFormDrawer;
