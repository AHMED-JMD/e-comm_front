import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://e-comm-backend-tan.vercel.app/api";
// export const API_BASE_URL = "http://localhost:5050/api"; // Uncomment for local development

// Origin (no /api suffix) used to resolve static assets like uploaded images
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function getImageUrl(imagePath) {
  if (!imagePath) {
    return null;
  }
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }
  return `${API_ORIGIN}${imagePath}`;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthFormRequest = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
    ].some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !isAuthFormRequest) {
      // Token expired, redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
