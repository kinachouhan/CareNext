import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../shared/components/Navbar";
import { Footer } from "../../shared/components/Footer";
import WhatsAppButton from "../../shared/components/WhatsappButton";

const UserLayout = () => {
  return (
    <div className="p-1 bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-28">
        <Outlet />
      </div>
      <WhatsAppButton/>
      <Footer/>
    </div>
  );
};

export default UserLayout;
