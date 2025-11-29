import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from './api';
import type { CreateOrderRequestDto } from '@/types/order';
import type { CartDto } from '@/types/cart';
import { MapPin, Phone, FileText, Package, CreditCard } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateOrderRequestDto>({
    customerNotes: '',
    phoneNumber: '',
    shippingAddress: '',
  });
  const [cart, setCart] = useState<CartDto | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await customerApi.getUserCart();
        setCart(cartData);
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
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Thanh toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                    <MapPin className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">Thông tin giao hàng</h2>
                </div>
                
                <form id="checkout-form" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại nhận hàng</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="tel" id="phoneNumber" name="phoneNumber"
                            value={formData.phoneNumber} onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Nhập số điện thoại..." required
                        />
                    </div>
                </div>
                
                <div className="mb-5">
                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ nhận hàng</label>
                    <div className="relative">
                         <div className="absolute top-3 left-3 pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            id="shippingAddress" name="shippingAddress"
                            value={formData.shippingAddress} onChange={handleInputChange} rows={3}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Số nhà, tên đường, phường/xã..." required
                        />
                    </div>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="customerNotes" className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            id="customerNotes" name="customerNotes"
                            value={formData.customerNotes} onChange={handleInputChange} rows={2}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Lời nhắn cho người bán..."
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}
                <button
                    type="submit" disabled={isSubmitting}
                    className="hidden lg:flex w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
                >
                    {isSubmitting ? 'Đang xử lý...' : (
                        <>
                            <CreditCard size={20} />
                            Hoàn tất đặt hàng
                        </>
                    )}
                </button>
                </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                  <Package className="text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-800">Đơn hàng ({cart?.items.length} sản phẩm)</h2>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {cart?.items.map(item => (
                  <div key={item.id} className="flex gap-3 py-2">
                    <div className="w-16 h-16 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden">
                        <img src={item.productVariantImageUrl} alt={item.productName} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-gray-800 text-sm line-clamp-2">{item.productName}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.productVariantColor}, {item.productVariantSize}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                        <p className="font-semibold text-blue-600 text-sm">{(item.productVariantPrice * item.quantity).toLocaleString('vi-VN')} ₫</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-dashed border-gray-200 mt-6 pt-4 space-y-2">
                 <div className="flex justify-between text-gray-500 text-sm">
                    <span>Tạm tính</span>
                    <span>{cart?.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
                 </div>
                 <div className="flex justify-between text-gray-500 text-sm">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                 </div>
                 <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-800">Tổng thanh toán</span>
                    <span className="font-bold text-xl text-blue-600">{cart?.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-40">
        <div className="flex gap-3 items-center">
             <div className="flex flex-col">
                 <span className="text-xs text-gray-500">Tổng thanh toán</span>
                 <span className="font-bold text-lg text-blue-600">{cart?.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
             </div>
             <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:bg-gray-400"
            >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;