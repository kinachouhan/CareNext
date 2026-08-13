import { Search, Eye, Plus, Inbox } from "lucide-react";
import { Link } from "react-router"; 
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdminOrdersThunk, updateOrderStatusThunk, updatePaymentStatusThunk } from "../../slice/order/orderThunk";
import Pagination from "../components/Pagination"; 

const AllOrders = () => {
  const dispatch = useDispatch();
  const ordersState = useSelector((state) => state.orders?.orders);
  const orders = Array.isArray(ordersState) ? ordersState : [];
  const loading = useSelector((state) => state.orders?.loading) || false;
  const totalPages = useSelector((state) => state.orders?.totalPages) || 1;
  const totalOrders = useSelector((state) => state.orders?.totalOrders) || 0;

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");

  useEffect(() => {
    dispatch(getAllAdminOrdersThunk(currentPage));
  }, [dispatch, currentPage]);

  const handleOrderStatusChange = (id, newStatus) => {
    dispatch(updateOrderStatusThunk({ id, orderStatus: newStatus }));
  };

  const handlePaymentStatusChange = (id, newStatus) => {
    dispatch(updatePaymentStatusThunk({ id, paymentStatus: newStatus }));
  };

  const filteredOrders = orders.filter((order) => {
    const orderId = order._id || "";
    const customerName = order.user?.name || order.shippingAddress?.fullName || "";

    const matchesSearch =
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase());

    const matchesPayment = paymentFilter === "" || order.paymentStatus === paymentFilter;
    const matchesDelivery = deliveryFilter === "" || order.orderStatus === deliveryFilter;

    return matchesSearch && matchesPayment && matchesDelivery;
  });

  const badgeColor = (status) => {
    switch (status) {
      case "Completed":
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Pending":
      case "Verification Required":
      case "Packed":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const limit = 10;
  const indexOfFirstProduct = (currentPage - 1) * limit;
  const indexOfLastProduct = currentPage * limit;

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-3 sm:p-4 md:p-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Manage customer orders and update tracking states</p>
        </div>

        <Link
          to="/admin/add-product"
          className="w-full sm:w-auto bg-[#06A1B7] text-white px-5 py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#058a9d] transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm mb-4 md:mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="relative col-span-2 lg:col-span-1">
            <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID or Customer..."
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 md:py-3 focus:ring-2 focus:ring-[#06A1B7] outline-none text-sm md:text-base"
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="col-span-1 border border-gray-200 bg-gray-50 rounded-xl p-3 md:py-3 focus:ring-2 focus:ring-[#06A1B7] outline-none cursor-pointer text-sm md:text-base"
          >
            <option value="">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="col-span-1 border border-gray-200 bg-gray-50 rounded-xl p-3 md:py-3 focus:ring-2 focus:ring-[#06A1B7] outline-none cursor-pointer text-sm md:text-base"
          >
            <option value="">All Deliveries</option>
            <option value="Pending">Pending</option>
            <option value="Verification Required">Verification Required</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
            <tr>
              <th className="text-left p-4 md:px-6 font-medium">Order ID</th>
              <th className="text-left p-4 md:px-6 font-medium">Customer</th>
              <th className="text-left p-4 md:px-6 font-medium">Date</th>
              <th className="text-left p-4 md:px-6 font-medium">Total</th>
              <th className="text-center p-4 md:px-6 font-medium">Payment Status</th>
              <th className="text-center p-4 md:px-6 font-medium">Order Status</th>
              <th className="text-center p-4 md:px-6 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 md:px-6 font-mono font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="p-4 md:px-6 text-gray-700">{order.user?.name || order.shippingAddress?.fullName || "N/A"}</td>
                <td className="p-4 md:px-6 text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="p-4 md:px-6 font-semibold text-gray-900">₹{order.totalAmount}</td>
                <td className="p-4 md:px-6 text-center">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                    className={`border border-gray-200 rounded-lg p-1.5 text-xs font-bold outline-none cursor-pointer ${badgeColor(order.paymentStatus)}`}
                  >
                    <option value="Pending" className="bg-white text-gray-700">Pending</option>
                    <option value="Completed" className="bg-white text-gray-700">Completed</option>
                    <option value="Failed" className="bg-white text-gray-700">Failed</option>
                  </select>
                </td>
                <td className="p-4 md:px-6 text-center">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                    className={`border border-gray-200 rounded-lg p-1.5 text-xs font-bold outline-none cursor-pointer ${badgeColor(order.orderStatus)}`}
                  >
                    <option value="Pending" className="bg-white text-gray-700">Pending</option>
                    <option value="Verification Required" className="bg-white text-gray-700">Verification Required</option>
                    <option value="Shipped" className="bg-white text-gray-700">Shipped</option>
                    <option value="Delivered" className="bg-white text-gray-700">Delivered</option>
                    <option value="Cancelled" className="bg-white text-gray-700">Cancelled</option>
                  </select>
                </td>
                <td className="p-4 md:px-6 text-center">
                  <div className="flex justify-center gap-3">
                    <Link to={`/admin/orders/${order._id}`} className="p-2 text-gray-400 hover:text-[#06A1B7] hover:bg-cyan-50 rounded-lg transition-colors">
                      <Eye size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component Integration */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          totalProducts={totalOrders}
        />
      )}
    </div>
  );
};

export default AllOrders;