import { useCallback, useEffect, useState } from "react";
import hierarchyApi from "../api/hierarchyApi";

const useHierarchy = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchData = useCallback(async (currentPage, currentPageSize) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await hierarchyApi.list({
        page: currentPage,
        page_size: currentPageSize,
      });
      setRows(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al cargar la jerarquía.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize, fetchData]);

  const refetch = () => fetchData(page, pageSize);

  return {
    rows,
    meta,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    refetch,
  };
};

export default useHierarchy;
