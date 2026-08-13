import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { MapPin, ShieldCheck, CheckCircle2, Loader2, ArrowRight, Check, Package } from "lucide-react";
import { getAddressesThunk } from "../../../slice/address/addressThunk";
import { placeOrderThunk } from "../../../slice/order/orderThunk";
import { clearCart } from "../../../slice/cart/cartSlice";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if a single product was passed via "Buy Now" or returned back from address page
  const buyNowItem = location.state?.buyNowItem;

  const cartItems = useSelector((state) => state.cart?.items || []);
  
  // Decide which items to checkout: Single Buy-Now item OR all cart items
  const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;

  const { addresses } = useSelector((state) => state.address);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State for Confirmation Popup
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  // Calculate totals based on the active items being checked out
  const subtotal = itemsToCheckout.reduce((acc, item) => acc + (Number(item?.price) || 0) * (Number(item?.quantity) || 1), 0);
  const shippingFee = subtotal > 500 ? 0 : 50;
  const totalAmount = subtotal + shippingFee;

  useEffect(() => {
    dispatch(getAddressesThunk());
  }, [dispatch]);

  // Set default address when loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (itemsToCheckout.length === 0) {
      toast.error("No items to checkout");
      return;
    }

    const orderPayload = {
      orderItems: itemsToCheckout.map((item) => ({
        product: item.product || item._id || item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      shippingAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        addressType: selectedAddress.addressType,
      },
      paymentMethod,
      totalAmount,
    };

    if (paymentMethod === "Online" || paymentMethod === "UPI") {
      // Redirect to Scanner page with payload state (include buyNowItem if present)
      navigate("/checkout/upi", { state: { orderPayload, buyNowItem } });
    } else {
      // Direct COD order placement
      setIsSubmitting(true);
      try {
        const resultAction = await dispatch(placeOrderThunk(orderPayload)).unwrap();
        
        // ONLY clear the main Redux cart if the order came from the cart checkout (not Buy Now)
        if (!buyNowItem) {
          dispatch(clearCart());
        }
        
        const orderId = resultAction?._id || resultAction?.order?._id;
        setPlacedOrderId(orderId);
        setShowConfirmationModal(true);
      } catch (error) {
        toast.error(error || "Failed to place order");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (itemsToCheckout.length === 0 && !showConfirmationModal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900">No items for checkout</h2>
        <p className="text-gray-500 mt-2 mb-6">Your cart is empty and no express item was selected.</p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[#06A1B7] text-white px-6 py-3 rounded-xl font-bold"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-16 md:mt-20 relative">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
        {buyNowItem ? "Express Checkout (Buy Now)" : "Checkout"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Delivery Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="text-[#06A1B7]" size={20} />
                Select Delivery Address
              </h2>
              <button
                onClick={() => navigate("/addresses", { state: { returnTo: "/checkout", buyNowItem } })}
                className="text-xs font-bold text-[#06A1B7] hover:underline"
              >
                Manage Addresses
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">No saved addresses found.</p>
                <button
                  onClick={() => navigate("/addresses", { state: { returnTo: "/checkout", buyNowItem } })}
                  className="bg-[#06A1B7] text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Add Address Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isSelected = selectedAddress?._id === addr._id;
                  return (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                        isSelected ? "border-[#06A1B7] bg-cyan-50/20 ring-1 ring-[#06A1B7]" : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#06A1B7]">{addr.addressType}</span>
                        {isSelected && <CheckCircle2 size={16} className="text-[#06A1B7]" />}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">{addr.fullName}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Phone: {addr.phone}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#06A1B7]"
                  />
                  <span className="font-semibold text-sm text-gray-800">Cash on Delivery (COD)</span>
                </div>
                <span className="text-xs font-bold text-gray-400">Pay when delivered</span>
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#06A1B7]"
                  />
                  <span className="font-semibold text-sm text-gray-800">Online Payment (UPI / QR Scanner)</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Secure</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">Order Summary</h2>

            <div className="py-4 max-h-60 overflow-y-auto space-y-3">
              {itemsToCheckout.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-gray-50 p-1 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">₹{(item.price || 0) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-[#06A1B7]">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || !selectedAddress}
              className="w-full mt-6 bg-[#06A1B7] hover:bg-[#058a9d] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-4">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Safe and secure payments</span>
            </div>
          </div>
        </div>

      </div>

      {/* ORDER CONFIRMATION SUCCESS MODAL POPUP */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative transform animate-in zoom-in-95 duration-200">
            
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Check size={40} strokeWidth={3} />
            </div>

            <h2 className="text-2xl font-black text-gray-900">Order Confirmed! 🎉</h2>
            <p className="text-sm text-gray-500 mt-2">
              Thank you for your purchase. Your order has been placed successfully.
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 my-6 text-left space-y-1">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order ID Reference</p>
              <p className="text-xs font-mono font-extrabold text-gray-800">#{placedOrderId ? placedOrderId.slice(-10).toUpperCase() : ""}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/orders/${placedOrderId}`)}
                className="w-full bg-[#06A1B7] hover:bg-[#058a9d] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Package size={18} />
                <span>Track Order Details</span>
              </button>

              <button
                onClick={() => navigate("/orders")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition-all"
              >
                Go to My Orders
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;