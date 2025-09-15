import api from "@/lib/axios";


export const adminhApi = {
    getAllProdct: async () => {
        const res = await api.get('/api/products');
        return res.data;
    },

    createProduct: async (payload: FormData) => {
        const res = await api.post("/api/products", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    updateProduct: async (id: string, payload: any) => {
        const res = await api.put(`/api/products/${id}`, payload);
        return res.data;
    },

    deleteProduct: async (id: string) => {
        const res = await api.delete(`/api/products/${id}`);
        return res.data;
    },

    createCategory: async (payload: any) => {
        try {
            const res = await api.post('/api/categories', payload);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    },

    getCategories: async () => {
        const res = await api.get('/api/categories');
        return res.data;
    },

    deleteCategory: async (id: string) => {
        const res = await api.delete(`/api/categories/${id}`);
        return res.data;
    },

    updateCategory: async (id: string, payload: any) => {
        const res = await api.put(`/api/categories/${id}`, payload);
        return res.data;
    },

    getOrder: async () => {
        const res = await api.get('/api/orders');
        return res.data;
    }

}