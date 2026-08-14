import { useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
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
import { logoutThunk } from "../../slice/auth/authThunk";

const AdminSidebar = ({ openSidebar, setOpenSidebar }) => {
  const [productOpen, setProductOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(logoutThunk());
    navigate("/auth/login", { replace: true });
  }, [dispatch, navigate]);

  const handleCloseSidebar = useCallback(() => {
    if (setOpenSidebar) setOpenSidebar(false);
  }, [setOpenSidebar]);

  return (
    <>
      <aside
        className={`fixed lg:sticky top-0 lg:top-24 left-0 z-50
        w-72 h-screen lg:h-[calc(100vh-110px)]
        bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        transition-transform duration-300 ease-in-out
        ${
          openSidebar
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center justify-center border-b border-gray-100 px-6">
          <img
            src="/Logo.png"
            alt="Logo"
            className="w-32 object-contain cursor-pointer"
            onClick={() => { navigate("/admin"); handleCloseSidebar(); }}
          />
        </div>

        <div className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-80px)] lg:h-[calc(100vh-190px)]">
          <NavLink
            to="/admin"
            end
            onClick={handleCloseSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                isActive
                  ? "bg-[#06A1B7] text-white shadow-sm shadow-cyan-500/20"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          {/* Products Dropdown */}
          <div>
            <button
              onClick={() => setProductOpen(!productOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <div className="flex items-center gap-3">
                <Package size={18} />
                <span>Products</span>
              </div>
              {productOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
            </button>

            {productOpen && (
              <div className="ml-4 pl-4 border-l-2 border-cyan-100 space-y-1.5 mt-1.5">
                <NavLink
                  to="/admin/add-product"
                  onClick={handleCloseSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                      isActive
                        ? "bg-[#06A1B7] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <PlusSquare size={16} />
                  <span>Add Product</span>
                </NavLink>

                <NavLink
                  to="/admin/products"
                  onClick={handleCloseSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                      isActive
                        ? "bg-[#06A1B7] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <Boxes size={16} />
                  <span>All Products</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Orders Dropdown */}
          <div>
            <button
              onClick={() => setOrderOpen(!orderOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} />
                <span>Orders</span>
              </div>
              {orderOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
            </button>

            {orderOpen && (
              <div className="ml-4 pl-4 border-l-2 border-cyan-100 space-y-1.5 mt-1.5">
                <NavLink
                  to="/admin/orders"
                  onClick={handleCloseSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                      isActive
                        ? "bg-[#06A1B7] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <ClipboardList size={16} />
                  <span>All Orders</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Logout Action */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;