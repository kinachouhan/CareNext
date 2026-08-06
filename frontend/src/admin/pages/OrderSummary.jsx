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
} from "lucide-react";
import { Link } from "react-router"; 
import { useState } from "react";

const order = {
  id: "ORD-1001",
  date: "03 Aug 2026",
  paymentMethod: "Razorpay",
  paymentStatus: "Completed",
  deliveryStatus: "Packed",
  customer: {
    name: "Rajkumari Chouhan",
    email: "raj@gmail.com",
    phone: "+91 9876543210",
  },
  address: {
    address: "Vijay Nagar",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452001",
  },
  products: [
    {
      id: 1,
      name: "Dental Handpiece",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500",
      price: 4500,
      qty: 2,
    },
    {
      id: 2,
      name: "Composite Resin",
      image:
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
      price: 850,
      qty: 1,
    },
  ],
  shipping: 100,
  discount: 200,
};

const subtotal = order.products.reduce(
  (acc, item) => acc + item.price * item.qty,
  0
);

const total = subtotal + order.shipping - order.discount;

const OrderSummary = () => {
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus);

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-3 sm:p-4 md:p-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 text-[#06A1B7] mb-2 text-sm md:text-base font-medium"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Order #{order.id}
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage customer order
          </p>
        </div>
      </div>

      {/* Customer + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Customer */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-5">
            Customer Information
          </h2>
          <div className="space-y-3 md:space-y-4 text-sm md:text-base text-gray-700">
            <div className="flex items-center gap-3">
              <User className="text-[#06A1B7] shrink-0" size={18} />
              <span className="truncate">{order.customer.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-[#06A1B7] shrink-0" size={18} />
              <span className="truncate">{order.customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-[#06A1B7] shrink-0" size={18} />
              <span>{order.customer.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-[#06A1B7] mt-1 shrink-0" size={18} />
              <div>
                <p>{order.address.address}</p>
                <p>
                  {order.address.city}, {order.address.state}
                </p>
                <p>{order.address.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Basics */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-5">
            Order Information
          </h2>
          <div className="space-y-3 md:space-y-4 text-sm md:text-base text-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Date</span>
              <span className="flex items-center gap-2 font-medium">
                <Calendar size={16} className="text-[#06A1B7]" />
                {order.date}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment</span>
              <span className="flex items-center gap-2 font-medium">
                <CreditCard size={16} className="text-[#06A1B7]" />
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Items</span>
              <span className="flex items-center gap-2 font-medium">
                <Package size={16} className="text-[#06A1B7]" />
                {order.products.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 md:mb-6">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold">Ordered Products</h2>
        </div>

        {/* Mobile View: Stacked List */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {order.products.map((item) => (
            <div key={item.id} className="p-4 flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover border border-gray-100 shrink-0"
              />
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-gray-900 leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  ₹{item.price} x {item.qty}
                </p>
                <p className="font-bold text-[#06A1B7]">
                  ₹{item.price * item.qty}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 text-gray-500 text-sm">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="font-medium p-4">Price</th>
                <th className="font-medium p-4">Qty</th>
                <th className="font-medium p-4">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                      />
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    </div>
                  </td>
                  <td className="text-center text-gray-600">₹{item.price}</td>
                  <td className="text-center text-gray-600">{item.qty}</td>
                  <td className="text-center font-bold text-gray-900">
                    ₹{item.price * item.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Payment */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-5 flex items-center gap-2">
            <CreditCard size={20} className="text-[#06A1B7]" />
            Payment Status
          </h2>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 md:p-3.5 focus:ring-2 focus:ring-[#06A1B7] outline-none transition-all cursor-pointer"
          >
            <option>Pending</option>
            <option>Completed</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-5 flex items-center gap-2">
            <Truck size={20} className="text-[#06A1B7]" />
            Delivery Status
          </h2>
          <select
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 md:p-3.5 focus:ring-2 focus:ring-[#06A1B7] outline-none transition-all cursor-pointer"
          >
            <option>Order Placed</option>
            <option>Confirmed</option>
            <option>Packed</option>
            <option>Shipped</option>
            <option>Out For Delivery</option>
            <option>Delivered</option>
            <option>Cancelled</option>
            <option>Returned</option>
          </select>
        </div>
      </div>

      {/* Financials & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
            Financial Summary
          </h2>
          <div className="space-y-3 md:space-y-4 text-gray-600">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">₹{order.shipping}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Discount</span>
              <span className="font-medium">- ₹{order.discount}</span>
            </div>
            <hr className="border-gray-100 my-4" />
            <div className="flex justify-between items-center text-lg md:text-xl font-bold text-gray-900">
              <span>Total</span>
              <span className="text-[#06A1B7]">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <Clock size={20} className="text-[#06A1B7]" />
            Timeline
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 relative">
              <div className="absolute left-1.5 top-3 bottom-[-24px] w-[2px] bg-gray-100"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-500 mt-1 relative z-10 ring-4 ring-white"></div>
              <div>
                <p className="font-semibold text-gray-900 leading-none">Order Placed</p>
                <p className="text-sm text-gray-500 mt-1">03 Aug 2026 - 09:30 AM</p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="absolute left-1.5 top-3 bottom-[-24px] w-[2px] bg-gray-100"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-500 mt-1 relative z-10 ring-4 ring-white"></div>
              <div>
                <p className="font-semibold text-gray-900 leading-none">Payment Completed</p>
                <p className="text-sm text-gray-500 mt-1">03 Aug 2026 - 09:31 AM</p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-3.5 h-3.5 rounded-full bg-[#06A1B7] mt-1 relative z-10 ring-4 ring-white"></div>
              <div>
                <p className="font-semibold text-[#06A1B7] leading-none">{deliveryStatus}</p>
                <p className="text-sm text-gray-500 mt-1">Current Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 pt-4 border-t border-gray-200/50">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 w-full sm:w-auto">
          <button className="bg-white border border-gray-200 px-5 py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium text-gray-700 w-full sm:w-auto shadow-sm">
            <Printer size={18} />
            Print
          </button>
          <button className="bg-white border border-gray-200 px-5 py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium text-gray-700 w-full sm:w-auto shadow-sm">
            <FileText size={18} />
            Invoice
          </button>
        </div>
        <button className="bg-[#06A1B7] text-white px-6 py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#058a9d] transition-colors font-medium w-full sm:w-auto shadow-sm shadow-cyan-500/20">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;