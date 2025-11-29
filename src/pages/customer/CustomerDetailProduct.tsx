import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerApi } from './api';
import type { ProductDto, ProductVariantDto } from '@/types/product';
import { ShoppingCart, Check, Minus, Plus, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const CustomerDetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await customerApi.detailProduct(id);
        setProduct(data);
        if (data && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const uniqueColors = product ? [...new Set(product.variants.map(v => v.color))] : [];
  const uniqueSizes = product ? [...new Set(product.variants.map(v => v.size))] : [];

  const handleColorChange = (color: string) => {
    const currentSize = selectedVariant?.size;
    let newVariant = product?.variants.find(v => v.color === color && v.size === currentSize);
    if (!newVariant) {
        newVariant = product?.variants.find(v => v.color === color);
    }
    if (newVariant) {
      setSelectedVariant(newVariant);
      setQuantity(1);
    }
  };

  const handleSizeChange = (size: string) => {
    const currentColor = selectedVariant?.color;
    const newVariant = product?.variants.find(v => v.size === size && v.color === currentColor);
    if (newVariant) {
      setSelectedVariant(newVariant);
      setQuantity(1);
    }
  };
  
  const handleQuantityChange = (amount: number) => {
    if (!selectedVariant) return;
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= selectedVariant.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!auth) {
      navigate('/login');
      return;
    }

    if (!selectedVariant || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const itemToAdd = {
        productVariantId: selectedVariant.id,
        quantity: quantity,
      };
      
      await customerApi.addItemToCart(itemToAdd);
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } catch (err: any) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (error || !product) {
    return <div className="container mx-auto p-8 text-center text-red-500">{error || "Không tìm thấy sản phẩm."}</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-6 pb-24 md:pb-8">
      
      <div className="md:hidden mb-4">
         <button onClick={() => navigate(-1)} className="flex items-center text-gray-600">
             <ChevronLeft size={20} /> Quay lại
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10">
        
        <div className="lg:col-span-2">
            <div className="mb-3 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative aspect-square md:aspect-auto">
                <img 
                    src={selectedVariant?.imageUrl || product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:gap-2 no-scrollbar">
                {product.variants.map(variant => (
                    <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex-shrink-0 w-16 h-16 md:w-full md:h-auto aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedVariant?.id === variant.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'}`}
                    >
                        <img
                            src={variant.imageUrl}
                            alt={variant.color}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>

        <div className="lg:col-span-3 flex flex-col">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                
                <p className="text-2xl font-bold text-blue-600 mb-4">
                    {selectedVariant?.price.toLocaleString('vi-VN')} ₫
                </p>
                
                <p className="text-gray-600 mb-6 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {product.description}
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-10">
                    <h3 className="text-sm font-semibold text-gray-700 w-20 pt-2">Màu sắc:</h3>
                    <div className="flex flex-wrap gap-3">
                        {uniqueColors.map(color => (
                            <button
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={`group relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                                    ${selectedVariant?.color === color ? 'border-blue-500 ring-2 ring-blue-100 scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            >
                                {selectedVariant?.color === color && <Check size={18} className={color.toLowerCase() === 'white' ? 'text-black' : 'text-white'} />}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-10">
                    <h3 className="text-sm font-semibold text-gray-700 w-20 pt-2">Kích thước:</h3>
                    <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map(size => {
                            const isAvailable = product.variants.some(v => v.color === selectedVariant?.color && v.size === size);
                            return (
                                <button
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    disabled={!isAvailable}
                                    className={`min-w-[3rem] px-3 py-2 text-sm font-medium rounded-md border transition-all
                                        ${selectedVariant?.size === size 
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}
                                        ${!isAvailable ? 'opacity-40 cursor-not-allowed bg-gray-50' : ''}`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>                      
                
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-10">
                    <h3 className="text-sm font-semibold text-gray-700 w-20">Số lượng:</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 hover:bg-gray-100 transition-colors"><Minus size={16} /></button>
                            <span className="px-3 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 hover:bg-gray-100 transition-colors"><Plus size={16} /></button>
                        </div>
                        <span className="text-sm text-gray-500">
                            {selectedVariant?.stockQuantity} sản phẩm có sẵn
                        </span>
                    </div>
                </div>
            </div>          
            
            <div className="hidden md:block mt-8 pt-6 border-t border-gray-100">
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stockQuantity < 1 || isAddingToCart}
                    className="w-full md:w-auto min-w-[200px] bg-blue-600 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
                >
                    <ShoppingCart size={20} />
                    {isAddingToCart ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
                </button>
            </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-40 safe-area-pb">
          <div className="flex gap-3">
             <div className="flex flex-col justify-center">
                 <span className="text-xs text-gray-500">Tổng cộng:</span>
                 <span className="text-lg font-bold text-blue-600">
                    {(selectedVariant ? selectedVariant.price * quantity : 0).toLocaleString('vi-VN')}₫
                 </span>
             </div>
             <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stockQuantity < 1 || isAddingToCart}
                className="flex-1 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform disabled:bg-gray-400"
             >
                 {isAddingToCart ? (
                     <span className="text-sm">Đang xử lý...</span>
                 ) : (
                     <>
                        <ShoppingCart size={18} />
                        Mua ngay
                     </>
                 )}
             </button>
          </div>
      </div>

    </div>
  );
};

export default CustomerDetailProduct;