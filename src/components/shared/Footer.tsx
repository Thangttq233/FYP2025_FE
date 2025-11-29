import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16 md:mt-24 border-t border-gray-800 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-wider uppercase">4MEN</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Thời trang nam 4MEN – Hệ thống cửa hàng bán quần áo nam phong cách, 
              hiện đại, trẻ trung. Cam kết chất lượng và dịch vụ tốt nhất.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 md:mb-6">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors flex items-center">
                  Giới thiệu về 4MEN
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors flex items-center">
                  Liên hệ & Góp ý
                </Link>
              </li>
              <li>
                <Link to="/policy" className="hover:text-blue-400 transition-colors flex items-center">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors flex items-center">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 md:mb-6">Thông Tin Liên Hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Hotline</span>
                  <span className="text-white font-medium text-base">0868 444 644</span>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Email</span>
                  <span className="text-white hover:text-blue-400 cursor-pointer">info@4menshop.com</span>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                <Link to="/stores" className="hover:text-blue-400 transition-colors">
                  Hệ thống 15 cửa hàng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 md:mb-6">Đăng Ký Nhận Tin</h3>
            <p className="text-sm mb-4 text-gray-400">
              Nhận thông tin sản phẩm mới và khuyến mãi hấp dẫn.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn..."
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm uppercase tracking-wide"
              >
                Đăng ký ngay
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 bg-gray-950 py-6">
        <div className="container mx-auto px-4 text-center text-xs md:text-sm text-gray-500">
          <p className="mb-2">© {new Date().getFullYear()} CÔNG TY TNHH THỜI TRANG 4MEN. All rights reserved.</p>
          <p>Designed for Mobile & PC Experience.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;