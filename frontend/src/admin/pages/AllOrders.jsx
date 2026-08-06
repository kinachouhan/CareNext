import { Search, Eye, Pencil, Plus, Inbox } from "lucide-react";
import { Link } from "react-router"; 
import { useState } from "react";
import { orders } from "../../lib/order";

const AllOrders = () => {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());

    const matchesPayment =
      paymentFilter === "" || order.payment === paymentFilter;

    const matchesDelivery =
      deliveryFilter === "" || order.delivery === deliveryFilter;

    return matchesSearch && matchesPayment && matchesDelivery;
  });

  const badgeColor = (status) => {
    switch (status) {
      case "Completed":
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Pending":
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

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-3 sm:p-4 md:p-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage customer orders
          </p>
        </div>

        <Link
          to="/admin/add-product"
          className="w-full sm:w-auto bg-[#06A1B7] text-white px-5 py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#058a9d] transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filters (Optimized for Mobile Grid) */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm mb-4 md:mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          
          {/* Search spans full width on mobile, 1 column on desktop */}
          <div className="relative col-span-2 lg:col-span-1">
            <Search
              size={18}
              className="absolute left-3.5 top-3.5 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID or Customer..."
              className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 md:py-3 focus:ring-2 focus:ring-[#06A1B7] outline-none transition-all text-sm md:text-base"
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="col-span-1 border border-gray-200 bg-gray-50 rounded-xl p-3 md:py-3 focus:ring-2 focus:ring-[#06A1B7] outline-none cursor-pointer text-sm md:text-base"
          >
            <option value="">All Payments</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>

          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="col-span-1 border border-gray-200 bg-gray-50 rounded-xl p-3 md:py-3 focus:ring-2 focus:ring-[#06A1B7] outline-none cursor-pointer text-sm md:text-base"
          >
            <option value="">All Deliveries</option>
            <option>Delivered</option>
            <option>Packed</option>
            <option>Shipped</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Empty State Fallback */}
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
              <th className="text-center p-4 md:px-6 font-medium">Payment</th>
              <th className="text-center p-4 md:px-6 font-medium">Delivery</th>
              <th className="text-center p-4 md:px-6 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 md:px-6 font-semibold text-gray-900">
                  {order.id}
                </td>
                <td className="p-4 md:px-6 text-gray-700">{order.customer}</td>
                <td className="p-4 md:px-6 text-gray-500 text-sm">{order.date}</td>
                <td className="p-4 md:px-6 font-semibold text-gray-900">₹{order.total}</td>
                <td className="p-4 md:px-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor(order.payment)}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="p-4 md:px-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor(order.delivery)}`}>
                    {order.delivery}
                  </span>
                </td>
                <td className="p-4 md:px-6">
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="p-2 text-gray-400 hover:text-[#06A1B7] hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Pencil size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Structured for clarity) */}
      <div className="lg:hidden flex flex-col gap-3 sm:gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-50">
              <div>
                <span className="text-xs text-gray-400 font-medium block mb-0.5">{order.date}</span>
                <h3 className="font-bold text-gray-900 text-base">{order.id}</h3>
              </div>
              <h3 className="font-bold text-[#06A1B7] text-lg">₹{order.total}</h3>
            </div>

            {/* Card Body */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-0.5">Customer</p>
              <p className="font-medium text-gray-800">{order.customer}</p>
            </div>

            {/* Card Footer: Badges & Actions */}
            <div className="flex items-center justify-between mt-2 pt-2">
              <div className="flex gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${badgeColor(order.payment)}`}>
                  {order.payment}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${badgeColor(order.delivery)}`}>
                  {order.delivery}
                </span>
              </div>
              
              <Link
                to={`/admin/orders/${order.id}`}
                className="flex items-center justify-center p-2.5 bg-gray-50 text-gray-600 hover:text-[#06A1B7] hover:bg-cyan-50 rounded-xl transition-colors border border-gray-100"
              >
                <Eye size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AllOrders;