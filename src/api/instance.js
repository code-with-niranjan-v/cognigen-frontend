// cognigen-frontend/src/api/instance.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for cookies
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
