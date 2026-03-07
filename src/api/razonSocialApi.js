import axiosClient from "./axiosClient";

const razonSocialApi = {
  list: (params) => axiosClient.get("/razon-social", { params }),
  getById: (id) => axiosClient.get(`/razon-social/${id}`),
  update: (id, body) => axiosClient.patch(`/razon-social/${id}`, body),
  unblock: (id) => axiosClient.post(`/razon-social/${id}/unblock`),
  resetPassword: (id) => axiosClient.post(`/razon-social/${id}/reset-password`),
};

export default razonSocialApi;
