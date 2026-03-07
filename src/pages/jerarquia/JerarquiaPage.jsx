import { AccountTree, Add, Delete, Edit, Refresh } from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import hierarchyApi from "../../api/hierarchyApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import useHierarchy from "../../hooks/useHierarchy";
import { PAGE_SIZE_OPTIONS } from "../../utils/constants";
import HierarchyFormDrawer from "./HierarchyFormDrawer";

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
  { id: "padre", label: "Usuario Padre", minWidth: 200 },
  { id: "hijo", label: "Usuario Hijo", minWidth: 200 },
  { id: "estado", label: "Estado", minWidth: 100 },
  { id: "acciones", label: "", minWidth: 100, align: "center" },
];

// ─── Usuario cell ─────────────────────────────────────────────────────────────
const UserCell = ({ user }) => (
  <Box>
    <Typography variant="body2" fontWeight={600}>
      {user?.name} {user?.last_name}
    </Typography>
    <Chip
      label={user?.role?.name || user?.username}
      size="small"
      variant="outlined"
      color="primary"
      sx={{ mt: 0.3, height: 18, fontSize: "0.65rem" }}
    />
  </Box>
);

// ─── Página ───────────────────────────────────────────────────────────────────
const JerarquiaPage = () => {
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
    setPage,
    setPageSize,
    refetch,
  } = useHierarchy();

  // ── Acciones ────────────────────────────────────────────────────────────────
  const handleCrear = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleEditar = (item) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleEliminar = (item) => setConfirmDialog({ open: true, item });

  const handleConfirmDelete = async () => {
    setActionLoading(true);
    try {
      await hierarchyApi.remove(confirmDialog.item.id);
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
        title="Jerarquía"
        subtitle="Gestión de relaciones jerárquicas entre usuarios"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Jerarquía" },
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
            <Tooltip title="Nueva relación">
              <IconButton
                onClick={handleCrear}
                size="small"
                color="primary"
                sx={{ border: "1px solid", borderColor: "primary.main" }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

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
            {meta.total} relación{meta.total !== 1 ? "es" : ""} encontrada
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
                      title="Sin relaciones jerárquicas"
                      description="No hay relaciones jerárquicas registradas."
                      action={
                        <Tooltip title="Nueva relación">
                          <IconButton color="primary" onClick={handleCrear}>
                            <AccountTree />
                          </IconButton>
                        </Tooltip>
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
                    {/* Padre */}
                    <TableCell>
                      <UserCell user={row.parent} />
                    </TableCell>

                    {/* Hijo */}
                    <TableCell>
                      <UserCell user={row.child} />
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Chip
                        label={row.is_active ? "Activo" : "Inactivo"}
                        color={row.is_active ? "success" : "default"}
                        size="small"
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
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleEditar(row)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminar(row)}
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
      <HierarchyFormDrawer
        open={drawerOpen}
        hierarchy={editingItem}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />

      {/* ── Confirm delete ────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Eliminar relación jerárquica"
        content={`¿Estás seguro de eliminar la relación entre "${confirmDialog.item?.parent?.name} ${confirmDialog.item?.parent?.last_name}" y "${confirmDialog.item?.child?.name} ${confirmDialog.item?.child?.last_name}"?`}
        confirmColor="error"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ open: false, item: null })}
      />
    </Box>
  );
};

export default JerarquiaPage;
