// OrderStatus Enum
export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

// OrderItemDto
export interface OrderItemDto {
  id: string;
  orderId: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
  productSnapshotName: string;
  productVariantSnapshotColor: string;
  productVariantSnapshotSize: string;
  productVariantSnapshotImageUrl: string;
}

// OrderDto
export interface OrderDto {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string; // DateTime -> string ISO
  status: OrderStatus;
  totalPrice: number;
  shippingAddress: string;
  phoneNumber: string;
  items: OrderItemDto[];
}

// CreateOrderRequestDto
export interface CreateOrderRequestDto {
  shippingAddress: string;
  phoneNumber: string;
  customerNotes: string;
}

// UpdateOrderStatusRequestDto
export interface UpdateOrderStatusRequestDto {
  orderId: string;
  newStatus: OrderStatus;
}
