import api from "../../lib/axios";
import type { ProductDto } from "../../types/product";

export const getProducts = async (): Promise<ProductDto[]> => {
  const response = await api.get<ProductDto[]>("/products");
  return response.data;
};
