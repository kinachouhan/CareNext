import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import Loader from "../shared/components/Loader";


const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Loader />;
  }

  if (adminOnly) {
    const masterAdminEmail = import.meta.env.VITE_MASTER_ADMIN_EMAIL || "";
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