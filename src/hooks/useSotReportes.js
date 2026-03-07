import { useCallback, useEffect, useState } from "react";
import sotReportesApi from "../api/sotReportesApi";
import { DEFAULT_PAGE_SIZE, USER_TYPES } from "../utils/constants";
import useAuth from "./useAuth";

const defaultFilters = {
  sot: "",
  estado_sot: "",
  estado_agenda: "",
  proceso: "",
  tipo_trabajo: "",
  region: "",
  distrito: "",
  fecha_desde: null,
  fecha_hasta: null,
};

const useSotReportes = () => {
  const { userType } = useAuth();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const fetchReportes = useCallback(
    async (currentPage, currentPageSize, currentFilters) => {
      setLoading(true);
      setError("");
      try {
        // Construir params limpiando valores vacíos
        const params = { page: currentPage, page_size: currentPageSize };
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            params[key] = value;
          }
        });

        const apiFn =
          userType === USER_TYPES.RAZON_SOCIAL
            ? sotReportesApi.getExternal
            : sotReportesApi.getInternal;

        const { data } = await apiFn(params);
        setRows(data.data);
        setMeta(data.meta);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Error al cargar los reportes.",
        );
      } finally {
        setLoading(false);
      }
    },
    [userType],
  );

  // Cargar al montar y cuando cambian página, pageSize o filtros aplicados
  useEffect(() => {
    fetchReportes(page, pageSize, appliedFilters);
  }, [page, pageSize, appliedFilters, fetchReportes]);

  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
    setAppliedFilters(defaultFilters);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Búsqueda en tiempo real con debounce (solo para el campo sot) ────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setAppliedFilters((prev) => ({ ...prev, sot: filters.sot }));
    }, 400); // 400ms de espera tras dejar de escribir

    return () => clearTimeout(timer);
  }, [filters.sot]);

  return {
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
    refetch: () => fetchReportes(page, pageSize, appliedFilters),
  };
};

export default useSotReportes;
