import { Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";

const DashboardHeader = () => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

      <div>
        <p className="text-[#06A1B7] font-semibold tracking-wide uppercase text-sm">
          Dashboard
        </p>

        <h1 className="text-4xl font-bold text-gray-900 mt-2">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-2 text-lg">
          Manage your products, orders and customers from one place.
        </p>

        <p className="text-sm text-gray-400 mt-3">
          {today}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">

        <button
          onClick={() => navigate("/admin/add-product")}
          className="flex items-center gap-2 bg-[#06A1B7] text-white px-6 py-3 rounded-xl hover:bg-[#05879a] transition"
        >
          <Plus size={18} />
          Add Product
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <ShoppingBag size={18} />
          View Orders
        </button>

      </div>

    </div>
  );
};

export default DashboardHeader;