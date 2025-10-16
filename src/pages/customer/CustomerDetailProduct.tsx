import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerApi } from './api';
import type { ProductDto, ProductVariantDto } from '@/types/product';
import { ShoppingCart, Check } from 'lucide-react';
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

  // Lấy dữ liệu sản phẩm từ API
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

      alert(`Đã thêm ${quantity} sản phẩm "${product?.name} - ${selectedVariant.color} - ${selectedVariant.size}" vào giỏ hàng!`);
      
    } catch (err: any) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-8 text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-8 text-center">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10">
        
        {/* Phần hình ảnh */}
        <div className="md:col-span-2">
            <div className="mb-3">
                <img 
                    src={selectedVariant?.imageUrl || product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                />
            </div>
            <div className="grid grid-cols-5 gap-1.5">
                {product.variants.map(variant => (
                    <img
                        key={variant.id}
                        src={variant.imageUrl}
                        alt={`${product.name} - ${variant.color}`}
                        className={`w-full h-auto object-cover rounded-md cursor-pointer border-2 ${selectedVariant?.id === variant.id ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => setSelectedVariant(variant)}
                    />
                ))}
            </div>
        </div>

        {/* Phần thông tin và tùy chọn */}
        <div className="md:col-span-3 flex flex-col">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-xl font-bold text-blue-600 mb-3">
                    {selectedVariant?.price.toLocaleString('vi-VN')} ₫
                </p>
                {/* ĐÃ THÊM LẠI DÒNG MÔ TẢ */}
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
            </div>

            <hr className="my-5 border-gray-200" />

            <div className="flex-grow space-y-4">
                <div className="grid grid-cols-4 items-center">
                    <h3 className="text-base font-semibold text-gray-700 col-span-1">Màu sắc</h3>
                    <div className="col-span-3 flex flex-wrap gap-2">
                        {uniqueColors.map(color => (
                            <button
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition
                                    ${selectedVariant?.color === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                            >
                                {selectedVariant?.color === color && <Check size={16} className="text-white" />}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-4 items-center">
                    <h3 className="text-base font-semibold text-gray-700 col-span-1">Kích thước</h3>
                    <div className="col-span-3 flex flex-wrap gap-2">
                        {uniqueSizes.map(size => {
                            const isAvailable = product.variants.some(v => v.color === selectedVariant?.color && v.size === size);
                            return (
                                <button
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    disabled={!isAvailable}
                                    className={`px-3 py-1.5 text-sm rounded-md border transition
                                        ${selectedVariant?.size === size 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-white text-gray-800 border-gray-300'}
                                        ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                <div className="grid grid-cols-4 items-center">
                    <h3 className="text-base font-semibold text-gray-700 col-span-1">Số lượng</h3>
                    <div className="col-span-3 flex items-center">
                        <div className="flex items-center border border-gray-300 rounded-md w-fit">
                            <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1 text-base">-</button>
                            <span className="px-4 py-1 text-base">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} className="px-3 py-1 text-base">+</button>
                        </div>
                        <p className="text-sm text-gray-500 ml-4">
                            {selectedVariant?.stockQuantity} sản phẩm có sẵn
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="mt-6">
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stockQuantity < 1 || isAddingToCart}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <ShoppingCart size={18} />
                    {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailProduct;