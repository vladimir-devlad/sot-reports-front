import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import axiosClient from "./axiosClient";

// Instancia completamente independiente, sin ninguna conexión con axiosClient
const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const authApi = {
  loginInterno: (credentials) => http.post("/auth/users/login", credentials),
  logoutInterno: () => axiosClient.post("/auth/users/logout"),
  changePasswordInterno: (body) =>
    axiosClient.post("/auth/users/change-password", body),

  loginRazonSocial: (credentials) =>
    http.post("/auth/razon-social/login", credentials),
  logoutRazonSocial: () => axiosClient.post("/auth/razon-social/logout"),
  changePasswordRazonSocial: (body) =>
    axiosClient.post("/auth/razon-social/change-password", body),
};
