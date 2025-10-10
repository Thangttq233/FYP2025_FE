import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerApi } from './api';
import type { OrderDto } from '@/types/order';
import { CheckCircle } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Không tìm thấy mã đơn hàng.");
      setIsLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await customerApi.getOrderDetails(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Không thể tải chi tiết đơn hàng:", err);
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handlePayNow = async () => {
    if (!orderId || isPaying) return;
    setIsPaying(true);
    try {
      const paymentData = await customerApi.getVnpayPaymentUrl(orderId);
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo link thanh toán:", error);
      alert("Đã có lỗi xảy ra khi tạo yêu cầu thanh toán. Vui lòng thử lại sau.");
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-8 text-center">Đang tải thông tin đơn hàng...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-500">{error}</div>;
  }
  
  // Không cần check !order ở đây nữa vì đã có error state xử lý
  // if (!order) {
  //   return <div className="container mx-auto p-8 text-center">Không tìm thấy đơn hàng.</div>;
  // }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang chờ thanh toán.</p>
          
          {order && (
            <div className="text-left bg-gray-50 p-6 rounded-md mb-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Chi tiết đơn hàng</h2>
                <p className="mb-2"><strong>Mã đơn hàng:</strong> {order.id}</p>
                {/* 👇 SỬA LỖI TẠI ĐÂY BẰNG OPTIONAL CHAINING (?.) */}
                <p className="mb-2"><strong>Tổng tiền:</strong> <span className="font-bold text-blue-600">{order.totalAmount?.toLocaleString('vi-VN')} ₫</span></p>
                <p className="mb-2"><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
                <p><strong>Trạng thái thanh toán:</strong> <span className="font-semibold text-orange-500">Chưa thanh toán</span></p>
            </div>
          )}

          <button
            onClick={handlePayNow}
            disabled={isPaying || !order}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isPaying ? 'Đang chuyển hướng...' : 'Thanh toán ngay'}
          </button>
          <Link to="/profile" className="block mt-4 text-gray-600 hover:text-blue-600">
            Xem lịch sử đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

