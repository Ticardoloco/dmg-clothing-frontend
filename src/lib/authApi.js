import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
});
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

export default api;