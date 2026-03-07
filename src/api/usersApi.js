import axiosClient from "./axiosClient";

const usersApi = {
  // ─── Usuarios ──────────────────────────────────────────────────────────────
  list: (params) => axiosClient.get("/users", { params }),
  getById: (id) => axiosClient.get(`/users/${id}`),
  create: (body) => axiosClient.post("/users", body),
  update: (id, body) => axiosClient.patch(`/users/${id}`, body),
  remove: (id) => axiosClient.delete(`/users/${id}`),
  unblock: (id) => axiosClient.post(`/users/${id}/unblock`),
  resetPassword: (id) => axiosClient.post(`/users/${id}/reset-password`),

  // ─── Emails ────────────────────────────────────────────────────────────────
  addEmail: (userId, body) => axiosClient.post(`/users/${userId}/emails`, body),
  updateEmail: (userId, emailId, body) =>
    axiosClient.patch(`/users/${userId}/emails/${emailId}`, body),
  deleteEmail: (userId, emailId) =>
    axiosClient.delete(`/users/${userId}/emails/${emailId}`),

  // ─── Teléfonos ─────────────────────────────────────────────────────────────
  addPhone: (userId, body) => axiosClient.post(`/users/${userId}/phones`, body),
  updatePhone: (userId, phoneId, body) =>
    axiosClient.patch(`/users/${userId}/phones/${phoneId}`, body),
  deletePhone: (userId, phoneId) =>
    axiosClient.delete(`/users/${userId}/phones/${phoneId}`),
};

export default usersApi;
