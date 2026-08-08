import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If this is an admin route, let's check your master admin configuration
  if (adminOnly) {
    const masterAdminEmail = import.meta.env.VITE_MASTER_ADMIN_EMAIL;
  
    const userEmail = user?.email?.toLowerCase().trim() || "";

    if (userEmail !== masterAdminEmail.toLowerCase().trim()) {
      return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;