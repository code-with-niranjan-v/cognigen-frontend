import {  useState, useEffect } from "react";
import api from "../api/instance";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    setUser(res.data?.user || null);
    return res;
  };

  const signup = async (userData) => {
    const res = await api.post("/auth/signup", userData);
    setUser(res.data?.user || null);
    return res;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
