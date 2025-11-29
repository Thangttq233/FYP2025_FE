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
  ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
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
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  
  const [allCategories, setAllCategories] = useState<CategoryDto[]>([]);
  const navRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!auth) {
        setCartCount(0);
        return;
      }
      try {
        const count = await customerApi.getCartCount();
        setCartCount(count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [auth]);

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

  const handleDesktopNavToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleMobileNavToggle = (label: string) => {
    setExpandedMobileMenu(expandedMobileMenu === label ? null : label);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          console.log("Searching for:", e.currentTarget.value);
          setIsMenuOpen(false); 
      }
  }

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
    <header className="bg-white shadow-md w-full sticky top-0 z-50" ref={navRef}>
      <div className="hidden md:block bg-gray-900 text-white text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="#" className="flex items-center hover:text-gray-300">
              <Phone className="h-4 w-4 mr-1" />
              <span>Hotline: 0868.444.644</span>
            </a>
            <a href="#" className="flex items-center hover:text-gray-300">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Hệ thống cửa hàng</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-gray-300">Kiểm tra đơn hàng</a>
            <a href="#" className="hover:text-gray-300">Chính sách VIP</a>
          </div>
        </div>
      </div>
      <nav className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -ml-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          <div className="flex-shrink-0 flex-grow lg:flex-grow-0 text-center lg:text-left">
            <Link to="/" className="text-2xl font-bold tracking-tighter">LOGO</Link>
          </div>
          <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8 font-semibold text-sm">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => item.hasDropdown && handleDesktopNavToggle(item.label)}
                  className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-300 py-2"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""}`} />
                  )}
                </button>
                {item.hasDropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-md shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {groupedCategories[item.label]?.length > 0 ? (
                      groupedCategories[item.label].map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-sm text-gray-500">Đang cập nhật...</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center border rounded-full px-3 py-1.5 bg-gray-50">
              <input type="text" placeholder="Tìm kiếm..." className="bg-transparent outline-none text-sm w-32 lg:w-48" onKeyDown={handleSearch}/>
              <Search className="h-4 w-4 text-gray-500 cursor-pointer" />
            </div>
            <Link to={isLogin ? "/profile" : "/login"} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="h-6 w-6 text-gray-700" />
            </Link>

            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white top-[60px] overflow-y-auto pb-20 animate-in slide-in-from-left duration-300">
          <div className="p-4">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={handleSearch}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => item.hasDropdown ? handleMobileNavToggle(item.label) : setIsMenuOpen(false)}
                    className="w-full flex items-center justify-between py-3 px-2 text-left font-semibold text-gray-800 active:bg-gray-50"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                          expandedMobileMenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {item.hasDropdown && expandedMobileMenu === item.label && (
                    <div className="bg-gray-50 rounded-lg mb-2 overflow-hidden">
                      {groupedCategories[item.label]?.length > 0 ? (
                        groupedCategories[item.label].map((category) => (
                          <Link
                            key={category.id}
                            to={`/category/${category.id}`}
                            className="block px-5 py-3 text-sm text-gray-600 border-l-2 border-transparent hover:border-blue-500 hover:text-blue-600 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="flex items-center justify-between">
                                {category.name}
                                <ChevronRight className="h-3 w-3 text-gray-300"/>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="px-5 py-3 text-sm text-gray-400 italic">Đang cập nhật...</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <a href="#" className="flex items-center text-gray-600 text-sm">
                    <Phone className="h-4 w-4 mr-3" /> Hotline: 0868.444.644
                </a>
                <a href="#" className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-3" /> Hệ thống cửa hàng
                </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;