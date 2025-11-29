import React, { useState } from "react";
import type { AuthResponseDto, RegisterRequestDto } from "@/types/auth";
import { authApi } from "./api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, User, Calendar, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const passwordRequirements = [
  "Ít nhất một ký tự đặc biệt (@, #, $, ...)",
  "Ít nhất một chữ số ('0'-'9').",
  "Ít nhất một chữ hoa ('A'-'Z').",
];

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (!/[^a-zA-Z0-9]/.test(password)) errors.push(passwordRequirements[0]);
  if (!/\d/.test(password)) errors.push(passwordRequirements[1]);
  if (!/[A-Z]/.test(password)) errors.push(passwordRequirements[2]);
  return errors;
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequestDto>({
    email: "",
    dateOfBirth: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validatePassword(form.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setPasswordErrors([]);
    setLoading(true);

    try {
      const res: AuthResponseDto = await authApi.register(form);
      if (res.isSuccess) {
        setAuth(res);
        navigate("/");
        toast.success("Đăng ký thành công!");
      } else {
        toast.error(res.errors?.[0] || "Đăng ký thất bại!");
      }
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tạo tài khoản mới</h2>
        <p className="text-gray-500 text-sm">Nhập thông tin cá nhân của bạn</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label>Họ và tên</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              className="pl-9 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="pl-9 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ngày sinh</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              required
              className="pl-9 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="password"
              placeholder="********"
              value={form.password}
              onChange={(e) => {
                 setForm({ ...form, password: e.target.value });
                 // Tự động clear lỗi khi người dùng nhập lại
                 if(passwordErrors.length > 0) setPasswordErrors([]); 
              }}
              required
              className="pl-9 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Xác nhận mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="password"
              placeholder="********"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              className="pl-9 h-11"
            />
          </div>
        </div>

        {passwordErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2 animate-in slide-in-from-top-2">
            <div className="flex items-center text-red-700 font-medium text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              Mật khẩu chưa đủ mạnh:
            </div>
            <ul className="list-disc list-inside text-xs text-red-600 pl-1 space-y-1">
              {passwordErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <Button 
            type="submit" 
            className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 mt-2" 
            disabled={loading}
        >
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;