import axiosClient from "./axiosClient";

const hierarchyApi = {
  list: (params) => axiosClient.get("/hierarchy", { params }),
  create: (body) => axiosClient.post("/hierarchy", body),
  update: (id, body) => axiosClient.patch(`/hierarchy/${id}`, body),
  remove: (id) => axiosClient.delete(`/hierarchy/${id}`),
};

export default hierarchyApi;
