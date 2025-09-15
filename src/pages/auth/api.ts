import api from "@/lib/axios";

export const authApi = {
    login: async (data: { email: string; password: string }) => {
        const res = await api.post('/api/auth/login', data);
        return res.data;
    },
    register: async (payload: any) => {
        const res = await api.post('/api/auth/register', payload);
        return res.data;
    }
}