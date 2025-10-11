import api from "../../lib/axios";
import type { ProductDto } from "../../types/product";
import type { CategoryDto } from "../../types/categories";
import type { CartDto, AddToCartRequestDto, UpdateCartItemRequestDto } from "../../types/cart";
import type { CreateOrderRequestDto, OrderDto } from "@/types/order";

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

    getUserCart: async (): Promise<CartDto> => {
    const response = await api.get<CartDto>("/api/carts/my-cart");
    return response.data;
  },

 
    addItemToCart: async (item: AddToCartRequestDto): Promise<CartDto> => {
    const response = await api.post<CartDto>("/api/carts/add-item", item);
    return response.data;
  },

  
  updateCartItem: async (item: UpdateCartItemRequestDto): Promise<CartDto> => {
    const response = await api.put<CartDto>("/api/carts/update-item", item);
    return response.data;
  },

 
  removeCartItem: async (cartItemId: string): Promise<CartDto> => {
    const response = await api.delete<CartDto>(`/api/carts/remove-item/${cartItemId}`);
    return response.data;
  },

  createOrder: async (request: CreateOrderRequestDto): Promise<OrderDto> => {
    const response = await api.post<OrderDto>("/api/orders/create", request);
    return response.data;
  },
  
  getOrderDetails: async (orderId: string): Promise<OrderDto> => {
    const response = await api.get<OrderDto>(`/api/orders/${orderId}`);
    return response.data;
  },

  getVnpayPaymentUrl: async (orderId: string): Promise<{ paymentUrl: string }> => {
    const response = await api.post<{ paymentUrl: string }>(`/api/orders/${orderId}/pay`);
    return response.data;
  },
};