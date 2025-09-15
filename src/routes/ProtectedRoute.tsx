import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { AuthResponseDto } from "@/types/auth";
import type { UserRole } from "@/types/user";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.auth) as AuthResponseDto;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const hasPermission = user.roles.some((role) =>
    allowedRoles.includes(role)
  );
  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return <>{children} </>;
};
//render children nếu thỏa dk

export default ProtectedRoute;
