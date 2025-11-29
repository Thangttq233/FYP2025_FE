import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Package,
  CreditCard,
  MessageSquare,
  ClipboardList,
  LayoutDashboard,
  Tags,
  Users,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Trang Quản trị", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Sản phẩm", path: "/admin/products", icon: Package },
  { label: "Danh mục", path: "/admin/categories", icon: Tags },
  { label: "Đơn hàng", path: "/admin/orders", icon: ClipboardList },
  { label: "Hóa đơn", path: "/admin/payments", icon: CreditCard },
  { label: "Trò chuyện", path: "/admin/chatting", icon: MessageSquare },
  { label: "Người dùng", path: "/admin/users", icon: Users },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-700"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-neutral-200/80 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block flex-shrink-0
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between px-6 border-b border-neutral-200/80">
            <h1 className="text-xl font-bold tracking-widest text-neutral-800">
              <Link to="/">HOME</Link>
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                        isActive
                          ? "bg-gray-900 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </nav>
          
          <div className="p-4 border-t border-neutral-200">
             <div className="text-xs text-center text-gray-400">
                Admin Panel v1.0
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;