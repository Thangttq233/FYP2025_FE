import {
  ChevronRight,
  Truck,
  RefreshCw,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { ProductDto } from "../../types/product";
import { customerApi } from "./api";
import ProductCard from "@/components/shared/ProductCard";
const SectionHeader = ({
  title,
  viewMoreLink = "#",
}: {
  title: string;
  viewMoreLink?: string;
}) => (
  <div className="flex justify-between items-end mb-4 md:mb-6">
    <h2 className="text-xl md:text-2xl font-bold uppercase text-gray-800 leading-none">
      {title}
    </h2>
    <a
      href={viewMoreLink}
      className="flex items-center text-sm md:text-base text-blue-600 hover:underline"
    >
      Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
    </a>
  </div>
);

const HeroSection = () => (
  <section className="">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
      <div className="lg:col-span-2 relative h-[200px] sm:h-[300px] lg:h-[500px] rounded-lg overflow-hidden group">
        <img
          src="https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Main Banner"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-rows-2 lg:grid-cols-1 gap-3 md:gap-4">
        <div className="relative h-[100px] sm:h-[150px] lg:h-full rounded-lg overflow-hidden group">
          <img
            src="https://images.pexels.com/photos/3768235/pexels-photo-3768235.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Sub-banner 1"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="relative h-[100px] sm:h-[150px] lg:h-full rounded-lg overflow-hidden group">
          <img
            src="https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Sub-banner 2"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  </section>
);

const PolicySection = () => (
  <section className="bg-gray-50 py-8 md:py-12 mt-8">
    <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
      <PolicyItem 
        icon={<Truck className="h-8 w-8 md:h-10 md:w-10 text-blue-600 mb-3" />} 
        title="Miễn phí vận chuyển" 
        desc="Cho đơn hàng từ 499k" 
      />
      <PolicyItem 
        icon={<RefreshCw className="h-8 w-8 md:h-10 md:w-10 text-blue-600 mb-3" />} 
        title="Đổi trả dễ dàng" 
        desc="Trong vòng 7 ngày" 
      />
      <PolicyItem 
        icon={<ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-blue-600 mb-3" />} 
        title="Chất lượng đảm bảo" 
        desc="Sản phẩm chính hãng" 
      />
      <PolicyItem 
        icon={<Phone className="h-8 w-8 md:h-10 md:w-10 text-blue-600 mb-3" />} 
        title="Hotline hỗ trợ" 
        desc="0868.444.644" 
      />
    </div>
  </section>
);

const PolicyItem = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex flex-col items-center p-2">
    {icon}
    <h4 className="font-semibold text-sm md:text-base text-gray-900">{title}</h4>
    <p className="text-xs md:text-sm text-gray-500 mt-1">{desc}</p>
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await customerApi.getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Lỗi load sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full space-y-8 md:space-y-12"> 
      <HeroSection />
      <section>
        <SectionHeader title="Sản phẩm nổi bật" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="w-full">
        <div className="relative h-32 sm:h-48 md:h-64 rounded-lg overflow-hidden">
          <img
            src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Promotion Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      <section>
        <SectionHeader title="Hàng mới về" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {products.slice(0, 4).reverse().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <PolicySection />
    </div>
  );
};

export default HomePage;