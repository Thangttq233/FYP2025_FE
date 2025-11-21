import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerApi } from './api';
import type { OrderDto } from '@/types/order';
import { OrderStatus, PaymentStatus } from '@/types/order'; 
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.Delivered:
      return 'bg-green-100 text-green-800';
    case OrderStatus.Cancelled:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await customerApi.getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Không thể tải lịch sử đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải lịch sử đơn hàng...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <Link to={`/profile/orders/${order.id}`} key={order.id} className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">Đơn hàng #{order.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                  {OrderStatus[order.status]}
                </span>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-gray-700">Tổng tiền: <span className="font-bold text-blue-600">{order.totalPrice.toLocaleString('vi-VN')} ₫</span></p>
                <p className="text-sm text-gray-500">{order.items.length} sản phẩm</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default OrderHistoryPage;
