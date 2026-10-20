import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  if (status === "idle") return <div className="min-h-dvh" aria-busy />;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
