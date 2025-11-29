import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      if (originalRequest && originalRequest.url.includes("/auth/login")) {
         return Promise.reject(error);
      }
      const { logOut } = useAuthStore.getState();
      logOut();
      window.location.replace("/login"); 
    }
    return Promise.reject(error);
  }
);

export default api;