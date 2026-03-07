import axios from "axios";
import { USER_TYPES } from "../utils/constants";
import { tokenStorage } from "../utils/tokenStorage";
import axiosPublic from "./axiosPublic";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

const redirectToLogin = () => {
  tokenStorage.clearAll();
  window.location.href = "/login";
};

// ─── REQUEST ──────────────────────────────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── RESPONSE ─────────────────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenStorage.getRefresh();
    const userType = tokenStorage.getUserType();

    if (!refreshToken) {
      isRefreshing = false;
      redirectToLogin();
      return Promise.reject(error);
    }

    try {
      const endpoint =
        userType === USER_TYPES.RAZON_SOCIAL
          ? "/auth/razon-social/refresh"
          : "/auth/users/refresh";

      console.log("🔄 Intentando refresh...", { endpoint, userType });

      const { data } = await axiosPublic.post(endpoint, {
        refresh_token: refreshToken,
      });

      console.log("✅ Refresh response:", data);
      const newToken = data.data.access_token;
      tokenStorage.setAccess(newToken);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      console.log(
        "❌ Refresh falló:",
        refreshError?.response?.status,
        refreshError?.response?.data,
      );

      processQueue(refreshError, null);
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;
