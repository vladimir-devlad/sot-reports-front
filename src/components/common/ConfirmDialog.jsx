import { WarningAmber } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// ─── Uso ───────────────────────────────────────────────────────────────────────
// <ConfirmDialog
//   open={open}
//   title="Eliminar usuario"
//   description="¿Estás seguro? Esta acción no se puede deshacer."
//   onConfirm={handleDelete}
//   onCancel={() => setOpen(false)}
//   loading={isDeleting}
//   confirmLabel="Eliminar"
//   confirmColor="error"
// />
const ConfirmDialog = ({
  open,
  title = "¿Confirmar acción?",
  description = "Esta acción no se puede deshacer.",
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmColor = "error",
}) => (
  <Dialog
    open={open}
    onClose={!loading ? onCancel : undefined}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <WarningAmber color={confirmColor} />
      {title}
    </DialogTitle>

    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button
        onClick={onCancel}
        disabled={loading}
        variant="outlined"
        color="inherit"
      >
        {cancelLabel}
      </Button>
      <Button
        onClick={onConfirm}
        disabled={loading}
        variant="contained"
        color={confirmColor}
        startIcon={
          loading ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
