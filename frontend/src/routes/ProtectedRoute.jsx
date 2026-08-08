import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {

  const { user, isLoading } = useSelector((state) => state.auth);

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;