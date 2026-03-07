import { Close, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { formatDate } from "../../utils/formatters";

// ─── Parsea el string de anotaciones en un array de { fecha, texto } ──────────
const parseAnotaciones = (raw) => {
  if (!raw) return [];

  // Regex que detecta fechas con formato YYYY-MM-DD HH:MM:SS
  const datePattern = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g;
  const matches = [...raw.matchAll(datePattern)];

  if (matches.length === 0) return [{ fecha: null, texto: raw.trim() }];

  return matches.map((match, i) => {
    const startIndex = match.index + match[0].length;
    // El texto va desde después de la fecha hasta antes de la siguiente fecha (o fin)
    const endIndex = matches[i + 1] ? matches[i + 1].index : raw.length;
    const texto = raw
      .slice(startIndex, endIndex)
      .replace(/^[\s:]+/, "") // quita ": " inicial
      .replace(/,\s*$/, "") // quita coma final
      .trim();

    return { fecha: match[0], texto };
  });
};

// ─── Campo de detalle individual ──────────────────────────────────────────────
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

// ─── Fila individual de anotación ────────────────────────────────────────────
const AnotacionRow = ({ item, idx, isLast }) => (
  <Box
    sx={{
      display: "flex",
      gap: 1.5,
      px: 1.5,
      py: 1,
      alignItems: "flex-start",
      bgcolor: idx % 2 === 0 ? "action.hover" : "transparent",
      borderBottom: !isLast ? "1px solid" : "none",
      borderColor: "divider",
    }}
  >
    {item.fecha && (
      <Typography
        variant="caption"
        sx={{
          whiteSpace: "nowrap",
          color: "primary.main",
          fontWeight: 700,
          fontFamily: "monospace",
          mt: 0.1,
          minWidth: 140,
        }}
      >
        {item.fecha}
      </Typography>
    )}
    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
      {item.texto || "—"}
    </Typography>
  </Box>
);

// ─── Campo especial para Anotaciones (desplegable) ───────────────────────────
const PREVIEW_COUNT = 2;

const AnotacionesField = ({ raw }) => {
  const items = parseAnotaciones(raw);
  const [expanded, setExpanded] = useState(false);

  const hasMore = items.length > PREVIEW_COUNT;
  const visibleItems = expanded ? items : items.slice(0, PREVIEW_COUNT);
  const hiddenCount = items.length - PREVIEW_COUNT;

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        textTransform="uppercase"
        letterSpacing="0.05em"
      >
        Anotaciones
      </Typography>

      <Box
        mt={0.5}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        {/* Primeras 2 filas siempre visibles */}
        {visibleItems.slice(0, PREVIEW_COUNT).map((item, idx) => (
          <AnotacionRow
            key={idx}
            item={item}
            idx={idx}
            isLast={!hasMore && idx === visibleItems.length - 1}
          />
        ))}

        {/* Filas adicionales colapsables */}
        {hasMore && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {items.slice(PREVIEW_COUNT).map((item, idx) => (
              <AnotacionRow
                key={idx + PREVIEW_COUNT}
                item={item}
                idx={idx + PREVIEW_COUNT}
                isLast={idx === items.length - PREVIEW_COUNT - 1}
              />
            ))}
          </Collapse>
        )}

        {/* Botón ver más / ver menos */}
        {hasMore && (
          <Box
            onClick={() => setExpanded((prev) => !prev)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              py: 0.6,
              cursor: "pointer",
              bgcolor: "action.selected",
              borderTop: "1px solid",
              borderColor: "divider",
              "&:hover": { bgcolor: "action.focus" },
              transition: "background-color 0.2s",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="primary.main"
              sx={{ userSelect: "none" }}
            >
              {expanded ? "Ver menos" : `Ver ${hiddenCount} más`}
            </Typography>
            {expanded ? (
              <ExpandLess fontSize="small" color="primary" />
            ) : (
              <ExpandMore fontSize="small" color="primary" />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Sección con título ───────────────────────────────────────────────────────
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

// ─── Dialog principal ─────────────────────────────────────────────────────────
const ReporteDetailDialog = ({ open, reporte, onClose }) => {
  if (!reporte) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* Título */}
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
            Detalle del SOT
          </Typography>
          <Chip
            label={reporte.sot}
            color="primary"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* ── Identificación ──────────────────────────────────────────── */}
          <Section title="Identificación">
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Tipo de Trabajo"
                value={reporte.tipo_trabajo}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="SubTipo de Orden"
                value={reporte.sub_tipo_orden}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Fecha Programada"
                value={formatDate(reporte.fecha_programada)}
              />
            </Grid>
          </Section>

          {/* ── Estado ──────────────────────────────────────────────────── */}
          <Section title="Estado">
            <Grid item xs={6} sm={3}>
              <DetailField label="Estado del SOT" value={reporte.estado_sot} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Estado de Agenda"
                value={reporte.estado_agenda}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Días Transcurridos"
                value={reporte.dilacion_dias}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Estado de Programación"
                value={reporte.tipo_programacion}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Confirmación de Contacto"
                value={reporte.confirmacion}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Contrata Asignada"
                value={reporte.contrata_asignada}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Fecha de Ejecución"
                value={formatDate(reporte.fecha_ejecucion)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Fecha de Rechazo"
                value={formatDate(reporte.fecha_rechazo)}
              />
            </Grid>

            {/* Anotaciones — ocupa toda la fila y con formato especial */}
            {reporte.anotaciones && (
              <Grid item xs={12}>
                <AnotacionesField raw={reporte.anotaciones} />
              </Grid>
            )}
          </Section>

          {/* ── Fecha Generación ────────────────────────────────────────── */}
          <Section title="Fecha Generación">
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Fecha de Generación"
                value={formatDate(reporte.fecha_fecgensot)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Hora de Generación"
                value={reporte.hora_fecgensot}
              />
            </Grid>
          </Section>

          {/* ── Ubicación ───────────────────────────────────────────────── */}
          <Section title="Ubicación">
            <Grid item xs={6} sm={3}>
              <DetailField label="Región" value={reporte.region} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField label="Distrito" value={reporte.distrito} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DetailField label="Franja" value={reporte.franja} />
            </Grid>
          </Section>

          {/* ── Punto de Venta ───────────────────────────────────────────── */}
          <Section title="Punto de Venta">
            <Grid item xs={6} sm={3}>
              <DetailField label="Lugar de Venta" value={reporte.lugar_venta} />
            </Grid>
          </Section>

          {/* ── Responsable ─────────────────────────────────────────────── */}
          <Section title="Responsable">
            <Grid item xs={6} sm={3}>
              <DetailField
                label="Usuario de Venta"
                value={reporte.usuario_venta}
              />
            </Grid>
          </Section>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReporteDetailDialog;
