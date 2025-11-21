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

  createPaymentUrl: async (order:OrderDto) =>{
    const response = await api.post<{ paymentUrl: string }>(`/api/orders/pay`, order);
    return response.data;
  },

  handleReturnVNPAY: async (responseCode:string, orderId: string)=>{
    const res = await api.post<{ paymentUrl: string }>(`/api/orders/returnURL`,{responseCode, orderId} );
    return res.data;
  },

  getUserOrders: async (): Promise<OrderDto[]> => {
    const response = await api.get<OrderDto[]>("/api/orders/my-orders");
    return response.data;
  },

  getCartCount: async () => {
    const res = await api.get("/api/carts/count"); 
    return res.data; 
  },

  getFilteredProducts: async (filters: {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
  }): Promise<ProductDto[]> => {
    const query = new URLSearchParams();
    if (filters.name) query.append("name", filters.name);
    if (filters.minPrice != null) query.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice != null) query.append("maxPrice", filters.maxPrice.toString());
    if (filters.categoryId) query.append("categoryId", filters.categoryId);

    const response = await api.get<ProductDto[]>(`/api/products/search?${query.toString()}`);
    return response.data;
  },
};