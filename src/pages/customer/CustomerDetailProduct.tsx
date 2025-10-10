import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { customerApi } from './api';
import type { ProductDto, ProductVariantDto } from '@/types/product';
import { ShoppingCart, Check, Star } from 'lucide-react';

const CustomerDetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await customerApi.detailProduct(id);
        setProduct(data);
        // Mặc định chọn biến thể đầu tiên
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

  // Lấy danh sách các màu và size duy nhất từ các biến thể
  const uniqueColors = product ? [...new Set(product.variants.map(v => v.color))] : [];
  const uniqueSizes = product ? [...new Set(product.variants.map(v => v.size))] : [];

  const handleColorChange = (color: string) => {
    // Tìm biến thể đầu tiên có màu này và size đang được chọn (nếu có)
    const currentSize = selectedVariant?.size;
    let newVariant = product?.variants.find(v => v.color === color && v.size === currentSize);
    // Nếu không tìm thấy, chọn biến thể đầu tiên có màu này
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

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    console.log({
        productId: product?.id,
        variantId: selectedVariant.id,
        quantity: quantity,
        price: selectedVariant.price
    });
    // TODO: Thêm logic gọi API để thêm vào giỏ hàng
    alert(`Đã thêm ${quantity} sản phẩm "${product?.name} - ${selectedVariant.color} - ${selectedVariant.size}" vào giỏ hàng!`);
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
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phần hình ảnh */}
        <div>
            <div className="mb-4">
                <img 
                    src={selectedVariant?.imageUrl || product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
            </div>
            <div className="grid grid-cols-5 gap-2">
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
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            {selectedVariant?.price.toLocaleString('vi-VN')} ₫
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Chọn màu sắc */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Màu sắc: <span className="font-normal">{selectedVariant?.color}</span></h3>
            <div className="flex flex-wrap gap-2">
              {uniqueColors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                    ${selectedVariant?.color === color ? 'border-blue-500' : 'border-gray-300'}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                >
                    {selectedVariant?.color === color && <Check size={20} className="text-white" />}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chọn size */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Kích thước:</h3>
            <div className="flex flex-wrap gap-2">
                {uniqueSizes.map(size => {
                    const isAvailable = product.variants.some(v => v.color === selectedVariant?.color && v.size === size);
                    return (
                        <button
                            key={size}
                            onClick={() => handleSizeChange(size)}
                            disabled={!isAvailable}
                            className={`px-4 py-2 rounded-md border 
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
          
          {/* Số lượng */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Số lượng:</h3>
            <div className="flex items-center border border-gray-300 rounded-md w-fit">
              <button onClick={() => handleQuantityChange(-1)} className="px-4 py-2 text-lg">-</button>
              <span className="px-6 py-2 text-lg">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="px-4 py-2 text-lg">+</button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
                {selectedVariant?.stockQuantity} sản phẩm có sẵn
            </p>
          </div>
          
          {/* Nút thêm vào giỏ hàng */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stockQuantity < 1}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailProduct;

