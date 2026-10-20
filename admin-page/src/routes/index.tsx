import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AccountPage from "@/pages/AccountPage";
import DashboardPage from "@/pages/DashboardPage";
import JobFormPage from "@/pages/JobFormPage";
import JobsPage from "@/pages/JobsPage";
import LoginPage from "@/pages/LoginPage";
import UserCreatePage from "@/pages/UserCreatePage";
import UserEditPage from "@/pages/UserEditPage";
import UsersPage from "@/pages/UsersPage";
import ProtectedRoute from "./ProtectedRoute";

const guard = (page: ReactNode) => <ProtectedRoute>{page}</ProtectedRoute>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={guard(<DashboardPage />)} />
      <Route path="/jobs" element={guard(<JobsPage />)} />
      <Route path="/jobs/new" element={guard(<JobFormPage />)} />
      <Route path="/jobs/:id/edit" element={guard(<JobFormPage />)} />
      <Route path="/users" element={guard(<UsersPage />)} />
      <Route path="/users/new" element={guard(<UserCreatePage />)} />
      <Route path="/users/:id/edit" element={guard(<UserEditPage />)} />
      <Route path="/account" element={guard(<AccountPage />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
