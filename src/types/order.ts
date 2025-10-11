// Dựa trên các Enum và DTOs từ backend C#

export enum OrderStatus {
  Pending,       // Chờ xác nhận
  Confirmed,     // Đã xác nhận
  Processing,    // Đang xử lý
  Shipped,       // Đang giao hàng
  Delivered,     // Đã giao thành công
  Cancelled,     // Đã hủy
  Returned       // Đã hoàn trả
}

export enum PaymentStatus {
  Unpaid,        // Chưa thanh toán
  Paid,          // Đã thanh toán
  Failed,        // Thanh toán thất bại
  Refunded       // Đã hoàn tiền
}

export interface OrderItemDto {
  id: string;
  orderId: string;
  productVariantId: string;
  quantity: number;
  price: number;
  productName: string;
  productVariantColor: string;
  productVariantSize: string;
  productVariantImageUrl: string;
}

export interface OrderDto {
  id: string;
  userId: string;
  orderDate: string; // Dạng chuỗi ISO 8601
  totalAmount: number; // <--- Thuộc tính bị thiếu đã được thêm vào đây
  shippingAddress: string;
  phoneNumber: string;
  fullName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItemDto[];
}

// DTO để gửi request tạo order mới
export interface CreateOrderRequestDto {
  shippingAddress: string;
  phoneNumber: string;
  customerNotes: string;
}

