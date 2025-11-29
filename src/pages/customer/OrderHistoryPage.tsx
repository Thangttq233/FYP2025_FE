import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerApi } from './api';
import type { OrderDto } from '@/types/order';
import { OrderStatus } from '@/types/order'; 
import { Package, ChevronRight, Calendar, ShoppingBag } from 'lucide-react';

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case OrderStatus.Delivered:
      return 'bg-green-50 text-green-700 border border-green-200';
    case OrderStatus.Cancelled:
      return 'bg-red-50 text-red-700 border border-red-200';
    default:
      return 'bg-blue-50 text-blue-700 border border-blue-200';
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
    return (
        <div className="min-h-[50vh] flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Lịch sử đơn hàng</h1>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <Link 
                to={`/profile/orders/${order.id}`} 
                key={order.id} 
                className="block bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-gray-100 p-1.5 rounded-md text-gray-600">
                            <Package size={16} />
                        </span>
                        <p className="font-bold text-gray-800 text-sm md:text-base">
                            #{order.id.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-gray-500 ml-1">
                        <Calendar size={14} className="mr-1.5"/>
                        {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusBadge(order.status)}`}>
                    {OrderStatus[order.status]}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {order.items.length} sản phẩm
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Tổng tiền</p>
                        <p className="font-bold text-blue-600 text-base md:text-lg">
                            {order.totalPrice.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
                <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6 text-center max-w-xs">Hãy khám phá các sản phẩm thời trang mới nhất tại cửa hàng của chúng tôi.</p>
            <Link 
                to="/products" 
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
                Mua sắm ngay
            </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;