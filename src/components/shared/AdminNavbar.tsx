import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { auth, logOut } = useAuthStore();
  const navigate = useNavigate();

  const handlelogout = () => {
    logOut();
    navigate("/login");
  };
  return (
    <header className="fixed top-0 left-64 right-0 z-10 flex h-20 items-center justify-between border-b border-neutral-200/80 bg-gray-100 px-8 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-gray-700">
        <User className="h-5 w-5" />
        <span>{auth?.fullName ?? "Admin"}</span>
      </div>
      <div className="flex items-center gap-4">
        <Button
          size="sm"
          onClick={handlelogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
