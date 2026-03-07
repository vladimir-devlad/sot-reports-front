import {
  CleaningServices,
  CloudSync,
  FileDownload,
  FilterList,
  FilterListOff,
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
  Collapse,
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/es";
import { useState } from "react";
import sotReportesApi from "../../api/sotReportesApi";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import useAuth from "../../hooks/useAuth";
import useEtlLogs from "../../hooks/useEtlLogs";
import useSotReportes from "../../hooks/useSotReportes";
import { PAGE_SIZE_OPTIONS, USER_TYPES } from "../../utils/constants";
import { exportReportesToExcel } from "../../utils/exportExcel";
import { formatDateTime, formatPaginationInfo } from "../../utils/formatters";
import ReporteDetailDialog from "./ReporteDetailDialog";

// ─── Opciones de filtros ───────────────────────────────────────────────────────
const ESTADO_SOT_OPTIONS = [
  "PENDIENTE",
  "EN PROCESO",
  "COMPLETADO",
  "CANCELADO",
  "ANULADO",
];
const ESTADO_AGENDA_OPTIONS = [
  "PROGRAMADO",
  "REPROGRAMADO",
  "NO PROGRAMADO",
  "REALIZADO",
];
const PROCESO_OPTIONS = [
  "INSTALACION",
  "MANTENIMIENTO",
  "RETIRO",
  "VERIFICACION",
];
const TIPO_TRABAJO_OPTIONS = ["NORMAL", "URGENTE", "PROGRAMADO"];

// ─── Chip de estado con colores ───────────────────────────────────────────────
const EstadoChip = ({ value, type = "sot" }) => {
  if (!value)
    return (
      <Typography variant="caption" color="text.disabled">
        —
      </Typography>
    );

  const colorMap = {
    sot: {
      PENDIENTE: "warning",
      "EN PROCESO": "info",
      COMPLETADO: "success",
      CANCELADO: "error",
      ANULADO: "default",
    },
    agenda: {
      PROGRAMADO: "primary",
      REPROGRAMADO: "warning",
      "NO PROGRAMADO": "default",
      REALIZADO: "success",
    },
  };

  const color = colorMap[type]?.[value?.toUpperCase()] || "default";
  return <Chip label={value} color={color} size="small" />;
};

// ─── Panel de filtros ─────────────────────────────────────────────────────────
const FilterPanel = ({ filters, onChange, onApply, onClear, loading }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
    <Card variant="outlined" sx={{ mb: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          mb={2}
        >
          Filtros de búsqueda
        </Typography>

        <Grid container spacing={2} alignItems="flex-end">
          {/* Búsqueda por SOT */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Buscar por SOT"
              size="small"
              fullWidth
              value={filters.sot}
              onChange={(e) => {
                onChange("sot", e.target.value);
                // Aplicar filtro automáticamente al escribir
                setImmediate(() => applyFilters());
              }}
              placeholder="Nº de SOT..."
            />
          </Grid>

          {/* Estado SOT */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Estado SOT"
              size="small"
              fullWidth
              value={filters.estado_sot}
              onChange={(e) => onChange("estado_sot", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {ESTADO_SOT_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}

          {/* Estado Agenda */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Estado Agenda"
              size="small"
              fullWidth
              value={filters.estado_agenda}
              onChange={(e) => onChange("estado_agenda", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {ESTADO_AGENDA_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}

          {/* Proceso */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Proceso"
              size="small"
              fullWidth
              value={filters.proceso}
              onChange={(e) => onChange("proceso", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {PROCESO_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}

          {/* Tipo Trabajo */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Tipo Trabajo"
              size="small"
              fullWidth
              value={filters.tipo_trabajo}
              onChange={(e) => onChange("tipo_trabajo", e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {TIPO_TRABAJO_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}

          {/* Región */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Región"
              size="small"
              fullWidth
              value={filters.region}
              onChange={(e) => onChange("region", e.target.value)}
              placeholder="Ej: LIMA"
            />
          </Grid> */}

          {/* Distrito */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Distrito"
              size="small"
              fullWidth
              value={filters.distrito}
              onChange={(e) => onChange("distrito", e.target.value)}
              placeholder="Ej: MIRAFLORES"
            />
          </Grid> */}

          {/* Fecha desde */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Fecha desde"
              value={filters.fecha_desde}
              onChange={(val) => onChange("fecha_desde", val)}
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
            />
          </Grid> */}

          {/* Fecha hasta */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Fecha hasta"
              value={filters.fecha_hasta}
              onChange={(val) => onChange("fecha_hasta", val)}
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
            />
          </Grid> */}

          {/* Botones */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CleaningServices />}
                onClick={onClear}
                disabled={loading}
                size="small"
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={onApply}
                disabled={loading}
                size="small"
              >
                Buscar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  </LocalizationProvider>
);

// ─── Skeleton de tabla ────────────────────────────────────────────────────────
const TableSkeleton = ({ rows = 10, cols = 10 }) => (
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
                  "0%, 100%": { opacity: 1 },
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

// ─── Columnas de la tabla ──────────────────────────────────────────────────────
const COLUMNS = [
  { id: "sot", label: "ID SOT", minWidth: 100, align: "center" },
  {
    id: "dilacion_dias",
    label: "Días Transcurridos",
    minWidth: 120,
    align: "center",
  },
  // { id: "fecha_fecgensot", label: "Fecha Generación", minWidth: 130 },
  // { id: "proceso", label: "Tipo de Proceso", minWidth: 130, align: "center" },
  {
    id: "tipo_trabajo",
    label: "Tipo de Trabajo",
    minWidth: 130,
    align: "center",
  },
  {
    id: "estado_sot",
    label: "Estado de la SOT",
    minWidth: 130,
    align: "center",
  },
  //   { id: "estado_agenda", label: "Estado Agenda", minWidth: 140 },
  // {
  //   id: "fecha_programada",
  //   label: "Fecha Prog.",
  //   minWidth: 120,
  //   align: "center",
  // },
  { id: "region", label: "Región", minWidth: 100, align: "center" },
  { id: "distrito", label: "Distrito", minWidth: 120, align: "center" },
  { id: "acciones", label: "", minWidth: 60, align: "center" },
];

// ─── Página principal ─────────────────────────────────────────────────────────
const SotReportesPage = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { user, userType, isRazonSocial } = useAuth();
  const { ultimaCarga, loading: etlLoading } = useEtlLogs();

  // ── Título dinámico según tipo de usuario ─────────────────────────────────
  const pageTitle = isRazonSocial
    ? user?.name_razon_social || "SOT Reportes"
    : "SOT Reportes";

  const {
    rows,
    meta,
    loading,
    error,
    page,
    pageSize,
    filters,
    appliedFilters,
    setPage,
    setPageSize,
    applyFilters,
    clearFilters,
    handleFilterChange,
    refetch,
  } = useSotReportes();

  // ── Ver detalle ───────────────────────────────────────────────────────────
  const handleVerDetalle = (reporte) => {
    setSelectedReporte(reporte);
    setDetailOpen(true);
  };

  // ── Paginación ────────────────────────────────────────────────────────────
  const handlePageChange = (_, newPage) => setPage(newPage + 1);

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1);
  };

  // ── Exportar Excel ────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const apiFn =
        userType === USER_TYPES.RAZON_SOCIAL
          ? sotReportesApi.getExternal
          : sotReportesApi.getInternal;

      const cleanFilters = Object.fromEntries(
        Object.entries(appliedFilters).filter(
          ([, v]) => v !== "" && v !== null,
        ),
      );

      // ── Primer request para saber el total real ────────────────────────────
      const firstPage = await apiFn({
        ...cleanFilters,
        page: 1,
        page_size: 100,
      });
      const total = firstPage.data.meta?.total || 0;
      const allRows = [...firstPage.data.data];

      // ── Si hay más páginas, traerlas todas ────────────────────────────────
      const totalPages = Math.ceil(total / 100);
      for (let p = 2; p <= totalPages; p++) {
        const { data } = await apiFn({
          ...cleanFilters,
          page: p,
          page_size: 100,
        });
        allRows.push(...data.data);
      }

      const filename = isRazonSocial
        ? `SOT_${user?.name_razon_social?.replace(/\s+/g, "_") || "Reportes"}`
        : "SOT_Reportes";

      exportReportesToExcel(allRows, filename);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title={pageTitle}
        subtitle="SOT Pendientes y Rechazados"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "SOT Reportes" },
        ]}
        actions={
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Toggle filtros */}
            <Tooltip
              title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            >
              <IconButton
                onClick={() => setShowFilters((p) => !p)}
                color={showFilters ? "primary" : "default"}
                size="small"
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                {showFilters ? <FilterListOff /> : <FilterList />}
              </IconButton>
            </Tooltip>

            {/* Recargar */}
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

            {/* Exportar Excel */}
            <Tooltip
              title={
                rows.length === 0
                  ? "Sin datos para exportar"
                  : "Exportar a Excel"
              }
            >
              <span>
                <IconButton
                  onClick={handleExport}
                  disabled={exporting || loading || rows.length === 0}
                  size="small"
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  {exporting ? (
                    <CircularProgress size={16} />
                  ) : (
                    <FileDownload fontSize="small" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        }
      />

      {/* ── Última actualización ETL ──────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          px: 1.5,
          py: 1,
          borderRadius: 2,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          width: "fit-content",
        }}
      >
        <CloudSync sx={{ fontSize: 16, color: "info.main" }} />
        {etlLoading ? (
          <Typography variant="caption" color="text.secondary">
            Cargando última actualización...
          </Typography>
        ) : ultimaCarga ? (
          <Typography variant="caption" color="text.secondary">
            Última actualización:{" "}
            <Typography
              component="span"
              variant="caption"
              fontWeight={700}
              color="text.primary"
            >
              {formatDateTime(
                ultimaCarga.finalizado_at || ultimaCarga.iniciado_at,
              )}
            </Typography>
            {ultimaCarga.total_registros != null && (
              <>
                {" · "}
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                ></Typography>
              </>
            )}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.disabled">
            Sin información de última carga
          </Typography>
        )}
      </Box>

      {/* ── Panel de filtros ──────────────────────────────────────────────── */}
      <Collapse in={showFilters}>
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onApply={applyFilters}
          onClear={clearFilters}
          loading={loading}
        />
      </Collapse>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={refetch}>
          {error}
        </Alert>
      )}

      {/* ── Info de paginación ────────────────────────────────────────────── */}
      {meta && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {formatPaginationInfo(meta)}
          </Typography>
        </Box>
      )}

      {/* ── Tabla ─────────────────────────────────────────────────────────── */}
      <Card variant="outlined">
        <TableContainer component={Paper} elevation={0}>
          <Table size="small" stickyHeader>
            {/* Cabecera */}
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

            {/* Cuerpo */}
            <TableBody>
              {loading ? (
                <TableSkeleton rows={pageSize} cols={COLUMNS.length} />
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} sx={{ border: 0, py: 0 }}>
                    <EmptyState
                      title="Sin reportes"
                      description="No se encontraron reportes con los filtros aplicados."
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
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary.main"
                        align="center"
                      >
                        {row.sot || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" align="center">
                        {row.dilacion_dias || "—"}
                      </Typography>
                    </TableCell>
                    {/* <TableCell>
                      <Typography variant="body2" align="center">
                        {row.proceso || "—"}
                      </Typography>
                    </TableCell> */}
                    <TableCell>
                      <Typography variant="body2" align="center">
                        {/* {row.tipo_trabajo || "—"} */}
                        {row.tipo_trabajo
                          ? row.tipo_trabajo.split("-")[0].trim()
                          : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <EstadoChip value={row.estado_sot} type="sot" />
                    </TableCell>
                    {/* <TableCell>
                      <Typography variant="body2" align="center">
                        {formatDate(row.fecha_programada)}
                      </Typography>
                    </TableCell> */}
                    <TableCell>
                      <Typography variant="body2" align="center">
                        {row.region || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" align="center">
                        {row.distrito || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalle">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleVerDetalle(row)}
                        >
                          <Visibility fontSize="small" />
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

        {/* Paginación */}
        <TablePagination
          component="div"
          count={meta?.total ?? 0}
          page={page - 1}
          rowsPerPage={pageSize}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Card>

      {/* ── Dialog de detalle ─────────────────────────────────────────────── */}
      <ReporteDetailDialog
        open={detailOpen}
        reporte={selectedReporte}
        onClose={() => setDetailOpen(false)}
      />
    </Box>
  );
};

export default SotReportesPage;
