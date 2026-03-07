import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { formatDate } from "./formatters";

// ─── Mapeo de columnas para exportar ──────────────────────────────────────────
const COLUMN_LABELS = {
  // ── Identificación ─────────────────────
  sot: "SOT",
  tipo_trabajo: "Tipo de Trabajo",
  sub_tipo_orden: "Subtipo de Orden",

  // ── Generación de la Orden ─────────────
  fecha_fecgensot: "Fecha de Generación",
  hora_fecgensot: "Hora de Generación",

  // ── Programación ───────────────────────
  fecha_programada: "Fecha de Programación",
  franja: "Franja Horaria",
  tipo_programacion: "Estado de Programación",
  contrata_asignada: "Contratación Asignada",

  // ── Estado ─────────────────────────────
  estado_sot: "Estado de la Orden",
  estado_agenda: "Estado de Agenda",
  dilacion_dias: "Días Transcurridos",
  confirmacion: "Confirmación de Contacto",
  fecha_ejecucion: "Fecha de Ejecución",
  fecha_rechazo: "Fecha de Rechazo",

  // ── Ubicación ──────────────────────────
  region: "Región",
  distrito: "Distrito",

  // ── Punto de Venta ─────────────────────
  lugar_venta: "Lugar de Venta",
  ovenc_codigo: "Código OV/ENC",

  // ── Anotaciones ────────────────────────
  anotaciones: "Anotaciones",
};

// ─── Campos de fecha para formatear ───────────────────────────────────────────
const DATE_FIELDS = ["fecha_fecgensot", "fecha_programada", "fecha_carga"];

// ─── Exportar reportes SOT a Excel ────────────────────────────────────────────
export const exportReportesToExcel = (rows, filename = "SOT_Reportes") => {
  // Transformar filas al formato de exportación
  const exportData = rows.map((row) => {
    const mapped = {};
    Object.entries(COLUMN_LABELS).forEach(([key, label]) => {
      let value = row[key] ?? "";
      if (DATE_FIELDS.includes(key) && value) {
        value = formatDate(value);
      }
      mapped[label] = value;
    });
    return mapped;
  });

  // Crear hoja de cálculo
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  // Ancho de columnas automático
  const colWidths = Object.values(COLUMN_LABELS).map((label) => ({
    wch: Math.max(label.length + 2, 15),
  }));
  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "SOT Reportes");

  // Generar y descargar el archivo
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `${filename}_${timestamp}.xlsx`);
};
