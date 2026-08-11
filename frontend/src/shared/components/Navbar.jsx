import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { ShoppingCart, User, Heart, Menu, X, LogIn, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openCart } from "../../slice/cart/cartSlice";
import { logout } from "../../slice/auth/authSlice";
import api from "../../api/axios";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist"; // Ensure this path is correct

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Wishlist Hook
  const { items: wishlistItems } = useWishlist();

  // Cart State
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalItems = cartItems.reduce((total, item) => total + (Number(item?.quantity) || 0), 0);

  // Auth State
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleCartClick = () => dispatch(openCart());

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logout());
      navigate("/auth/login");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4">
      <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-full px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 mt-4">
        {/* Logo */}
        <div className="cursor-pointer shrink-0" onClick={() => navigate("/")}>
          <img src="/Logo.png" alt="Logo" className="w-28 h-9 object-contain" />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-full border border-gray-100">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#06A1B7] text-white shadow-sm shadow-cyan-500/20"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Wishlist Button */}
          <button 
            onClick={() => navigate("/wishlist")} 
            className="relative p-2.5 rounded-full text-gray-600 hover:text-[#06A1B7] hover:bg-cyan-50 transition-colors"
          >
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#06A1B7] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {wishlistItems.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={handleCartClick}
            className="relative p-2.5 rounded-full text-gray-600 hover:text-[#06A1B7] hover:bg-cyan-50 transition-colors"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#06A1B7] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#06A1B7]/10 text-[#06A1B7] flex items-center justify-center font-bold text-sm">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 truncate max-w-[80px]">
                    {user?.fullName || "Account"}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth/login")}
                className="flex items-center gap-2 bg-[#06A1B7] hover:bg-[#058a9d] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {openMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {openMenu && (
        <div className="absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl p-6 md:hidden border border-gray-100 z-50">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpenMenu(false)}
                className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl"
              >
                {link.name}
              </NavLink>
            ))}
            {user ? (
              <button onClick={() => { handleLogout(); setOpenMenu(false); }} className="px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl text-left">
                Logout
              </button>
            ) : (
              <button onClick={() => { navigate("/auth/login"); setOpenMenu(false); }} className="px-4 py-3 bg-[#06A1B7] text-white font-medium rounded-xl">
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;