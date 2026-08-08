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
    const masterAdminEmail = "darpan@gmail.com";
    
    // Check if the user is logged in via Redux OR if there's a fallback email check
    const userEmail = user?.email?.toLowerCase().trim() || "";

    // If the logged-in user's email does NOT match the master admin email, kick them out
    if (userEmail !== masterAdminEmail.toLowerCase().trim()) {
      return <Navigate to="/auth/login" replace />;
    }

    // If it matches, let them through to the admin layout!
    return <Outlet />;
  }

  // Regular user protection check
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;