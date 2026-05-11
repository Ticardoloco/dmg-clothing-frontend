import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:4001/api/v1',
});
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

export default api;