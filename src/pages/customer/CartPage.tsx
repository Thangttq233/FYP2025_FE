import { useState, useEffect } from 'react';
import { customerApi } from './api';
import type { CartDto, CartItemDto } from '@/types/cart';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const cartData = await customerApi.getUserCart();
      setCart(cartData);
    } catch (error) {
      console.error("Không thể tải giỏ hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (item: CartItemDto, newQuantity: number) => {
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
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center bg-gray-50">
        <div className="bg-white p-8 rounded-full mb-6 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h1 className="text-xl font-bold mb-2 text-gray-800">Giỏ hàng trống</h1>
        <p className="text-gray-500 mb-6 max-w-xs">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Link to="/products" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-8">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Giỏ hàng ({cart.items.length})</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div key={item.id} className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3 md:gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                        src={item.productVariantImageUrl} 
                        alt={item.productName} 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h2 className="font-semibold text-gray-800 text-sm md:text-lg line-clamp-2 mb-1">{item.productName}</h2>
                    <p className="text-xs md:text-sm text-gray-500 mb-2">
                        {item.productVariantColor} • {item.productVariantSize}
                    </p>
                    <p className="text-blue-600 font-bold text-sm md:text-lg">
                        {item.productVariantPrice.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 md:mt-0">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button 
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)} 
                            disabled={updatingItemId === item.id || item.quantity <= 1} 
                            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                        <Minus size={14} />
                        </button>
                        <span className="w-8 md:w-10 text-center font-semibold text-sm">{item.quantity}</span>
                        <button 
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)} 
                            disabled={updatingItemId === item.id} 
                            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                        <Plus size={14} />
                        </button>
                    </div>
                    <button 
                        onClick={() => handleRemoveItem(item.id)} 
                        disabled={updatingItemId === item.id} 
                        className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="hidden lg:block bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{cart.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Tổng cộng</span>
                    <span className="font-bold text-xl text-blue-600">{cart.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">(Đã bao gồm VAT)</p>
              </div>
              <Link 
                to="/checkout" 
                className="block text-center w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
              >
                Tiến hành thanh toán
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center justify-between container mx-auto px-0 md:px-4">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">Tổng thanh toán:</span>
                <span className="font-bold text-lg text-blue-600">{cart.totalCartPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
            <Link 
                to="/checkout" 
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 text-sm"
            >
                Mua hàng ({cart.items.length})
            </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;