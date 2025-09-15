import { NavLink, Link } from "react-router-dom";
import {
  Package,
  CreditCard,
  MessageSquare,
  ClipboardList,
  LayoutDashboard,
  Tags,
  Users,
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
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-100 border-r border-neutral-200/80">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-center border-b border-neutral-200/80">
          <h1 className="text-xl tracking-widest text-neutral-800">
            <Link to="/">HOME</Link>
          </h1>
        </div>
        <nav className="flex-1 px-4 py-6">
          <div className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-500 hover:bg-gray-800 hover:text-white"
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
      </div>
    </aside>
  );
};

export default Sidebar;
