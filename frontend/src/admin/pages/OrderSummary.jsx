import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  Truck,
  Save,
  FileText,
  Printer,
  Clock,
  Loader2,
  Download
} from "lucide-react";
import { Link, useParams } from "react-router"; 
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersThunk, updateOrderStatusThunk, updatePaymentStatusThunk } from "../../slice/order/orderThunk";
import { downloadReceiptPDF } from "../../features/orders/components/downloadReceiptPDF"
import toast from "react-hot-toast";

const VALID_DELIVERY_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled"];
const VALID_PAYMENT_STATUSES = ["Pending", "Completed", "Failed", "Refunded"];

const OrderSummary = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders?.orders) || [];
  const loading = useSelector((state) => state.orders?.loading) || false;

  const order = useMemo(() => {
    return orders.find((o) => o._id === id);
  }, [orders, id]);

  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [deliveryStatus, setDeliveryStatus] = useState("Pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(getOrdersThunk());
    }
  }, [dispatch, orders.length]);

  useEffect(() => {
    if (order) {
      setPaymentStatus(order.paymentStatus || "Pending");
      setDeliveryStatus(order.orderStatus || "Pending");
    }
  }, [order]);

  const handleSaveChanges = useCallback(async () => {
    if (!order) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        dispatch(updatePaymentStatusThunk({ id: order._id, paymentStatus })).unwrap(),
        dispatch(updateOrderStatusThunk({ id: order._id, orderStatus: deliveryStatus })).unwrap()
      ]);
      toast.success("Order statuses updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to update order status");
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, order, paymentStatus, deliveryStatus]);

  const subtotal = useMemo(() => {
    return order?.orderItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  }, [order?.orderItems]);

  const shippingFee = order?.shippingFee || 0;
  const discountVal = order?.discount || 0;
  const grandTotal = order?.totalAmount || subtotal + shippingFee - discountVal;

  if (loading && !order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center mt-16 md:mt-20">
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">Could not find details for this order ID.</p>
        <Link to="/admin/orders" className="bg-[#06A1B7] text-white px-6 py-3 rounded-xl font-bold shadow-sm">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-3 sm:p-4 md:p-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 text-[#06A1B7] mb-2 text-sm md:text-base font-medium transition-colors hover:underline w-fit"
          >
            <ArrowLeft size={18} />
            <span>Back to Orders</span>
          </Link>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 break-all">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-xs md:text-base text-gray-500 mt-1">
            Manage customer order tracking and statuses
          </p>
        </div>
      </div>

      {/* Customer + Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Customer Information */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
          <h2 className="text-base md:text-xl font-semibold mb-4 md:mb-5">
            Customer Information
          </h2>
          <div className="space-y-3 md:space-y-4 text-xs md:text-base text-gray-700">
            <div className="flex items-center gap-3">
              <User className="text-[#06A1B7] shrink-0" size={18} />
              <span className="truncate">{order.user?.fullName || order.shippingAddress?.fullName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-[#06A1B7] shrink-0" size={18} />
              <span className="truncate">{order.user?.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-[#06A1B7] shrink-0" size={18} />
              <span>{order.shippingAddress?.phone || "N/A"}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-[#06A1B7] mt-1 shrink-0" size={18} />
              <div>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>{order.shippingAddress?.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Information Basics */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
          <h2 className="text-base md:text-xl font-semibold mb-4 md:mb-5">
            Order Information
          </h2>
          <div className="space-y-3 md:space-y-4 text-xs md:text-base text-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-medium">#{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Date</span>
              <span className="flex items-center gap-2 font-medium">
                <Calendar size={16} className="text-[#06A1B7]" />
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Method</span>
              <span className="flex items-center gap-2 font-medium">
                <CreditCard size={16} className="text-[#06A1B7]" />
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Items Count</span>
              <span className="flex items-center gap-2 font-medium">
                <Package size={16} className="text-[#06A1B7]" />
                {order.orderItems?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 md:mb-6 border border-gray-100">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-base md:text-xl font-semibold">Ordered Products</h2>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {order.orderItems?.map((item, idx) => (
            <div key={idx} className="p-4 flex gap-3.5 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-contain bg-gray-50 p-1 border border-gray-100 shrink-0"
              />
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-gray-900 text-xs truncate mb-0.5">
                  {item.name}
                </h3>
                <p className="text-[11px] text-gray-500 mb-1">
                  ₹{item.price} × {item.quantity}
                </p>
                <p className="font-extrabold text-[#06A1B7] text-xs">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 text-gray-500 text-sm">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="font-medium p-4 text-center">Price</th>
                <th className="font-medium p-4 text-center">Qty</th>
                <th className="font-medium p-4 text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {order.orderItems?.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-contain bg-gray-50 p-1.5 border border-gray-100 shrink-0"
                      />
                      <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                    </div>
                  </td>
                  <td className="text-center text-gray-600">₹{item.price}</td>
                  <td className="text-center text-gray-600">{item.quantity}</td>
                  <td className="text-center font-extrabold text-gray-900">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
          <h2 className="text-base md:text-xl font-semibold mb-3 md:mb-5 flex items-center gap-2">
            <CreditCard size={20} className="text-[#06A1B7]" />
            <span>Payment Status</span>
          </h2>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 md:p-3.5 focus:ring-2 focus:ring-[#06A1B7] outline-none transition-all cursor-pointer font-medium text-xs md:text-sm"
          >
            {VALID_PAYMENT_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
          <h2 className="text-base md:text-xl font-semibold mb-3 md:mb-5 flex items-center gap-2">
            <Truck size={20} className="text-[#06A1B7]" />
            <span>Delivery Status</span>
          </h2>
          <select
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 md:p-3.5 focus:ring-2 focus:ring-[#06A1B7] outline-none transition-all cursor-pointer font-medium text-xs md:text-sm"
          >
            {VALID_DELIVERY_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financials & Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
          <h2 className="text-base md:text-xl font-semibold mb-4 md:mb-6">
            Financial Summary
          </h2>
          <div className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">₹{shippingFee}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-600">
              <span>Discount</span>
              <span className="font-medium">- ₹{discountVal}</span>
            </div>
            <hr className="border-gray-100 my-4" />
            <div className="flex justify-between items-center text-base md:text-xl font-bold text-gray-900">
              <span>Total</span>
              <span className="text-[#06A1B7]">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
          <h2 className="text-base md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <Clock size={20} className="text-[#06A1B7]" />
            <span>Timeline</span>
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 relative">
              <div className="absolute left-1.5 top-3 bottom-[-24px] w-[2px] bg-gray-100"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 mt-1 relative z-10 ring-4 ring-white shrink-0"></div>
              <div>
                <p className="font-bold text-gray-900 text-xs md:text-sm leading-none">Order Placed</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-3.5 h-3.5 rounded-full bg-[#06A1B7] mt-1 relative z-10 ring-4 ring-white shrink-0"></div>
              <div>
                <p className="font-bold text-[#06A1B7] text-xs md:text-sm leading-none">{deliveryStatus}</p>
                <p className="text-xs text-gray-500 mt-1">Current Order Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 pt-4 border-t border-gray-200/50">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 w-full sm:w-auto">
          <button onClick={() => window.print()} className="bg-white border border-gray-200 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-semibold text-xs md:text-sm text-gray-700 w-full sm:w-auto shadow-sm active:scale-95">
            <Printer size={16} />
            <span>Print</span>
          </button>
          
          {/* PDF Invoice Download Button */}
          <button 
            onClick={() => downloadReceiptPDF(order)} 
            className="bg-white border border-gray-200 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-semibold text-xs md:text-sm text-gray-700 w-full sm:w-auto shadow-sm active:scale-95"
          >
            <Download size={16} />
            <span>Invoice PDF</span>
          </button>
        </div>

        <button 
          onClick={handleSaveChanges}
          disabled={isSubmitting}
          className="bg-[#06A1B7] hover:bg-[#058a9d] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-xs md:text-sm w-full sm:w-auto shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;