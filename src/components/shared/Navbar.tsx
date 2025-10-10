import { useState, useEffect, useMemo, useRef } from "react"; 
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { customerApi } from "@/pages/customer/api";
import { MainCategoryType, type CategoryDto } from "@/types/categories";


const mainCategoryMap: { [key: string]: MainCategoryType } = {
  "HÀNG MỚI": MainCategoryType.HangMoi,
  "ÁO NAM": MainCategoryType.AoNam,
  "QUẦN NAM": MainCategoryType.QuanNam,
  "GIÀY DÉP": MainCategoryType.GiayDep,
  "PHỤ KIỆN": MainCategoryType.PhuKien,
  "QUÀ TẶNG": MainCategoryType.QuaTang,
  "X-TECH": MainCategoryType.XTech,
  "ƯU ĐÃI": MainCategoryType.UuDai,
};


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { auth } = useAuthStore();


  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryDto[]>([]);
  const navRef = useRef<HTMLElement>(null); // Dùng để đóng dropdown khi click ra ngoài

  // Lấy dữ liệu categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await customerApi.getCategories();
        setAllCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Xử lý đóng dropdown khi click ra ngoài component
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Nhóm các categories lại để dễ dàng hiển thị
  const groupedCategories = useMemo(() => {
    const groups: { [key: string]: CategoryDto[] } = {};
    allCategories.forEach((category) => {
      const mainCategoryLabel = Object.keys(mainCategoryMap).find(
        (key) => mainCategoryMap[key] === category.mainCategory
      );
      if (mainCategoryLabel) {
        if (!groups[mainCategoryLabel]) {
          groups[mainCategoryLabel] = [];
        }
        groups[mainCategoryLabel].push(category);
      }
    });
    return groups;
  }, [allCategories]);

  // Hàm bật/tắt dropdown
  const handleNavToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };


  useEffect(() => {
    setIsLogin(auth !== null);
  }, [auth]);

  const navItems = [
    { label: "HÀNG MỚI", hasDropdown: true },
    { label: "ÁO NAM", hasDropdown: true },
    { label: "QUẦN NAM", hasDropdown: true },
    { label: "GIÀY DÉP", hasDropdown: true },
    { label: "PHỤ KIỆN", hasDropdown: true },
    { label: "QUÀ TẶNG", hasDropdown: true },
    { label: "X-TECH" },
    { label: "ƯU ĐÃI" },
  ];

  return (

    <header className="bg-white shadow-md" ref={navRef}>
      <div className="bg-gray-900 text-white text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center hover:text-gray-300">
              <Phone className="h-4 w-4 mr-1" />
              <span>Hotline: 0868.444.644</span>
            </a>
            <a
              href="#"
              className="hidden md:flex items-center hover:text-gray-300"
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span>Hệ thống cửa hàng</span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="hover:text-gray-300">
              Kiểm tra đơn hàng
            </a>
            <a href="#" className="hover:text-gray-300">
              Chính sách VIP
            </a>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/">LOGO</Link> 
          </div>


          <div className="hidden lg:flex lg:items-center lg:space-x-8 font-semibold">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
 
                <button
                  onClick={() => item.hasDropdown && handleNavToggle(item.label)}
                  className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-300 group"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transform transition-transform duration-300 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Phần hiển thị dropdown */}
                {item.hasDropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                    {groupedCategories[item.label]?.length > 0 ? (
                      groupedCategories[item.label].map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                          onClick={() => setOpenDropdown(null)} 
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-sm text-gray-500">
                        Không có danh mục.
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>


          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center border rounded-full px-3 py-1.5">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="outline-none text-sm"
              />
              <Search className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>

            <Link
              to={isLogin ? "/profile" : "/login"}
              className="h-6 w-6 text-gray-700 cursor-pointer hover:text-blue-600"
            >
              <User />
            </Link>

            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 cursor-pointer hover:text-blue-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-4 py-2">
            <div className="flex items-center border rounded-full px-3 py-1.5 mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="outline-none text-sm w-full"
              />
              <Search className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href="#"
                className="block py-2 text-gray-800 font-semibold border-b"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;