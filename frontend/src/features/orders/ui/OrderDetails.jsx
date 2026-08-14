import React, { useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { 
  CheckCircle2, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Printer, 
  Download,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { cancelOrderThunk, getOrdersThunk } from "../../../slice/order/orderThunk"; // Assuming getOrdersThunk or getOrderByIdThunk exists
import { downloadReceiptPDF } from "../components/downloadReceiptPDF";
import toast from "react-hot-toast";
import Loader from "../../../shared/components/Loader";

const BACKEND_ORDER_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.orders);

  const order = useMemo(() => {
    return orders?.find((o) => o._id === id) || null;
  }, [orders, id]);

  useEffect(() => {
    if (!order) {
      dispatch(getOrdersThunk());
    }
  }, [dispatch, order]);

  const handleCancelOrder = useCallback(async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await dispatch(cancelOrderThunk(id)).unwrap();
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(error || "Failed to cancel order");
    }
  }, [dispatch, id]);

  const currentStatusIndex = useMemo(() => {
    if (!order?.orderStatus) return 0;
    return BACKEND_ORDER_STEPS.indexOf(order.orderStatus);
  }, [order?.orderStatus]);

  const canCancel = order?.orderStatus === "Pending";
  const isPaymentCompleted = order?.paymentStatus === "Completed";

  const displayPaymentStatus = useMemo(() => {
    if (!order) return null;
    if (order.orderStatus === "Cancelled") {
      if (order.paymentMethod === "COD" || order.paymentStatus === "Pending") {
        return <span className="text-gray-500 font-semibold">Cancelled</span>;
      }
      return (
        <span className="text-amber-600 font-semibold flex items-center gap-1">
          <RefreshCw size={13} className="animate-spin" /> Refund Initiated (5-7 days)
        </span>
      );
    }
    return (
      <span className={`font-semibold ${isPaymentCompleted ? "text-emerald-600" : "text-amber-600"}`}>
        {order.paymentStatus || "Pending"}
      </span>
    );
  }, [order, isPaymentCompleted]);

  if (loading && !order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <Loader/>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
        <button onClick={() => navigate("/orders")} className="mt-4 bg-[#06A1B7] text-white px-4 py-2 rounded-xl text-xs font-bold">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-2 md:py-4">
      
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate("/orders")}
          className="flex px-2 items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#06A1B7] transition-colors w-fit"
        >
          <ArrowLeft size={18} />
          <span>Back to Orders</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {canCancel && (
            <button
              onClick={handleCancelOrder}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              <XCircle size={15} />
              <span>Cancel Order</span>
            </button>
          )}

          <button
            onClick={() => downloadReceiptPDF(order)}
            className="flex mx-2 items-center gap-1.5 bg-[#06A1B7] hover:bg-[#058a9d] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Header Summary Banner */}
        <div className="bg-gradient-to-r from-cyan-50/50 to-blue-50/50 p-5 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#06A1B7] uppercase tracking-wider">Order Details</span>
            <h1 className="text-lg md:text-2xl font-black text-gray-900 mt-0.5 break-all">
              #{order._id.toUpperCase()}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 w-fit">
            <div className={`w-3 h-3 rounded-full shrink-0 ${order.orderStatus === 'Cancelled' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
              <p className={`text-xs font-extrabold ${order.orderStatus === 'Cancelled' ? 'text-red-600' : 'text-gray-800'}`}>
                {order.orderStatus || "Processing"}
              </p>
            </div>
          </div>
        </div>

        {/* Backend-Driven Progress Timeline */}
        {order.orderStatus !== "Cancelled" ? (
          <div className="p-5 md:p-8 border-b border-gray-100 overflow-x-auto">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Order Progress Tracker</h3>
            <div className="grid grid-cols-4 min-w-[320px] gap-2">
              {BACKEND_ORDER_STEPS.map((step, idx) => {
                const isCompleted = currentStatusIndex !== -1 && idx <= currentStatusIndex;
                return (
                  <div key={step} className="flex flex-col items-center text-center relative">
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                      isCompleted ? "bg-[#06A1B7] text-white shadow-md shadow-cyan-500/20" : "bg-gray-100 text-gray-400"
                    }`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <span className={`text-[11px] md:text-xs font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-5 bg-red-50/50 border-b border-red-100 flex items-center gap-3 text-red-700">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs font-semibold">This order has been cancelled and will not be processed further.</p>
          </div>
        )}

        {/* Ordered Items List */}
        <div className="p-5 md:p-8 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Items in this Order</h3>
          <div className="divide-y divide-gray-50">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-14 h-14 object-contain rounded-xl bg-gray-50 p-1.5 border border-gray-100 shrink-0" 
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs md:text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: <span className="font-bold text-gray-700">{item.quantity}</span></p>
                    <p className="text-xs text-gray-400">Unit Price: ₹{item.price}</p>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900 text-sm sm:text-base text-right">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 md:p-8 bg-gray-50/50">
          
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm">
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

          <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#06A1B7] uppercase tracking-wider mb-2">
                <ShieldCheck size={15} />
                <span>Payment Information</span>
              </div>
              <p className="text-xs text-gray-600">Method: <strong className="text-gray-900">{order.paymentMethod}</strong></p>
              <p className="text-xs text-gray-600 mt-1">Status: {displayPaymentStatus}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">
                {isPaymentCompleted ? "Total Amount Paid" : "Total Amount Payable"}
              </span>
              <span className="text-lg md:text-xl font-black text-[#06A1B7]">₹{order.totalAmount}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;