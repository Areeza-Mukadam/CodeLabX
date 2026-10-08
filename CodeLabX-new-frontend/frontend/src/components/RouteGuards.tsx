import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/authStore";

export function AuthGuard() {
  const { user, token } = useAuth();
  return token && user ? <Outlet /> : <Navigate to="/login" replace />;
}
export function RolePage({
  role,
  children,
}: {
  role: string;
  children: ReactNode;
}) {
  const user = useAuth((s) => s.user);
  return user?.role === role ? <>{children}</> : <Navigate to="/" replace />;
}
