import {
  ChevronRight,
  ShoppingCart,
  Truck,
  RefreshCw,
  ShieldCheck,
  Phone,
} from "lucide-react";

const sampleProducts = [
  {
    id: 1,
    name: "Áo Sơ Mi Nam Oxford Tay Dài Form Regular",
    price: "489.000đ",
    originalPrice: "599.000đ",
    imageUrl:
      "https://images.pexels.com/photos/2955375/pexels-photo-2955375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isNew: true,
  },
  {
    id: 2,
    name: "Quần Jeans Nam Slimfit Wash Rách",
    price: "549.000đ",
    originalPrice: "",
    imageUrl:
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 3,
    name: "Áo Thun Nam Cổ Tròn In Họa Tiết",
    price: "299.000đ",
    originalPrice: "350.000đ",
    imageUrl:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 4,
    name: "Giày Sneaker Nam Da Bò Thật",
    price: "1.299.000đ",
    originalPrice: "",
    imageUrl:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isNew: true,
  },
];

const ProductCard = ({ product }: { product: (typeof sampleProducts)[0] }) => (
  <div className="group">
    <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-md">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {product.isNew && (
        <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-sm">
          NEW
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-2 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
        <ShoppingCart className="h-5 w-5 mr-2" />
        Thêm vào giỏ hàng
      </div>
    </div>
    <div className="p-4 text-center">
      <h3 className="text-sm font-semibold text-gray-800 mb-1 h-10">
        {product.name}
      </h3>
      <div className="flex justify-center items-baseline space-x-2">
        <p className="text-red-500 font-bold">{product.price}</p>
        {product.originalPrice && (
          <p className="text-gray-500 line-through text-sm">
            {product.originalPrice}
          </p>
        )}
      </div>
    </div>
  </div>
);

const SectionHeader = ({
  title,
  viewMoreLink = "#",
}: {
  title: string;
  viewMoreLink?: string;
}) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold uppercase text-gray-800">{title}</h2>
    <a
      href={viewMoreLink}
      className="flex items-center text-blue-600 hover:underline"
    >
      Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
    </a>
  </div>
);

const HeroSection = () => (
  <section className="container mx-auto px-4 my-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 relative h-full min-h-[250px] lg:min-h-[500px] rounded-md overflow-hidden">
        <img
          src="https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Main Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-rows-2 gap-4">
        <div className="relative h-full rounded-md overflow-hidden">
          <img
            src="https://images.pexels.com/photos/3768235/pexels-photo-3768235.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Sub-banner 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full rounded-md overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Sub-banner 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

const PolicySection = () => (
  <section className="bg-gray-100 py-8">
    <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div className="flex flex-col items-center">
        <Truck className="h-10 w-10 text-blue-600 mb-2" />
        <h4 className="font-semibold">Miễn phí vận chuyển</h4>
        <p className="text-sm text-gray-600">Cho đơn hàng từ 499k</p>
      </div>
      <div className="flex flex-col items-center">
        <RefreshCw className="h-10 w-10 text-blue-600 mb-2" />
        <h4 className="font-semibold">Đổi trả dễ dàng</h4>
        <p className="text-sm text-gray-600">Trong vòng 7 ngày</p>
      </div>
      <div className="flex flex-col items-center">
        <ShieldCheck className="h-10 w-10 text-blue-600 mb-2" />
        <h4 className="font-semibold">Chất lượng đảm bảo</h4>
        <p className="text-sm text-gray-600">Sản phẩm chính hãng</p>
      </div>
      <div className="flex flex-col items-center">
        <Phone className="h-10 w-10 text-blue-600 mb-2" />
        <h4 className="font-semibold">Hotline hỗ trợ</h4>
        <p className="text-sm text-gray-600">0868.444.644</p>
      </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <main>
      <HeroSection />

      <section className="container mx-auto px-4 my-12">
        <SectionHeader title="Sản phẩm nổi bật" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 my-12">
        <div className="relative h-48 md:h-64 rounded-md overflow-hidden">
          <img
            src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Promotion Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 my-12">
        <SectionHeader title="Hàng mới về" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {sampleProducts
            .slice(0, 4)
            .reverse()
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      <PolicySection />
    </main>
  );
};

export default HomePage;
