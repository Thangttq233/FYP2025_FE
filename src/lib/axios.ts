import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor add token on each request
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

// Response interceptor error 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const { logOut } = useAuthStore.getState();
            logOut();
            window.location.replace("/");
        }
        return Promise.reject(error);
    }
);

export default api;
