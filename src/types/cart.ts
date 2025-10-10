
export interface CartItemDto {
  id: string;
  cartId: string;
  productVariantId: string;
  quantity: number;
  productName: string;
  productVariantColor: string;
  productVariantSize: string;
  productVariantPrice: number;
  productVariantImageUrl: string;
}


export interface CartDto {
  id: string;
  userId: string;
  items: CartItemDto[];
  totalCartPrice: number;
}


export interface AddToCartRequestDto {
  productVariantId: string;
  quantity: number;
}


export interface UpdateCartItemRequestDto {
  cartItemId: string;
  quantity: number;
}
