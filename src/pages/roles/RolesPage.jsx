import { Edit, Refresh } from "@mui/icons-material";
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
import { useCallback, useEffect, useState } from "react";
import rolesApi from "../../api/rolesApi";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import { PAGE_SIZE_OPTIONS } from "../../utils/constants";
import { formatDateTime } from "../../utils/formatters";
import RolFormDrawer from "./RolFormDrawer";

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
  { id: "name", label: "Nombre", minWidth: 160 },
  { id: "description", label: "Descripción", minWidth: 240 },
  { id: "estado", label: "Estado", minWidth: 100 },
  { id: "created_at", label: "Creado", minWidth: 160 },
  { id: "acciones", label: "", minWidth: 60, align: "center" },
];

// ─── Página ───────────────────────────────────────────────────────────────────
const RolesPage = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRol, setEditingRol] = useState(null);

  const fetchData = useCallback(async (currentPage, currentPageSize) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await rolesApi.list({
        page: currentPage,
        page_size: currentPageSize,
      });
      setRows(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar los roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize, fetchData]);

  const refetch = () => fetchData(page, pageSize);
  const handleEditar = (rol) => {
    setEditingRol(rol);
    setDrawerOpen(true);
  };

  return (
    <Box>
      <PageHeader
        title="Roles"
        subtitle="Gestión de roles del sistema"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Roles" },
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
            {meta.total} rol{meta.total !== 1 ? "es" : ""} encontrado
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
                      title="Sin roles"
                      description="No hay roles registrados en el sistema."
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
                      <Chip
                        label={row.name}
                        color="primary"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    {/* Descripción */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.description || "—"}
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

                    {/* Creado */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(row.created_at)}
                      </Typography>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleEditar(row)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
      <RolFormDrawer
        open={drawerOpen}
        rol={editingRol}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />
    </Box>
  );
};

export default RolesPage;
