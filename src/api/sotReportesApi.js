import axiosClient from "./axiosClient";

const sotReportesApi = {
  getInternal: (params) => axiosClient.get("/reportes/internal", { params }),

  getExternal: (params) => axiosClient.get("/reportes/external", { params }),

  getById: (id) => axiosClient.get(`/reportes/${id}`),
};

export default sotReportesApi;
