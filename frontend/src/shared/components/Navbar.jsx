import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { ShoppingCart, User, Heart, Menu, X, LogIn, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openCart } from "../../slice/cart/cartSlice";
import { logout } from "../../slice/auth/authSlice"; // Adjust path to your authSlice
import api from "../../api/axios"; // Adjust path to your api.js

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const items = useSelector((state) => state.cart?.items || []);
  const totalItems = items.reduce((total, item) => total + (Number(item?.quantity) || 0), 0);

  const { user } = useSelector((state) => state.auth);

  const handleCartClick = () => {
    dispatch(openCart());
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); 
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      
      dispatch(logout());
      navigate("/auth/login");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-full px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative mt-4">
        {/* Logo */}
        <div className="cursor-pointer shrink-0" onClick={() => navigate("/")}>
          <img
            src="/Logo.png"
            alt="Logo"
            className="w-28 h-9 object-contain"
          />
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
            aria-label="Wishlist"
          >
            <Heart size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#06A1B7] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={handleCartClick}
            className="relative p-2.5 rounded-full text-gray-600 hover:text-[#06A1B7] hover:bg-cyan-50 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Authentication Section (Desktop) */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#06A1B7]/10 text-[#06A1B7] flex items-center justify-center font-bold group-hover:bg-[#06A1B7] group-hover:text-white transition-all">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={18} />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {user?.fullName || "Profile"}
                  </span>
                </button>

                {/* Desktop Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth/login")}
                className="flex items-center gap-2 bg-[#06A1B7] hover:bg-[#058a9d] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-cyan-500/20 transition-all active:scale-95"
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
            aria-label="Toggle Menu"
          >
            {openMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {openMenu && (
          <div className="absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl p-6 md:hidden border border-gray-100 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="mb-4 pb-4 border-b border-gray-100">
              {user ? (
                <div
                  onClick={() => {
                    navigate("/profile");
                    setOpenMenu(false);
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#06A1B7] text-white flex items-center justify-center font-bold text-lg">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={20} />}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Welcome back,</p>
                    <p className="font-bold text-gray-800">{user?.fullName || "My Account"}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate("/auth/login");
                    setOpenMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#06A1B7] text-white py-3 rounded-xl font-semibold shadow-md shadow-cyan-500/20"
                >
                  <LogIn size={18} />
                  <span>Login / Register</span>
                </button>
              )}
            </div>

            {/* Links List */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpenMenu(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-[#06A1B7] text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpenMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-left w-full mt-1"
                  >
                    <User size={18} />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpenMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium text-left w-full"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;