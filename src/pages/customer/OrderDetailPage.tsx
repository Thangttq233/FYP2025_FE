import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerApi } from './api';
import type { OrderDto } from '@/types/order';
import { OrderStatus, PaymentStatus } from '@/types/order';
import { MapPin, Calendar, CreditCard, Package, ArrowLeft, Truck } from 'lucide-react';

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const data: OrderDto = await customerApi.getOrderDetails(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Lỗi tải chi tiết đơn hàng:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePayNow = async () => {
    if (!order || isPaying) return;

    setIsPaying(true);
    try {
      const { paymentUrl } = await customerApi.createPaymentUrl(order);
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (error) {
      alert('Không thể tạo yêu cầu thanh toán. Vui lòng thử lại.');
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (!order) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
            <Package size={48} className="mb-4 opacity-50"/>
            <p>Không tìm thấy đơn hàng.</p>
            <Link to="/profile/orders" className="mt-4 text-blue-600 hover:underline">Quay lại danh sách</Link>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/profile/orders" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Chi tiết đơn hàng #{order.id.substring(0, 8).toUpperCase()}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày đặt hàng</p>
                    <div className="flex items-center font-medium text-gray-900">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                        })}
                    </div>
                </div>
                <div className="flex flex-col md:items-end">
                    <p className="text-sm text-gray-500 mb-1">Tổng cộng</p>
                    <p className="text-xl font-bold text-blue-600">{order.totalPrice.toLocaleString('vi-VN')} ₫</p>
                </div>
            </div>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <MapPin size={16} className="mr-2 text-blue-600" /> Địa chỉ giao hàng
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="font-medium text-gray-900 mb-1">{order.customerName}</p>
                <p className="text-gray-600 text-sm mb-2">{order.phoneNumber}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{order.shippingAddress}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                <CreditCard size={16} className="mr-2 text-blue-600" /> Thông tin thanh toán
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-500 text-sm">Trạng thái đơn hàng</span>
                    <span className="font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {OrderStatus[order.status]}
                    </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-500 text-sm">Trạng thái thanh toán</span>
                    <span className={`font-medium px-2 py-1 rounded text-xs ${
                        order.paymentStatus === PaymentStatus.Paid 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                        {PaymentStatus[order.paymentStatus]}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-500 text-sm">Phương thức vận chuyển</span>
                    <span className="flex items-center text-sm font-medium text-gray-700">
                        <Truck size={14} className="mr-1" /> Tiêu chuẩn
                    </span>
                </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100">
            <div className="bg-gray-50/50 px-4 py-3 md:px-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center">
                    <Package size={18} className="mr-2 text-blue-600" /> Sản phẩm ({order.items.length})
                </h3>
            </div>
            <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden bg-white">
                            <img
                                src={item.productVariantSnapshotImageUrl}
                                alt={item.productSnapshotName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-grow flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                            <div>
                                <p className="font-medium text-gray-900 line-clamp-2">{item.productSnapshotName}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Phân loại: {item.productVariantSnapshotColor}, {item.productVariantSnapshotSize}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">x{item.quantity}</p>
                            </div>
                            <div className="text-right mt-1 md:mt-0">
                                <p className="font-semibold text-blue-600">
                                    {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} ₫
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {item.unitPrice.toLocaleString('vi-VN')} ₫ / cái
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {order.paymentStatus === PaymentStatus.Unpaid && (
          <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                <div className="text-sm text-gray-500 hidden md:block">
                    Đơn hàng chưa được thanh toán
                </div>
                <button
                onClick={handlePayNow}
                disabled={isPaying}
                className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md transition-colors flex items-center justify-center"
                >
                <CreditCard size={18} className="mr-2" />
                {isPaying ? 'Đang chuyển hướng...' : 'Thanh toán ngay'}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;