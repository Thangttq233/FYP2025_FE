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
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-lg border border-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="hidden lg:flex absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-3 justify-center items-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <ShoppingCart className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Xem chi tiết</span>
        </div>
      </div>
      <div className="p-2 md:p-3 text-center">
        <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-1 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]" title={product.name}>
          {product.name}
        </h3>
        <p className="text-red-600 font-bold text-sm md:text-base">
            {priceDisplay}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;