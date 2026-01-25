// cognigen-frontend/src/api/authApi.js
import api from "./instance";

export const signup = (userData) => api.post("/auth/signup", userData);
export const login = (credentials) => api.post("/auth/login", credentials);
export const logout = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");
