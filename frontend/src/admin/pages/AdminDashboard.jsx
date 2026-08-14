import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  Plus,
  Eye
} from "lucide-react";
import DashboardHeader from "../components/dashboard/WelcomeBanner";
import AnalyticsCard from "../components/dashboard/StatsCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useCallback } from "react";
import { getProductsThunk } from "../../slice/product/productThunk";
import { getAllAdminOrdersThunk } from "../../slice/order/orderThunk";
import { Link, useNavigate } from "react-router";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const products = useSelector((state) => state.product?.products || []);
  const orders = useSelector((state) => state.orders?.orders || []);

  useEffect(() => {
    dispatch(getProductsThunk());
    dispatch(getAllAdminOrdersThunk(1));
  }, [dispatch]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, order) => {
      if (order.paymentStatus === "Completed" || order.orderStatus === "Delivered") {
        return acc + (Number(order.totalAmount) || 0);
      }
      return acc;
    }, 0);
  }, [orders]);

  const formattedRevenue = useMemo(() => {
    if (totalRevenue >= 100000) {
      return `₹${(totalRevenue / 100000).toFixed(2)}L`;
    }
    return `₹${totalRevenue.toLocaleString("en-IN")}`;
  }, [totalRevenue]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="p-3 sm:p-4 md:p-6 pb-20 space-y-6 md:space-y-8">
      <DashboardHeader />
      
      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div onClick={() => handleNavigate("/admin/orders")} className="cursor-pointer">
          <AnalyticsCard
            title="Total Products"
            value={products.length}
            change="+12%"
            icon={Package}
            color="#06A1B7"
          />
        </div>

        <div onClick={() => handleNavigate("/admin/orders")} className="cursor-pointer">
          <AnalyticsCard
            title="Total Orders"
            value={orders.length}
            change="+8%"
            icon={ShoppingCart}
            color="#2563EB"
          />
        </div>

        <AnalyticsCard
          title="Customers"
          value="245"
          change="+15%"
          icon={Users}
          color="#22C55E"
        />

        <AnalyticsCard
          title="Revenue"
          value={formattedRevenue}
          change="+18%"
          icon={IndianRupee}
          color="#F59E0B"
        />
      </div>

      {/* Space for future components */}
      {/* <RevenueChart /> */}
      {/* <RecentOrders /> */}
      {/* <LatestProducts /> */}

    </div>
  );
};

export default AdminDashboard;