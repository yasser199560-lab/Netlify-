import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("talabaty_user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever returns 401 (expired/invalid token), log the user out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("talabaty_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
