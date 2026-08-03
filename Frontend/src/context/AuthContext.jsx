import { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

const TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const USER_KEY = "admin_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearStorage();
      }
    }
    setLoading(false);
  }, []);

  const clearStorage = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (email, password) => {
    const data = await apiClient
      .post("/auth/login", { email, password })
      .then((res) => res.data);

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);

    return data;
  };

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        await apiClient.post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
      // ignore — server might be down
    } finally {
      clearStorage();
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefresh) throw new Error("No refresh token");

    const data = await apiClient
      .post("/auth/refresh-token", { refreshToken: storedRefresh })
      .then((res) => res.data);

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);

    return data.token;
  }, []);

  const getAccessToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const isAdmin = useCallback(() => {
    return user?.userType === "Admin";
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    refreshToken,
    getAccessToken,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { TOKEN_KEY, REFRESH_TOKEN_KEY };
