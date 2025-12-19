import axios from "axios";
import { API_URL, STORAGE_KEYS } from "../config";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Có lỗi xảy ra";

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401) {
      const isPasswordChangeError = error.config?.url?.includes("/password");

      if (!isPasswordChangeError && window.location.pathname !== "/login") {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = "/login";
      }
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      error: error.response?.data?.error,
      data: error.response?.data,
    });
  }
);

export default api;
