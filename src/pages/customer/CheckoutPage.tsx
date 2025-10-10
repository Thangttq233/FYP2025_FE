import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from './api';
import type { CreateOrderRequestDto } from '@/types/order';
import type { CartDto } from '@/types/cart'; // Thêm import CartDto

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // State cho form
  const [formData, setFormData] = useState<CreateOrderRequestDto>({
    customerNotes: '',
    phoneNumber: '',
    shippingAddress: '',
  });
  
  // State cho giỏ hàng
  const [cart, setCart] = useState<CartDto | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);

  // State chung
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy thông tin giỏ hàng khi trang được tải
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await customerApi.getUserCart();
        setCart(cartData);
        // Nếu giỏ hàng rỗng, chuyển về trang giỏ hàng
        if (!cartData || cartData.items.length === 0) {
          navigate('/cart');
        }
      } catch (err) {
        console.error("Không thể tải giỏ hàng:", err);
        setError("Không thể tải thông tin giỏ hàng của bạn.");
      } finally {
        setIsCartLoading(false);
      }
    };
    fetchCartData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.phoneNumber.trim() || !formData.shippingAddress.trim()) {
      setError("Vui lòng điền đầy đủ số điện thoại và địa chỉ.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const createdOrder = await customerApi.createOrder(formData);
      navigate(`/order-success/${createdOrder.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };
  
  if (isCartLoading) {
    return <div className="container mx-auto p-8 text-center">Đang tải thông tin...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Thanh toán</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Cột trái: Form thông tin */}
          <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-semibold mb-6">Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold mb-2">Số điện thoại</label>
                <input
                  type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="09xxxxxxxx" required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="shippingAddress" className="block text-gray-700 font-semibold mb-2">Địa chỉ giao hàng</label>
                <textarea
                  id="shippingAddress" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="customerNotes" className="block text-gray-700 font-semibold mb-2">Ghi chú (tùy chọn)</label>
                <textarea
                  id="customerNotes" name="customerNotes" value={formData.customerNotes} onChange={handleInputChange} rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Giao hàng trong giờ hành chính..."
                />
              </div>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              <button
                type="submit" disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
              </button>
            </form>
          </div>
          
          {/* Cột phải: Tóm tắt giỏ hàng */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
              <h2 className="text-xl font-semibold border-b pb-4 mb-4">Đơn hàng của bạn ({cart?.items.length} sản phẩm)</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cart?.items.map(item => (
                  <div key={item.id} className="flex items-center">
                    <img src={item.productVariantImageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-md mr-4"/>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-500">{item.productVariantColor}, {item.productVariantSize}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{(item.productVariantPrice * item.quantity).toLocaleString('vi-VN')} ₫</p>
                        <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{cart?.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

