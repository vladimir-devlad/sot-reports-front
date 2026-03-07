import {
  Block,
  CleaningServices,
  LockOpen,
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
import razonSocialApi from "../../api/razonSocialApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import useRazonSocial from "../../hooks/useRazonSocial";
import { PAGE_SIZE_OPTIONS } from "../../utils/constants";

// ─── Chip de estado ───────────────────────────────────────────────────────────
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
const TableSkeleton = ({ rows = 10, cols = 4 }) => (
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
  { id: "name_razon_social", label: "Razón Social", minWidth: 220 },
  { id: "username_razon_social", label: "Username", minWidth: 160 },
  { id: "estado", label: "Estado", minWidth: 110 },
  { id: "acciones", label: "", minWidth: 100, align: "center" },
];

// ─── Página ───────────────────────────────────────────────────────────────────
const RazonSocialPage = () => {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
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
  } = useRazonSocial();

  // ── Confirm dialog ──────────────────────────────────────────────────────────
  const openConfirm = (type, item) =>
    setConfirmDialog({ open: true, type, item });
  const closeConfirm = () =>
    setConfirmDialog({ open: false, type: null, item: null });

  const handleConfirmedAction = async () => {
    const { type, item } = confirmDialog;
    setActionLoading(true);
    try {
      if (type === "unblock") await razonSocialApi.unblock(item.id);
      if (type === "resetPassword") await razonSocialApi.resetPassword(item.id);
      closeConfirm();
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmConfig = {
    unblock: {
      title: "Desbloquear razón social",
      content: `¿Desbloquear a "${confirmDialog.item?.name_razon_social}"?`,
      confirmColor: "primary",
    },
    resetPassword: {
      title: "Resetear contraseña",
      content: `Se generará una contraseña temporal para "${confirmDialog.item?.name_razon_social}" y deberá cambiarla al iniciar sesión.`,
      confirmColor: "warning",
    },
  };

  const currentConfirm = confirmConfig[confirmDialog.type] || {};

  return (
    <Box>
      <PageHeader
        title="Razón Social"
        subtitle="Gestión de razones sociales del sistema"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Razón Social" },
        ]}
        actions={
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
        }
      />

      {/* ── Filtros ────────────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                label="Buscar"
                size="small"
                fullWidth
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Nombre o username..."
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
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
            {meta.total} razón{meta.total !== 1 ? "es" : ""} social
            {meta.total !== 1 ? "es" : ""} encontrada
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
                      title="Sin razones sociales"
                      description="No se encontraron razones sociales con los filtros aplicados."
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
                        {row.name_razon_social}
                      </Typography>
                    </TableCell>

                    {/* Username */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.username_razon_social}
                      </Typography>
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <EstadoChip
                        is_active={row.is_active}
                        is_blocked={row.is_blocked}
                      />
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

      {/* ── Confirm dialog ────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={currentConfirm.title}
        content={currentConfirm.content}
        confirmColor={currentConfirm.confirmColor}
        loading={actionLoading}
        onConfirm={handleConfirmedAction}
        onCancel={closeConfirm}
      />
    </Box>
  );
};

export default RazonSocialPage;
