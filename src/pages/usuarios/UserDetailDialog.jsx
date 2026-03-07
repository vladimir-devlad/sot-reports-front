import { Close, Email, Phone } from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import usersApi from "../../api/usersApi";
import { formatDateTime } from "../../utils/formatters";

const DetailField = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={600}
      textTransform="uppercase"
      letterSpacing="0.05em"
    >
      {label}
    </Typography>
    <Typography variant="body2" color="text.primary" mt={0.2}>
      {value || "—"}
    </Typography>
  </Box>
);

const Section = ({ title, children }) => (
  <Box>
    <Typography
      variant="caption"
      fontWeight={700}
      color="primary.main"
      textTransform="uppercase"
      letterSpacing="0.08em"
    >
      {title}
    </Typography>
    <Divider sx={{ mb: 2, mt: 0.5 }} />
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Box>
);

const UserDetailDialog = ({ open, userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    usersApi
      .getById(userId)
      .then(({ data }) => setUser(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, userId]);

  const getFullName = (u) =>
    [u?.name, u?.middle_name, u?.last_name, u?.second_last_name]
      .filter(Boolean)
      .join(" ");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Detalle de Usuario
          </Typography>
          {user && (
            <Chip
              label={user.role?.name || "—"}
              color="primary"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : user ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Datos personales */}
            <Section title="Datos personales">
              <Grid item xs={12} sm={6}>
                <DetailField
                  label="Nombre completo"
                  value={getFullName(user)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DetailField label="Username" value={user.username} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DetailField label="Rol" value={user.role?.name} />
              </Grid>
            </Section>

            {/* Estado */}
            <Section title="Estado de la cuenta">
              <Grid item xs={6} sm={3}>
                <DetailField
                  label="Activo"
                  value={user.is_active ? "Sí" : "No"}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DetailField
                  label="Bloqueado"
                  value={user.is_blocked ? "Sí" : "No"}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DetailField
                  label="Debe cambiar contraseña"
                  value={user.must_change_password ? "Sí" : "No"}
                />
              </Grid>
              {user.blocked_at && (
                <Grid item xs={6} sm={3}>
                  <DetailField
                    label="Bloqueado el"
                    value={formatDateTime(user.blocked_at)}
                  />
                </Grid>
              )}
            </Section>

            {/* Actividad */}
            <Section title="Actividad">
              <Grid item xs={6} sm={3}>
                <DetailField
                  label="Último acceso"
                  value={
                    user.last_login ? formatDateTime(user.last_login) : "—"
                  }
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DetailField
                  label="Contraseña cambiada"
                  value={
                    user.password_changed_at
                      ? formatDateTime(user.password_changed_at)
                      : "—"
                  }
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DetailField
                  label="Creado"
                  value={formatDateTime(user.created_at)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DetailField
                  label="Actualizado"
                  value={formatDateTime(user.updated_at)}
                />
              </Grid>
            </Section>

            {/* Emails */}
            <Section title="Correos electrónicos">
              {user.emails?.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.disabled">
                    Sin correos registrados.
                  </Typography>
                </Grid>
              ) : (
                user.emails?.map((e) => (
                  <Grid item xs={12} sm={6} key={e.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">{e.email}</Typography>
                      {e.is_primary && (
                        <Chip label="Principal" size="small" color="primary" />
                      )}
                    </Box>
                  </Grid>
                ))
              )}
            </Section>

            {/* Teléfonos */}
            <Section title="Teléfonos">
              {user.phones?.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.disabled">
                    Sin teléfonos registrados.
                  </Typography>
                </Grid>
              ) : (
                user.phones?.map((p) => (
                  <Grid item xs={12} sm={6} key={p.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{p.phone}</Typography>
                      {p.is_primary && (
                        <Chip label="Principal" size="small" color="primary" />
                      )}
                    </Box>
                  </Grid>
                ))
              )}
            </Section>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
