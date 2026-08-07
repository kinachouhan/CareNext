import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Moon, Sun, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openCart } from "../../slice/cart/cartSlice";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const dispatch = useDispatch()

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const { totalItems } = useSelector((state) => state.cart);

  const handleClick = () => {
    dispatch(openCart());
  };

  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <nav className=" max-w-7xl mx-auto bg-white rounded-full px-6 lg:px-8 py-4 flex items-center justify-between shadow-lg relative mt-5">
        <div>
          <img
            onClick={() => navigate("/")}
            src="/Logo.png"
            alt="Logo"
            className="w-32 h-10 object-contain"
          />
        </div>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-5 py-2 rounded-full font-medium transition ${
                  isActive
                    ? "bg-[#06A1B7] text-white"
                    : "text-black hover:bg-[#06A1B7] hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-gray-300 transition">
            <Heart size={22} className="hover:text-[#06A1B7]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#06A1B7] text-white text-[10px] rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          <button className="relative p-2 rounded-full hover:bg-gray-300 transition">
            <ShoppingCart
              onClick={() => handleClick()}
              size={22}
              className="hover:text-[#06A1B7]"
            />
            {totalItems > 0 && (
              <span
                className="
      absolute
      -top-2
      -right-2
      w-5
      h-5
      rounded-full
      bg-red-500
      text-white
      text-xs
      flex
      items-center
      justify-center
    "
              >
                {totalItems}
              </span>
            )}
          </button>

          <button className="hidden md:block p-2 rounded-full hover:bg-gray-300 transition">
            <User size={22} className="hover:text-[#06A1B7]" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`hidden md:flex w-16 h-9 rounded-full items-center px-1 transition ${
              darkMode ? "bg-[#06A1B7]" : "bg-gray-700"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full bg-white flex items-center justify-center transition ${
                darkMode ? "translate-x-7" : ""
              }`}
            >
              {darkMode ? (
                <Sun size={16} className="text-yellow-500" />
              ) : (
                <Moon size={16} />
              )}
            </div>
          </button>

          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden p-2 rounded-full hover:bg-gray-300"
          >
            {openMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {openMenu && (
          <div className="absolute top-20 left-0 w-full bg-white rounded-3xl shadow-xl p-4 md:hidden z-50">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpenMenu(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl ${
                      isActive
                        ? "bg-[#06A1B7] text-white"
                        : "hover:bg-[#06A1B7] hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <hr className="my-2" />

              <div className="flex justify-between">
                <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl">
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex gap-3 items-center px-4 py-3 hover:bg-gray-100 rounded-xl"
                >
                  <span>Theme</span>

                  <div
                    className={`w-14 h-8 rounded-full flex items-center px-1 ${
                      darkMode ? "bg-[#06A1B7]" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white flex items-center justify-center transition ${
                        darkMode ? "translate-x-6" : ""
                      }`}
                    >
                      {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
