import api from "../../lib/axios";
import type { ProductDto } from "../../types/product";
// Import CategoryDto từ file types của bạn
import type { CategoryDto } from "../../types/categories";

export const customerApi = {
  getProducts: async (): Promise<ProductDto[]> => {
    const response = await api.get<ProductDto[]>("/api/products");
    return response.data;
  },

  detailProduct: async (id: string): Promise<ProductDto> => {
    const res = await api.get<ProductDto>(`/api/products/${id}`);
    return res.data;
  },

  getCategories: async (): Promise<CategoryDto[]> => {
    const response = await api.get<CategoryDto[]>("/api/categories");
    return response.data;
  },


  getCategoryDetails: async (id: string): Promise<CategoryDto> => {
    const response = await api.get<CategoryDto>(`/api/categories/${id}`);
    return response.data;
  },


  getProductsByCategoryId: async (categoryId: string): Promise<ProductDto[]> => {
    const response = await api.get<ProductDto[]>(`/api/products/byCategory/${categoryId}`);
    return response.data;
  },
};