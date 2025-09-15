import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const { auth, logOut } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logOut();
    navigate("/");
    toast.success("Đăng xuất thành công!");
  };
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p>
        <span className="font-bold">Fullname:</span> {auth?.fullName}
      </p>
      <p>
        <span className="font-bold">Email:</span> {auth?.email}
      </p>
      <p>
        <span className="font-bold">Roles:</span>
        {auth?.roles}
      </p>
      <Button className="mt-4" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
