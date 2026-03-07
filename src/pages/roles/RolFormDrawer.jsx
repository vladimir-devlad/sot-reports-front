import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import rolesApi from "../../api/rolesApi";

const schema = yup.object({
  description: yup.string(),
  is_active: yup.boolean(),
});

const RolFormDrawer = ({ open, rol, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { description: "", is_active: true },
  });

  useEffect(() => {
    if (open && rol) {
      reset({
        description: rol.description || "",
        is_active: rol.is_active ?? true,
      });
    }
  }, [open, rol, reset]);

  const onSubmit = async (values) => {
    try {
      await rolesApi.update(rol.id, values);
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
      PaperProps={{ sx: { width: { xs: "100%", sm: 400 }, p: 0 } }}
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
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Editar rol
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {rol?.name}
          </Typography>
        </Box>
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
          {/* Nombre — solo lectura */}
          <Grid item xs={12}>
            <TextField
              label="Nombre del rol"
              size="small"
              fullWidth
              value={rol?.name || ""}
              disabled
              helperText="El nombre del rol no puede modificarse"
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              size="small"
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description")}
            />
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
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default RolFormDrawer;
