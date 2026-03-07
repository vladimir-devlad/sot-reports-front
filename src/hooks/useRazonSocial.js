import { useCallback, useEffect, useState } from "react";
import razonSocialApi from "../api/razonSocialApi";

const defaultFilters = { search: "" };

const useRazonSocial = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const fetchData = useCallback(
    async (currentPage, currentPageSize, currentFilters) => {
      setLoading(true);
      setError("");
      try {
        const params = { page: currentPage, page_size: currentPageSize };
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== "" && value !== null) params[key] = value;
        });
        const { data } = await razonSocialApi.list(params);
        setRows(data.data);
        setMeta(data.meta);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Error al cargar las razones sociales.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData(page, pageSize, appliedFilters);
  }, [page, pageSize, appliedFilters, fetchData]);

  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };
  const clearFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
    setAppliedFilters(defaultFilters);
  };
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const refetch = () => fetchData(page, pageSize, appliedFilters);

  return {
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
  };
};

export default useRazonSocial;
