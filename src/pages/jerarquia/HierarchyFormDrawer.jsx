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
import hierarchyApi from "../../api/hierarchyApi";
import usersApi from "../../api/usersApi";

// ─── Schema ───────────────────────────────────────────────────────────────────
const createSchema = yup.object({
  parent_user_id: yup
    .number()
    .required("El usuario padre es requerido")
    .typeError("Selecciona un usuario"),
  child_user_id: yup
    .number()
    .required("El usuario hijo es requerido")
    .typeError("Selecciona un usuario"),
});

const editSchema = yup.object({
  is_active: yup.boolean(),
});

const HierarchyFormDrawer = ({ open, hierarchy, onClose, onSuccess }) => {
  const isEditing = !!hierarchy;
  const [users, setUsers] = useState([]);

  // ── Cargar usuarios para los selects ──────────────────────────────────────
  useEffect(() => {
    if (!open || isEditing) return;
    usersApi
      .list({ page: 1, page_size: 200 })
      .then(({ data }) => setUsers(data.data))
      .catch(console.error);
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
      ? { is_active: hierarchy?.is_active ?? true }
      : { parent_user_id: "", child_user_id: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (isEditing) {
      reset({ is_active: hierarchy?.is_active ?? true });
    } else {
      reset({ parent_user_id: "", child_user_id: "" });
    }
  }, [open, hierarchy, isEditing, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await hierarchyApi.update(hierarchy.id, values);
      } else {
        await hierarchyApi.create(values);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const getUserLabel = (u) =>
    `${u.name} ${u.last_name} (${u.role?.name || u.username})`;

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
          {isEditing ? "Editar relación" : "Nueva relación jerárquica"}
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
              {/* Usuario padre */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Usuario padre *"
                  size="small"
                  fullWidth
                  defaultValue=""
                  error={!!errors.parent_user_id}
                  helperText={
                    errors.parent_user_id?.message || "El usuario que supervisa"
                  }
                  {...register("parent_user_id")}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {getUserLabel(u)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Usuario hijo */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Usuario hijo *"
                  size="small"
                  fullWidth
                  defaultValue=""
                  error={!!errors.child_user_id}
                  helperText={
                    errors.child_user_id?.message || "El usuario supervisado"
                  }
                  {...register("child_user_id")}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {getUserLabel(u)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </>
          ) : (
            <>
              {/* Info de la relación al editar */}
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
                    PADRE
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {hierarchy?.parent?.name} {hierarchy?.parent?.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {hierarchy?.parent?.role?.name}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    HIJO
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {hierarchy?.child?.name} {hierarchy?.child?.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {hierarchy?.child?.role?.name}
                  </Typography>
                </Box>
              </Grid>

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
              : "Crear relación"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default HierarchyFormDrawer;
