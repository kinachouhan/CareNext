import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Package, Clock, CheckCircle2, AlertCircle, Truck, MapPin, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { getOrdersThunk } from "../../../slice/order/orderThunk"; 

const Orders = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders?.orders) || [];
  const loading = useSelector((state) => state.orders?.loading) || false;

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);

  const getStatusBadge = (orderStatus, paymentStatus) => {
    // Check order delivery status first
    switch (orderStatus) {
      case "Delivered":
        return (
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 size={14} /> Delivered
          </span>
        );
      case "Shipped":
      case "Packed":
      case "Confirmed":
      case "Out For Delivery":
        return (
          <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            <Truck size={14} /> {orderStatus}
          </span>
        );
      case "Verification Required":
        return (
          <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
            <AlertCircle size={14} /> Payment Verification
          </span>
        );
      case "Cancelled":
      case "Failed":
        return (
          <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
            <AlertCircle size={14} /> {orderStatus}
          </span>
        );
      default:
        // Fallback to payment status if order status is Pending/Default
        if (paymentStatus === "Completed") {
          return (
            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 size={14} /> Paid / Processing
            </span>
          );
        }
        return (
          <span className="flex items-center gap-1.5 bg-cyan-50 text-[#06A1B7] px-3 py-1 rounded-full text-xs font-bold">
            <Clock size={14} /> {orderStatus || "Order Placed / Pending"}
          </span>
        );
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <div className="w-20 h-20 bg-cyan-50 text-[#06A1B7] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Package size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Orders Found</h2>
        <p className="text-gray-500 mt-2 mb-6">You haven't placed any orders yet. Start exploring our shop!</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#06A1B7] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#058a9d] transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track, view, and manage your past purchases</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Link 
            key={order._id}
            to={`/orders/${order._id}`}
            className="block bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-cyan-100 group"
          >
            {/* Top Order Meta Bar */}
            <div className="bg-gray-50/70 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order ID</p>
                  <p className="text-xs font-mono font-bold text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date Placed</p>
                  <p className="text-xs font-semibold text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(order.orderStatus, order.paymentStatus)}
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-cyan-50 group-hover:text-[#06A1B7] transition-colors">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>

            {/* Order Items List */}
            <div className="p-6 divide-y divide-gray-50">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 object-contain rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0" 
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: <span className="font-bold text-gray-700">{item.quantity}</span></p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bottom Footer Meta (Address & Total) */}
            <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={16} className="text-[#06A1B7] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-800">{order.shippingAddress?.fullName}</span> — {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} ({order.shippingAddress?.pincode})
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-gray-200 sm:pl-6">
                <div>
                  <p className="text-gray-400 font-medium">Payment: <strong className="text-gray-700">{order.paymentMethod}</strong></p>
                  <p className="text-sm font-extrabold text-gray-900 mt-0.5">Total: <span className="text-[#06A1B7]">₹{order.totalAmount}</span></p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;