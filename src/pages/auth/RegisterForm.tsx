import React, { useState } from "react";
import type { AuthResponseDto, RegisterRequestDto } from "@/types/auth";
import { authApi } from "./api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const passwordRequirements = [
  "Ít nhất một ký tự không phải chữ và số.",
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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg ">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Đăng ký
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Ngày sinh</Label>
          <Input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Họ và tên</Label>
          <Input
            type="text"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Mật khẩu</Label>
          <Input
            type="password"
            placeholder="********"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Xác nhận mật khẩu</Label>
          <Input
            type="password"
            placeholder="********"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
          />
        </div>

        {passwordErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 space-y-1">
            <p className="flex items-center text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 mr-2" />
              Mật khẩu chưa đạt yêu cầu:
            </p>
            <ul className="list-disc list-inside text-sm text-red-500">
              {passwordErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
