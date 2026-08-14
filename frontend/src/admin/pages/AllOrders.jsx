import { Search, Eye, Plus, Inbox, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router"; 
import { useState, useEffect, useMemo, useCallback, useRef, memo, useDeferredValue } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdminOrdersThunk, updateOrderStatusThunk, updatePaymentStatusThunk } from "../../slice/order/orderThunk";
import Pagination from "../components/Pagination"; 
import toast from "react-hot-toast";

const VALID_DELIVERY_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled"];
const VALID_PAYMENT_STATUSES = ["Pending", "Completed", "Failed", "Refunded"];

const getBadgeColor = (status) => {
  switch (status) {
    case "Completed":
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Pending":
    case "Confirmed":
    case "Packed":
      return "bg-yellow-100 text-yellow-700";
    case "Shipped":
    case "Out For Delivery":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
    case "Failed":
    case "Refunded":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MobileOrderCard = memo(({ order, onPaymentChange, onDeliveryChange }) => {
  const badgeClass = getBadgeColor(order.paymentStatus);
  const deliveryBadgeClass = getBadgeColor(order.orderStatus);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <span className="font-mono font-bold text-gray-900 text-sm">#{order._id?.slice(-8).toUpperCase()}</span>
        <span className="font-bold text-gray-900 text-sm">₹{order.totalAmount}</span>
      </div>

      <div className="flex flex-col gap-1 text-xs text-gray-600">
        <p><strong className="text-gray-900">Customer:</strong> {order.user?.fullName || order.shippingAddress?.fullName || "N/A"}</p>
        <p><strong className="text-gray-900">Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 items-center">
        <select
          value={order.paymentStatus}
          onChange={(e) => onPaymentChange(order._id, e.target.value)}
          className={`w-full border border-gray-200 rounded-lg p-2 text-xs font-bold outline-none cursor-pointer truncate ${badgeClass}`}
        >
          {VALID_PAYMENT_STATUSES.map(status => (
            <option key={status} value={status} className="bg-white text-gray-700">{status}</option>
          ))}
        </select>

        <select
          value={order.orderStatus}
          onChange={(e) => onDeliveryChange(order._id, e.target.value)}
          className={`w-full border border-gray-200 rounded-lg p-2 text-xs font-bold outline-none cursor-pointer truncate ${deliveryBadgeClass}`}
        >
          {VALID_DELIVERY_STATUSES.map(status => (
            <option key={status} value={status} className="bg-white text-gray-700">{status}</option>
          ))}
        </select>
      </div>

      <div className="pt-2 border-t border-gray-50 flex justify-end">
        <Link to={`/admin/orders/${order._id}`} className="flex items-center gap-1.5 text-xs font-bold text-[#06A1B7] hover:underline bg-cyan-50 px-3 py-1.5 rounded-xl">
          <Eye size={15} />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
});

MobileOrderCard.displayName = "MobileOrderCard";

const DesktopOrderRow = memo(({ order, onPaymentChange, onDeliveryChange }) => {
  const paymentBadge = getBadgeColor(order.paymentStatus);
  const deliveryBadge = getBadgeColor(order.orderStatus);

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="p-4 md:px-6 font-mono font-semibold text-gray-900">#{order._id?.slice(-8).toUpperCase()}</td>
      <td className="p-4 md:px-6 text-gray-700">{order.user?.fullName || order.shippingAddress?.fullName || "N/A"}</td>
      <td className="p-4 md:px-6 text-gray-500">
        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
      </td>
      <td className="p-4 md:px-6 font-semibold text-gray-900">₹{order.totalAmount}</td>
      <td className="p-4 md:px-6 text-center">
        <select
          value={order.paymentStatus}
          onChange={(e) => onPaymentChange(order._id, e.target.value)}
          className={`border border-gray-200 rounded-lg p-1.5 text-xs font-bold outline-none cursor-pointer ${paymentBadge}`}
        >
          {VALID_PAYMENT_STATUSES.map(status => (
            <option key={status} value={status} className="bg-white text-gray-700">{status}</option>
          ))}
        </select>
      </td>
      <td className="p-4 md:px-6 text-center">
        <select
          value={order.orderStatus}
          onChange={(e) => onDeliveryChange(order._id, e.target.value)}
          className={`border border-gray-200 rounded-lg p-1.5 text-xs font-bold outline-none cursor-pointer ${deliveryBadge}`}
        >
          {VALID_DELIVERY_STATUSES.map(status => (
            <option key={status} value={status} className="bg-white text-gray-700">{status}</option>
          ))}
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
  );
});

DesktopOrderRow.displayName = "DesktopOrderRow";

const AllOrders = () => {
  const dispatch = useDispatch();
  const ordersState = useSelector((state) => state.orders?.orders);
  const orders = Array.isArray(ordersState) ? ordersState : [];
  const loading = useSelector((state) => state.orders?.loading) || false;
  const totalPages = useSelector((state) => state.orders?.totalPages) || 1;
  const totalOrders = useSelector((state) => state.orders?.totalOrders) || 0;

  const [filterState, setFilterState] = useState({ page: 1, search: "", payment: "", delivery: "" });
  const deferredSearch = useDeferredValue(filterState.search);
  const prevPageRef = useRef(filterState.page);

  useEffect(() => {
    if (prevPageRef.current !== filterState.page) {
      dispatch(getAllAdminOrdersThunk(filterState.page));
      prevPageRef.current = filterState.page;
    }
  }, [dispatch, filterState.page]);

  useEffect(() => {
    dispatch(getAllAdminOrdersThunk(1));
  }, [dispatch]);

  const handleOrderStatusChange = useCallback(async (id, newStatus) => {
    try {
      await dispatch(updateOrderStatusThunk({ id, orderStatus: newStatus })).unwrap();
      toast.success("Order status updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to update order status");
    }
  }, [dispatch]);

  const handlePaymentStatusChange = useCallback(async (id, newStatus) => {
    try {
      await dispatch(updatePaymentStatusThunk({ id, paymentStatus: newStatus })).unwrap();
      toast.success("Payment status updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to update payment status");
    }
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const { payment, delivery } = filterState;
    const query = deferredSearch.trim().toLowerCase();
    if (!query && !payment && !delivery) return orders;

    return orders.filter((order) => {
      const orderId = order._id || "";
      const customerName = order.user?.fullName || order.shippingAddress?.fullName || "";

      const matchesSearch =
        orderId.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query);

      const matchesPayment = payment === "" || order.paymentStatus === payment;
      const matchesDelivery = delivery === "" || order.orderStatus === delivery;

      return matchesSearch && matchesPayment && matchesDelivery;
    });
  }, [orders, deferredSearch, filterState.payment, filterState.delivery]);

  const handleExportExcel = useCallback(() => {
    if (filteredOrders.length === 0) {
      toast.error("No orders available to export.");
      return;
    }

    const headers = ["Order ID", "Customer Name", "Phone", "Date", "Total Amount (INR)", "Payment Method", "Payment Status", "Order Status"];
    const rows = filteredOrders.map(order => [
      order._id,
      order.shippingAddress?.fullName || order.user?.fullName || "N/A",
      order.shippingAddress?.phone || "N/A",
      order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A",
      order.totalAmount,
      order.paymentMethod,
      order.paymentStatus,
      order.orderStatus
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Orders-Report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Orders exported successfully!");
  }, [filteredOrders]);

  const limit = 10;
  const indexOfFirstProduct = (filterState.page - 1) * limit;
  const indexOfLastProduct = filterState.page * limit;

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-3 sm:p-4 md:p-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Manage customer orders and update tracking states</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm font-medium text-xs md:text-sm active:scale-95"
          >
            <FileSpreadsheet size={18} />
            <span>Export Excel</span>
          </button>

          <Link
            to="/admin/add-product"
            className="flex-1 sm:flex-none bg-[#06A1B7] text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#058a9d] transition-colors shadow-sm font-medium text-xs md:text-sm active:scale-95"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm mb-4 md:mb-6 border border-gray-100">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 md:gap-4">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              value={filterState.search}
              onChange={(e) => setFilterState(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search ID or Customer..."
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#06A1B7] outline-none text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 lg:contents gap-2 sm:gap-3">
            <select
              value={filterState.payment}
              onChange={(e) => setFilterState(prev => ({ ...prev, payment: e.target.value }))}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-[#06A1B7] outline-none cursor-pointer text-xs sm:text-sm truncate"
            >
              <option value="">All Payments</option>
              {VALID_PAYMENT_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterState.delivery}
              onChange={(e) => setFilterState(prev => ({ ...prev, delivery: e.target.value }))}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-[#06A1B7] outline-none cursor-pointer text-xs sm:text-sm truncate"
            >
              <option value="">All Deliveries</option>
              {VALID_DELIVERY_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 flex items-center justify-center text-center border border-gray-100 my-4">
          <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
          <p className="text-gray-500 mt-1">There are no orders available in the database.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No matching orders</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search query or filter options.</p>
        </div>
      ) : (
        <>
          <div className="lg:hidden space-y-4">
            {filteredOrders.map((order) => (
              <MobileOrderCard
                key={order._id}
                order={order}
                onPaymentChange={handlePaymentStatusChange}
                onDeliveryChange={handleOrderStatusChange}
              />
            ))}
          </div>

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
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredOrders.map((order) => (
                  <DesktopOrderRow
                    key={order._id}
                    order={order}
                    onPaymentChange={handlePaymentStatusChange}
                    onDeliveryChange={handleOrderStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={filterState.page}
          totalPages={totalPages}
          onPageChange={(newPage) => setFilterState(prev => ({ ...prev, page: newPage }))}
          indexOfFirstProduct={indexOfFirstProduct}
          indexOfLastProduct={indexOfLastProduct}
          totalProducts={totalOrders}
        />
      )}
    </div>
  );
};

export default AllOrders;