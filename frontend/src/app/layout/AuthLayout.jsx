import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-[32px] p-8 sm:p-12">
    
        <div className="flex justify-center mb-6">
          <img src="/Logo.png" alt="CareNXT Logo" className="w-28 object-contain" />
        </div>
        <Outlet />

      </div>
    </div>
  );
};

export default AuthLayout;