import axiosClient from "./axiosClient";

const userRazonSocialApi = {
  list: (params) => axiosClient.get("/user-razon-social", { params }),
  assign: (body) => axiosClient.post("/user-razon-social", body),
  update: (id, body) => axiosClient.patch(`/user-razon-social/${id}`, body),
  revoke: (id) => axiosClient.delete(`/user-razon-social/${id}`),
};

export default userRazonSocialApi;
