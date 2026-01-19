import axios from "axios";
import { getApiBaseURL } from "./api-config";

// Membuat axios instance dengan konfigurasi default
// Di production, gunakan https://api.muhammadiksankiat.id/
// Di development, gunakan http://localhost:7000 atau dari env variable
const baseURL = getApiBaseURL();

// Log baseURL untuk debugging (hanya di development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🌐 API Base URL:", baseURL);
}

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (untuk menambahkan token, dll)
apiClient.interceptors.request.use(
  (config) => {
    // Log request di development mode
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
    }

    // Jika data adalah FormData, hapus Content-Type header
    // Browser akan otomatis set boundary untuk multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Menambahkan auth token dari localStorage (di-set oleh Redux)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (untuk handle error global)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error global di sini
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      // Handle 401 Unauthorized - token tidak valid atau expired
      if (status === 401) {
        // Clear token dan user dari localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Redirect ke halaman login jika tidak sedang di halaman login
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      console.error("API Error:", status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
