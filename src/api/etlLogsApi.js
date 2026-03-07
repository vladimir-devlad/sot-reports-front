import axiosClient from "./axiosClient";

const etlLogsApi = {
  getUltimaCarga: () => axiosClient.get("/etl-logs/ultima-carga"),
};

export default etlLogsApi;
