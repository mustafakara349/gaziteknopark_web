import axios from "axios";
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from "../context/AuthContext";

/**
 * Axios instance dedicated to admin panel API calls.
 * Separate from the public apiClient to avoid interfering with public-facing pages.
 *
 * Features:
 * - Auto-attaches Bearer token to every request
 * - On 401: silently attempts token refresh, then retries the original request
 * - On refresh failure: clears session and redirects to /admin/login
 */
const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080/api",
});

// Track refresh state to avoid multiple concurrent refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor — attach access token
adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 with silent refresh
adminAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 and only once per request
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't retry refresh-token or login requests themselves
    if (
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request to be retried after the refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return adminAxios(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post(
        `${adminAxios.defaults.baseURL}/auth/refresh-token`,
        { refreshToken }
      );

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      processQueue(null, data.token);

      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return adminAxios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Clear session and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default adminAxios;
