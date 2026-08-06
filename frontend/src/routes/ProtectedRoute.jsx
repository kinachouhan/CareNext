import React, { useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const [isAdminLogin] = useState(false);
  if (!isAdminLogin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;