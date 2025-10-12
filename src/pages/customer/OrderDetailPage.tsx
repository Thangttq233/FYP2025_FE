import { useState, useEffect } from 'react';
import { useParams, Link, NavigationType, UNSAFE_useFogOFWarDiscovery } from 'react-router-dom';
import { customerApi } from './api';
import type { OrderDto } from '@/types/order';
import { OrderStatus, PaymentStatus } from '@/types/order';

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
 

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const data = await customerApi.getOrderDetails(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Lỗi tải chi tiết đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

    console.log(order?.status);

  const handlePayNow = async () => {
    if (!orderId || isPaying) return;
    setIsPaying(true);
    try {
      const { paymentUrl } = await customerApi.getVnpayPaymentUrl(orderId);
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (error) {
      alert("Không thể tạo yêu cầu thanh toán. Vui lòng thử lại.");
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải chi tiết đơn hàng...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center">Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{order.id.substring(0, 8)}</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
            <p>{order.fullName}</p>
            <p>{order.phoneNumber}</p>
            <p>{order.shippingAddress}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
            <p>Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
            <p>Trạng thái: {OrderStatus[order.status]}</p>
            <p>Thanh toán: {PaymentStatus[order.paymentStatus]}</p>
            <p className="font-bold">Tổng tiền: {order.totalPrice.toLocaleString('vi-VN')} ₫</p>
          </div>
        </div>

        <h3 className="font-semibold mb-4 border-t pt-4">Các sản phẩm</h3>
        <div className="space-y-4">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center">
              <img src={item.productVariantSnapshotImageUrl} alt={item.productSnapshotName} className="w-16 h-16 object-cover rounded-md mr-4"/>
              <div className="flex-grow">
                <p className="font-semibold">{item.productSnapshotName}</p>
                <p className="text-sm text-gray-500">{item.productVariantSnapshotColor}, {item.productVariantSnapshotSize}</p>
                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
              </div>
              <p className="font-semibold">{(item.unitPrice * item.quantity).toLocaleString('vi-VN')} ₫</p>
            </div>
          ))}
        </div>
        
        
        {order.paymentStatus ==  PaymentStatus.Unpaid && (
          <div className="mt-6 border-t pt-6 text-right">
            <button
              onClick={handlePayNow}
              disabled={isPaying}
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isPaying ? 'Đang xử lý...' : 'Thanh toán ngay'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


 
export default OrderDetailPage;
