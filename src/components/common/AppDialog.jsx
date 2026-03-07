import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

// ─── Uso ───────────────────────────────────────────────────────────────────────
// <AppDialog
//   open={open}
//   title="Nuevo usuario"
//   onClose={() => setOpen(false)}
//   maxWidth="sm"
//   actions={<Button onClick={handleSubmit}>Guardar</Button>}
// >
//   <UsuarioForm />
// </AppDialog>
const AppDialog = ({
  open,
  title,
  onClose,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
  showClose = true,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={maxWidth}
    fullWidth={fullWidth}
  >
    {title && (
      <>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: showClose ? 1 : 3,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {showClose && (
            <IconButton onClick={onClose} size="small">
              <Close fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
        <Divider />
      </>
    )}

    <DialogContent sx={{ pt: 2 }}>{children}</DialogContent>

    {actions && (
      <>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>
      </>
    )}
  </Dialog>
);

export default AppDialog;
