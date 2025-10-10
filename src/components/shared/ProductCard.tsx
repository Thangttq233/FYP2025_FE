import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { ProductDto } from "@/types/product";

const ProductCard = ({ product }: { product: ProductDto }) => {
  const hasVariants = product.variants && product.variants.length > 0;

  let priceDisplay = "Liên hệ";
  if (hasVariants) {
    const prices = product.variants.map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    priceDisplay =
      minPrice === maxPrice
        ? `${minPrice.toLocaleString()}đ`
        : `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`;
  }

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-md">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-2 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Thêm vào giỏ hàng
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 h-10">
          {product.name}
        </h3>
        <p className="text-red-500 font-bold">{priceDisplay}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
