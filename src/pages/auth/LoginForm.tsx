import React, { useState } from "react";
import type { LoginRequestDto } from "@/types/auth";
import { authApi } from "./api";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginForm = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState<LoginRequestDto>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authApi.login(loginData);
      setAuth(res);
      navigate("/");
      toast.success("Đăng nhập thành công!");
    } catch (err) {
      toast.error("Đã xảy ra lỗi trong quá trình đăng nhập.");
      console.error("Lỗi đăng nhập:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {!showRegister ? (
          <>
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
              Đăng nhập
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                  placeholder="Nhập email của bạn"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <Button
                type="submit"
                className="w-full  text-white "
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-red-600 hover:underline"
              >
                Tạo tài khoản
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="text-red-600 hover:underline"
              >
                Quay lại đăng nhập
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;