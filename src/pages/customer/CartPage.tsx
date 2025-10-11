import { useState, useEffect } from 'react';
import { customerApi } from './api';
import type { CartDto, CartItemDto } from '@/types/cart';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      // Bắt đầu tải, không cần setIsLoading(true) nếu chỉ gọi 1 lần trong useEffect
      const cartData = await customerApi.getUserCart();
      setCart(cartData);
    } catch (error) {
      console.error("Không thể tải giỏ hàng:", error);
      // Có thể thêm state để hiển thị lỗi cho người dùng
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (item: CartItemDto, newQuantity: number) => {
    // Ngăn chặn việc spam click và cập nhật số lượng nhỏ hơn 1
    if (newQuantity < 1 || updatingItemId === item.id) return;
    
    setUpdatingItemId(item.id);
    try {
      const updatedCart = await customerApi.updateCartItem({
        cartItemId: item.id,
        quantity: newQuantity,
      });
      setCart(updatedCart);
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      alert("Không thể cập nhật số lượng, vui lòng thử lại.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

    setUpdatingItemId(cartItemId);
    try {
      const updatedCart = await customerApi.removeCartItem(cartItemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm, vui lòng thử lại.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-8 text-center">Đang tải giỏ hàng...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn</h1>
        <p className="text-gray-500 mb-6">Chưa có sản phẩm nào trong giỏ hàng của bạn.</p>
        <Link to="/products" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm trong giỏ */}
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center p-4 border-b last:border-b-0">
                  <img src={item.productVariantImageUrl} alt={item.productName} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"/>
                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="font-bold text-lg">{item.productName}</h2>
                    <p className="text-sm text-gray-500">Màu: {item.productVariantColor}, Size: {item.productVariantSize}</p>
                    <p className="text-blue-600 font-semibold mt-1 text-base">{item.productVariantPrice.toLocaleString('vi-VN')} ₫</p>
                  </div>
                  <div className="flex items-center my-4 sm:my-0 sm:mx-4">
                    <button onClick={() => handleUpdateQuantity(item, item.quantity - 1)} disabled={updatingItemId === item.id || item.quantity <= 1} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item, item.quantity + 1)} disabled={updatingItemId === item.id} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} disabled={updatingItemId === item.id} className="text-gray-500 hover:text-red-500 disabled:opacity-50">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-bold border-b pb-4 mb-4">Tóm tắt đơn hàng</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-semibold">{cart.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-semibold">Miễn phí</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Tổng cộng</span>
                <span>{cart.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
              </div>
              <Link 
                to="/checkout" 
                className="block text-center w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

