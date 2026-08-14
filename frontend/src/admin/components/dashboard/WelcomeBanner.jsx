import { Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";
import { useMemo, useCallback } from "react";

const DashboardHeader = () => {
  const navigate = useNavigate();

  // Memoize date format calculation so it doesn't recalculate unnecessarily on re-renders
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const handleAddProduct = useCallback(() => {
    navigate("/admin/add-product");
  }, [navigate]);

  const handleViewOrders = useCallback(() => {
    navigate("/admin/orders");
  }, [navigate]);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-5 sm:p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

      <div>
        <p className="text-[#06A1B7] font-bold tracking-wider uppercase text-[11px] sm:text-xs">
          Dashboard
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mt-1">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-1.5 text-xs sm:text-sm md:text-base leading-relaxed">
          Manage your products, orders and customers from one place.
        </p>

        <p className="text-xs text-gray-400 mt-2 font-medium">
          {today}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 bg-[#06A1B7] hover:bg-[#058a9d] text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>

        <button
          onClick={handleViewOrders}
          className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95"
        >
          <ShoppingBag size={18} className="text-[#06A1B7]" />
          <span>View Orders</span>
        </button>
      </div>

    </div>
  );
};

export default DashboardHeader;