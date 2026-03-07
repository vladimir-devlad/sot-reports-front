import axiosClient from "./axiosClient";

const rolesApi = {
  list: (params) => axiosClient.get("/roles", { params }),
  getById: (id) => axiosClient.get(`/roles/${id}`),
  update: (id, body) => axiosClient.patch(`/roles/${id}`, body),
};

export default rolesApi;
