import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, MapPin, LogOut } from 'lucide-react';
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
    <div className="container mx-auto p-4 md:p-8 min-h-[60vh]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-0 lg:p-4 rounded-lg lg:shadow-sm lg:sticky lg:top-24">
            <h2 className="hidden lg:block text-xl font-bold mb-4">Tài khoản</h2>
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {profileNavItems.map(item => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center whitespace-nowrap px-4 py-2 lg:p-3 rounded-full lg:rounded-md transition-colors text-sm md:text-base border lg:border-0
                    ${isActive 
                      ? 'bg-blue-600 text-white lg:bg-blue-100 lg:text-blue-600 font-semibold border-blue-600' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 lg:hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className={`w-4 h-4 mr-2 ${window.innerWidth < 1024 ? '' : ''}`} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
        <div className="lg:col-span-3">
            <Outlet />
            {location.pathname === '/profile' && (
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Hồ sơ của tôi</h1>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 lg:hidden"
                            onClick={handleLogout}
                        >
                           <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                            <span className="font-medium text-gray-500 w-32">Họ và tên:</span>
                            <span className="font-semibold text-gray-900 mt-1 sm:mt-0">{auth?.fullName || "Chưa cập nhật"}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                            <span className="font-medium text-gray-500 w-32">Email:</span>
                            <span className="font-semibold text-gray-900 mt-1 sm:mt-0">{auth?.email}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                            <span className="font-medium text-gray-500 w-32">Vai trò:</span>
                            <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600 mt-1 sm:mt-0">
                                {auth?.roles.join(', ')}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center sm:justify-start">
                        <Button 
                            className="w-full sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;