import {
  Add,
  CleaningServices,
  Delete,
  Edit,
  LinkOff,
  Refresh,
  Search,
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
import userRazonSocialApi from "../../api/userRazonSocialApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import useAsignaciones from "../../hooks/useAsignaciones";
import { PAGE_SIZE_OPTIONS } from "../../utils/constants";
import { formatDateTime } from "../../utils/formatters";
import AsignacionFormDrawer from "./AsignacionFormDrawer";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const TableSkeleton = ({ rows = 10, cols = 5 }) => (
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
  { id: "usuario", label: "Usuario", minWidth: 200 },
  { id: "razon_social", label: "Razón Social", minWidth: 220 },
  { id: "estado", label: "Estado", minWidth: 100 },
  { id: "assigned_at", label: "Fecha Asign.", minWidth: 150 },
  { id: "acciones", label: "", minWidth: 100, align: "center" },
];

// ─── Página ───────────────────────────────────────────────────────────────────
const AsignacionesPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    item: null,
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
  } = useAsignaciones();

  // ── Acciones ────────────────────────────────────────────────────────────────
  const handleCrear = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };
  const handleEditar = (item) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };
  const handleRevocar = (item) => setConfirmDialog({ open: true, item });

  const handleConfirmRevoke = async () => {
    setActionLoading(true);
    try {
      await userRazonSocialApi.revoke(confirmDialog.item.id);
      setConfirmDialog({ open: false, item: null });
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Asignaciones"
        subtitle="Gestión de asignaciones usuario — razón social"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Asignaciones" },
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
              startIcon={<Add />}
              onClick={handleCrear}
              size="small"
            >
              Nueva asignación
            </Button>
          </Box>
        }
      />

      {/* ── Filtros ────────────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Buscar usuario"
                size="small"
                fullWidth
                value={filters.search_user}
                onChange={(e) =>
                  handleFilterChange("search_user", e.target.value)
                }
                placeholder="Nombre o username..."
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Buscar razón social"
                size="small"
                fullWidth
                value={filters.search_razon_social}
                onChange={(e) =>
                  handleFilterChange("search_razon_social", e.target.value)
                }
                placeholder="Nombre de razón social..."
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
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

            <Grid item xs={12} sm={6} md={4}>
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
            {meta.total} asignación{meta.total !== 1 ? "es" : ""} encontrada
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
                      title="Sin asignaciones"
                      description="No hay asignaciones registradas con los filtros aplicados."
                      action={
                        <Button
                          variant="contained"
                          startIcon={<LinkOff />}
                          onClick={handleCrear}
                          size="small"
                        >
                          Nueva asignación
                        </Button>
                      }
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
                    {/* Usuario */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.user?.name} {row.user?.last_name}
                      </Typography>
                      <Chip
                        label={row.user?.role?.name || row.user?.username}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 0.3, height: 18, fontSize: "0.65rem" }}
                      />
                    </TableCell>

                    {/* Razón Social */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.razon_social?.name_razon_social}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.razon_social?.username_razon_social}
                      </Typography>
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Chip
                        label={row.is_active ? "Activo" : "Inactivo"}
                        color={row.is_active ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>

                    {/* Fecha asignación */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(row.assigned_at)}
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
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleEditar(row)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Revocar asignación">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRevocar(row)}
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

      {/* ── Drawer ────────────────────────────────────────────────────────── */}
      <AsignacionFormDrawer
        open={drawerOpen}
        asignacion={editingItem}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />

      {/* ── Confirm revoke ────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Revocar asignación"
        content={`¿Revocar la asignación de "${confirmDialog.item?.user?.name} ${confirmDialog.item?.user?.last_name}" con "${confirmDialog.item?.razon_social?.name_razon_social}"?`}
        confirmColor="error"
        confirmLabel="Revocar"
        loading={actionLoading}
        onConfirm={handleConfirmRevoke}
        onCancel={() => setConfirmDialog({ open: false, item: null })}
      />
    </Box>
  );
};

export default AsignacionesPage;
