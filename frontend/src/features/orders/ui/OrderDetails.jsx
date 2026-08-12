import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Printer, 
  AlertCircle 
} from "lucide-react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/orders/${id}`, { withCredentials: true });
        setOrder(res.data.order);
      } catch (error) {
        toast.error("Failed to load order details");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  // Status tracker helper
  const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];
  const currentStatusIndex = steps.indexOf(order.orderStatus || "Pending");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 mt-16 md:mt-20">
      
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#06A1B7] transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Orders</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          <Printer size={15} />
          <span>Print Receipt</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Header Summary Banner */}
        <div className="bg-gradient-to-r from-cyan-50/50 to-blue-50/50 p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#06A1B7] uppercase tracking-wider">Order Details</span>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-0.5">
              #{order._id.toUpperCase()}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
              <p className="text-xs font-extrabold text-gray-800">{order.orderStatus || "Processing"}</p>
            </div>
          </div>
        </div>

        {/* Visual Progress Timeline (Flipkart/Swiggy style tracker) */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-6">Order Progress Tracker</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStatusIndex;
              return (
                <div key={step} className="flex flex-col items-center text-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                    isCompleted ? "bg-[#06A1B7] text-white shadow-md shadow-cyan-500/20" : "bg-gray-100 text-gray-400"
                  }`}>
                    {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <span className={`text-xs font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Items in this Order</h3>
          <div className="divide-y divide-gray-50">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-contain rounded-2xl bg-gray-50 p-2 border border-gray-100 shrink-0" 
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Quantity: <span className="font-bold text-gray-700">{item.quantity}</span></p>
                    <p className="text-xs text-gray-500">Price per unit: ₹{item.price}</p>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900 text-base">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 bg-gray-50/50">
          
          {/* Shipping Address */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#06A1B7] uppercase tracking-wider mb-2">
              <MapPin size={15} />
              <span>Shipping Address</span>
            </div>
            <h4 className="font-bold text-gray-900 text-sm">{order.shippingAddress?.fullName}</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-bold">{order.shippingAddress?.pincode}</span>
            </p>
            <p className="text-xs font-medium text-gray-500 mt-2">Phone: {order.shippingAddress?.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#06A1B7] uppercase tracking-wider mb-2">
                <ShieldCheck size={15} />
                <span>Payment Information</span>
              </div>
              <p className="text-xs text-gray-600">Method: <strong className="text-gray-900">{order.paymentMethod}</strong></p>
              <p className="text-xs text-gray-600 mt-1">Status: <strong className="text-emerald-600">{order.paymentStatus || "Completed"}</strong></p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Total Paid</span>
              <span className="text-xl font-black text-[#06A1B7]">₹{order.totalAmount}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;