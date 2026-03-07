import {
  Block,
  CleaningServices,
  Delete,
  Edit,
  LockOpen,
  PersonAdd,
  Refresh,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import usersApi from "../../api/usersApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import useUsers from "../../hooks/useUsers";
import { PAGE_SIZE_OPTIONS } from "../../utils/constants";
import { formatDateTime } from "../../utils/formatters";
import UserDetailDialog from "./UserDetailDialog";
import UserFormDrawer from "./UserFormDrawer";

// ─── Roles disponibles (ajusta según tu BD) ───────────────────────────────────
const ROLE_OPTIONS = [
  { id: 1, label: "Administrador" },
  { id: 2, label: "Coordinador" },
  { id: 3, label: "Supervisor" },
  { id: 4, label: "Usuario" },
];

// ─── Chips de estado ──────────────────────────────────────────────────────────
const EstadoChip = ({ is_active, is_blocked }) => {
  if (is_blocked)
    return (
      <Chip
        label="Bloqueado"
        color="error"
        size="small"
        icon={<Block sx={{ fontSize: "14px !important" }} />}
      />
    );
  if (!is_active) return <Chip label="Inactivo" color="default" size="small" />;
  return <Chip label="Activo" color="success" size="small" />;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const TableSkeleton = ({ rows = 10, cols = 7 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <TableCell key={j}>
            <Box
              sx={{
                height: 14,
                borderRadius: 1,
                backgroundColor: "background.subtle",
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%,100%": { opacity: 1 },
                  "50%": { opacity: 0.4 },
                },
              }}
            />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

// ─── Columnas ─────────────────────────────────────────────────────────────────
const COLUMNS = [
  { id: "nombre", label: "Nombre completo", minWidth: 180 },
  { id: "username", label: "Username", minWidth: 130 },
  { id: "rol", label: "Rol", minWidth: 120 },
  { id: "estado", label: "Estado", minWidth: 110 },
  { id: "last_login", label: "Último acceso", minWidth: 150 },
  { id: "created_at", label: "Creado", minWidth: 150 },
  { id: "acciones", label: "", minWidth: 120, align: "center" },
];

// ─── Página ───────────────────────────────────────────────────────────────────
const UsuariosPage = () => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    user: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const {
    rows,
    meta,
    loading,
    error,
    page,
    pageSize,
    filters,
    setPage,
    setPageSize,
    applyFilters,
    clearFilters,
    handleFilterChange,
    refetch,
  } = useUsers();

  // ── Ver detalle ─────────────────────────────────────────────────────────────
  const handleVerDetalle = (user) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  // ── Abrir drawer de creación ────────────────────────────────────────────────
  const handleCrear = () => {
    setEditingUser(null);
    setDrawerOpen(true);
  };

  // ── Abrir drawer de edición ─────────────────────────────────────────────────
  const handleEditar = (user) => {
    setEditingUser(user);
    setDrawerOpen(true);
  };

  // ── Abrir confirm dialog ────────────────────────────────────────────────────
  const openConfirm = (type, user) =>
    setConfirmDialog({ open: true, type, user });

  const closeConfirm = () =>
    setConfirmDialog({ open: false, type: null, user: null });

  // ── Ejecutar acción confirmada ──────────────────────────────────────────────
  const handleConfirmedAction = async () => {
    const { type, user } = confirmDialog;
    setActionLoading(true);
    try {
      if (type === "delete") await usersApi.remove(user.id);
      if (type === "unblock") await usersApi.unblock(user.id);
      if (type === "resetPassword") await usersApi.resetPassword(user.id);
      closeConfirm();
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Texto del confirm dialog ────────────────────────────────────────────────
  const confirmConfig = {
    delete: {
      title: "Eliminar usuario",
      content: `¿Estás seguro de eliminar a "${confirmDialog.user?.username}"? Esta acción no se puede deshacer.`,
      color: "error",
    },
    unblock: {
      title: "Desbloquear usuario",
      content: `¿Desbloquear al usuario "${confirmDialog.user?.username}"?`,
      color: "primary",
    },
    resetPassword: {
      title: "Resetear contraseña",
      content: `Se generará una contraseña temporal para "${confirmDialog.user?.username}" y deberá cambiarla al iniciar sesión.`,
      color: "warning",
    },
  };

  const currentConfirm = confirmConfig[confirmDialog.type] || {};

  // ── Nombre completo ─────────────────────────────────────────────────────────
  const getFullName = (u) =>
    [u.name, u.middle_name, u.last_name, u.second_last_name]
      .filter(Boolean)
      .join(" ");

  return (
    <Box>
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de usuarios del sistema"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Usuarios" },
        ]}
        actions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Recargar">
              <IconButton
                onClick={refetch}
                disabled={loading}
                size="small"
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                {loading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Refresh fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleCrear}
              size="small"
            >
              Nuevo usuario
            </Button>
          </Box>
        }
      />

      {/* ── Filtros ────────────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Buscar"
                size="small"
                fullWidth
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Nombre o username..."
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Rol"
                size="small"
                fullWidth
                value={filters.role_id}
                onChange={(e) => handleFilterChange("role_id", e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {ROLE_OPTIONS.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Estado"
                size="small"
                fullWidth
                value={filters.is_active}
                onChange={(e) =>
                  handleFilterChange("is_active", e.target.value)
                }
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<CleaningServices />}
                  onClick={clearFilters}
                  disabled={loading}
                  size="small"
                  fullWidth
                >
                  Limpiar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={applyFilters}
                  disabled={loading}
                  size="small"
                  fullWidth
                >
                  Buscar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Info paginación ───────────────────────────────────────────────── */}
      {meta && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {meta.total} usuario{meta.total !== 1 ? "s" : ""} encontrado
            {meta.total !== 1 ? "s" : ""}
          </Typography>
        </Box>
      )}

      {/* ── Tabla ─────────────────────────────────────────────────────────── */}
      <Card variant="outlined">
        <TableContainer component={Paper} elevation={0}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align || "left"}
                    sx={{ minWidth: col.minWidth, whiteSpace: "nowrap" }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableSkeleton rows={pageSize} cols={COLUMNS.length} />
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} sx={{ border: 0, py: 0 }}>
                    <EmptyState
                      title="Sin usuarios"
                      description="No se encontraron usuarios con los filtros aplicados."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    {/* Nombre */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {getFullName(row)}
                      </Typography>
                    </TableCell>

                    {/* Username */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.username}
                      </Typography>
                    </TableCell>

                    {/* Rol */}
                    <TableCell>
                      <Chip
                        label={row.role?.name || "—"}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <EstadoChip
                        is_active={row.is_active}
                        is_blocked={row.is_blocked}
                      />
                    </TableCell>

                    {/* Último acceso */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.last_login ? formatDateTime(row.last_login) : "—"}
                      </Typography>
                    </TableCell>

                    {/* Creado */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(row.created_at)}
                      </Typography>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title="Ver detalle">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleVerDetalle(row)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleEditar(row)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {row.is_blocked && (
                          <Tooltip title="Desbloquear">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => openConfirm("unblock", row)}
                            >
                              <LockOpen fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Resetear contraseña">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => openConfirm("resetPassword", row)}
                          >
                            <Block fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openConfirm("delete", row)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <TablePagination
          component="div"
          count={meta?.total ?? 0}
          page={page - 1}
          rowsPerPage={pageSize}
          onPageChange={(_, newPage) => setPage(newPage + 1)}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(1);
          }}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Card>

      {/* ── Dialogs ───────────────────────────────────────────────────────── */}
      <UserDetailDialog
        open={detailOpen}
        userId={selectedUser?.id}
        onClose={() => setDetailOpen(false)}
      />

      <UserFormDrawer
        open={drawerOpen}
        user={editingUser}
        roleOptions={ROLE_OPTIONS}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={currentConfirm.title}
        content={currentConfirm.content}
        confirmColor={currentConfirm.color}
        loading={actionLoading}
        onConfirm={handleConfirmedAction}
        onCancel={closeConfirm}
      />
    </Box>
  );
};

export default UsuariosPage;
