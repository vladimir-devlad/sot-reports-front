import { useEffect, useState } from "react";
import etlLogsApi from "../api/etlLogsApi";
import useAuth from "./useAuth";

const useEtlLogs = () => {
  const { isAuthenticated } = useAuth();
  const [ultimaCarga, setUltimaCarga] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUltimaCarga = async () => {
      setLoading(true);
      try {
        const { data } = await etlLogsApi.getUltimaCarga();
        console.log("ETL respuesta completa:", JSON.stringify(data));
        setUltimaCarga(data.data);
      } catch (err) {
        console.log("ETL error:", err?.response?.status, err?.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchUltimaCarga();
  }, [isAuthenticated]);

  return { ultimaCarga, loading };
};

export default useEtlLogs;
