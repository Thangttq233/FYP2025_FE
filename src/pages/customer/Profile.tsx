import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, MapPin } from 'lucide-react';
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const profileNavItems = [
  { name: 'Thông tin tài khoản', path: '/profile', icon: User, end: true },
  { name: 'Lịch sử đơn hàng', path: '/profile/orders', icon: ShoppingBag, end: false },
  { name: 'Sổ địa chỉ', path: '/profile/addresses', icon: MapPin, end: false },
];

const Profile = () => {
  const location = useLocation();
  const { auth, logOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/");
    toast.success("Đăng xuất thành công!");
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Tài khoản</h2>
            <nav className="space-y-2">
              {profileNavItems.map(item => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md transition-colors ${
                      isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
        <div className="lg:col-span-3">
            <Outlet />
            {location.pathname === '/profile' && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold mb-4">Thông tin tài khoản</h1>
                    <div className="space-y-2">
                        <p>
                        <span className="font-semibold">Họ và tên:</span> {auth?.fullName}
                        </p>
                        <p>
                        <span className="font-semibold">Email:</span> {auth?.email}
                        </p>
                        <p>
                        <span className="font-semibold">Vai trò:</span> {auth?.roles.join(', ')}
                        </p>
                    </div>
                    <Button className="mt-6" onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

