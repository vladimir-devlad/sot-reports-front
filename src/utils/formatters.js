import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

// ─── Fechas ────────────────────────────────────────────────────────────────────
export const formatDate = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY") : "—";

export const formatDateTime = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "—";

export const formatDateRelative = (date) =>
  date ? dayjs(date).fromNow() : "—";

// ─── Texto ─────────────────────────────────────────────────────────────────────
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export const truncate = (str, max = 50) =>
  str && str.length > max ? `${str.substring(0, max)}...` : str || "";

// ─── Paginación ────────────────────────────────────────────────────────────────
export const formatPaginationInfo = (meta) => {
  if (!meta) return "";
  const from = (meta.page - 1) * meta.page_size + 1;
  const to = Math.min(meta.page * meta.page_size, meta.total);
  return `Mostrando ${from}–${to} de ${meta.total} registros`;
};
