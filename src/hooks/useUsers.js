import { useCallback, useEffect, useState } from "react";
import usersApi from "../api/usersApi";

const defaultFilters = {
  search: "",
  role_id: "",
  is_active: "",
};

const useUsers = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const fetchUsers = useCallback(
    async (currentPage, currentPageSize, currentFilters) => {
      setLoading(true);
      setError("");
      try {
        const params = { page: currentPage, page_size: currentPageSize };
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            params[key] = value;
          }
        });
        const { data } = await usersApi.list(params);
        setRows(data.data);
        setMeta(data.meta);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Error al cargar los usuarios.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchUsers(page, pageSize, appliedFilters);
  }, [page, pageSize, appliedFilters, fetchUsers]);

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

  const refetch = () => fetchUsers(page, pageSize, appliedFilters);

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
    refetch,
  };
};

export default useUsers;
