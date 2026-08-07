import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../shared/components/Navbar";
import { Footer } from "../../shared/components/Footer";
import WhatsAppButton from "../../shared/components/WhatsappButton";
import CartDrawer from "../../features/cart/components/CartDrawer";

const UserLayout = () => {
  return (
    <div className="p-1 bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-28">
        <Outlet />
      </div>
      <CartDrawer/>
      <WhatsAppButton/>
      <Footer/>
    </div>
  );
};

export default UserLayout;
