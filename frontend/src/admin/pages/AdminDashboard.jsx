import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";
import DashboardHeader from "../components/dashboard/WelcomeBanner";
import AnalyticsCard from "../components/dashboard/StatsCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProductsThunk } from "../../slice/product/productThunk";
import { Link } from "react-router";

const AdminDashboard = () => {
  const {products} = useSelector(state => state.product)
  const dispatch = useDispatch()

  useEffect( ()=>{
      dispatch(getProductsThunk())
  }, [dispatch])

  
  return (
    <div className="p-3 sm:p-4 md:p-6 pb-20 space-y-6 md:space-y-8">
      <DashboardHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         
         <Link to={"/admin/products"}>
            <AnalyticsCard
        
          title="Total Products"
          value={products.length}
          change="+12%"
          icon={Package}
          color="#06A1B7"
        />
         </Link>

        <Link to={"/admin/orders"}>
           <AnalyticsCard
          title="Total Orders"
          value="54"
          change="+8%"
          icon={ShoppingCart}
          color="#2563EB"
        />
        </Link>

        <AnalyticsCard
          title="Customers"
          value="245"
          change="+15%"
          icon={Users}
          color="#22C55E"
        />

        <AnalyticsCard
          title="Revenue"
          value="₹2.45L"
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