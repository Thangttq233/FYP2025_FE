import api from "../../lib/axios";
import type { ProductDto } from "../../types/product";

export const customerApi = {
  getProducts: async (): Promise<ProductDto[]> => {
    const response = await api.get<ProductDto[]>("/api/products");
    return response.data;
  },

  detailProduct: async (id: string): Promise<ProductDto> => {
    const res = await api.get<ProductDto>(`/api/products/${id}`);
    return res.data;
  },
};
