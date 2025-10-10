import api from "../../lib/axios";
import type { ProductDto } from "../../types/product";
import type { CategoryDto } from "../../types/categories";

export const customerApi = {
  getProducts: async (): Promise<ProductDto[]> => {
    const response = await api.get<ProductDto[]>("/api/products");
    return response.data;
  },

  // Hàm này đã có sẵn và sẽ được sử dụng
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
