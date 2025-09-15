import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">4MEN</h2>
          <p className="text-sm leading-6">
            Thời trang nam 4MEN – Hệ thống cửa hàng bán quần áo nam phong cách,
            hiện đại, trẻ trung. Cam kết chất lượng và dịch vụ tốt nhất.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Hỗ Trợ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link to="/policy" className="hover:text-white">
                Chính sách
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Chăm Sóc KH</h3>
          <ul className="space-y-2 text-sm">
            <li>
              Hotline:{" "}
              <span className="text-white font-medium">0868 444 644</span>
            </li>
            <li>
              Email:{" "}
              <span className="text-white font-medium">info@4menshop.com</span>
            </li>
            <li>
              <Link to="/stores" className="hover:text-white">
                Hệ thống cửa hàng
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Đăng ký nhận tin
          </h3>
          <p className="text-sm mb-3">
            Nhận thông tin khuyến mãi mới nhất từ 4MEN.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Nhập email..."
              className="w-full px-3 py-2 rounded-l-md text-black"
            />
            <button
              type="submit"
              className="bg-red-500 px-4 py-2 rounded-r-md text-white hover:bg-red-600"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} 4MEN. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
