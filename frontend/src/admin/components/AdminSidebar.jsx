import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusSquare,
  Boxes,
  ClipboardList,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const AdminSidebar = ({ openSidebar, setOpenSidebar }) => {
  const [productOpen, setProductOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <aside
        className={`fixed lg:sticky top-0 lg:top-24 left-0 z-50
        w-72 h-screen lg:h-[calc(100vh-110px)]
        bg-white shadow-xl 
        transition-transform duration-300
        ${
          openSidebar
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center justify-center border-b">
          <img
            src="/Logo.png"
            alt="Logo"
            className="w-36 object-contain"
          />
        </div>

        <div className="p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/admin"
            end
            onClick={() => setOpenSidebar(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition
              ${
                isActive
                  ? "bg-[#06A1B7] text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

  
          <button
            onClick={() => setProductOpen(!productOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Package size={20} />
              Products
            </div>

            {productOpen ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {productOpen && (
            <div className="ml-6 border-l pl-4 space-y-2">

              <NavLink
                to="/admin/add-product"
                onClick={() => setOpenSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-[#06A1B7] text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <PlusSquare size={18} />
                Add Product
              </NavLink>

              <NavLink
                to="/admin/products"
                onClick={() => setOpenSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-[#06A1B7] text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <Boxes size={18} />
                All Products
              </NavLink>

            </div>
          )}

          {/* Orders */}

          <button
            onClick={() => setOrderOpen(!orderOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} />
              Orders
            </div>

            {orderOpen ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {orderOpen && (
            <div className="ml-6 border-l pl-4 space-y-2">

              <NavLink
                to="/admin/orders"
                onClick={() => setOpenSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-[#06A1B7] text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <ClipboardList size={18} />
                Order Summary
              </NavLink>

            </div>
          )}

          {/* Logout */}

          <button
            className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;