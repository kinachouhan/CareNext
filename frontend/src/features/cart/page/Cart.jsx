import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus, ShieldCheck } from "lucide-react";
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart 
} from "../../../slice/cart/cartSlice";
import { 
  updateCartThunk, 
  removeFromCartThunk, 
  clearCartThunk 
} from "../../../slice/cart/cartThunk";

const CartItemRow = React.memo(({ item, user, dispatch }) => {
  const maxStock = item.stock != null ? Number(item.stock) : 99;
  const isMaxReached = Number(item.quantity) >= maxStock;
  const itemId = item._id || item.productId;

  const handleIncrease = useCallback(() => {
    if (user) {
      dispatch(updateCartThunk({ productId: itemId, quantity: item.quantity + 1 }));
    } else {
      dispatch(increaseQuantity(itemId));
    }
  }, [dispatch, itemId, item.quantity, user]);

  const handleDecrease = useCallback(() => {
    if (item.quantity === 1) {
      if (user) {
        dispatch(removeFromCartThunk(itemId));
      } else {
        dispatch(removeFromCart(itemId));
      }
      return;
    }
    if (user) {
      dispatch(updateCartThunk({ productId: itemId, quantity: item.quantity - 1 }));
    } else {
      dispatch(decreaseQuantity(itemId));
    }
  }, [dispatch, itemId, item.quantity, user]);

  const handleRemove = useCallback(() => {
    if (user) {
      dispatch(removeFromCartThunk(itemId));
    } else {
      dispatch(removeFromCart(itemId));
    }
  }, [dispatch, itemId, user]);

  return (
    <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:shadow-md">
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-contain bg-gray-50/80 p-2 shrink-0 border border-gray-100"
      />

      <div className="flex-1 min-w-0 pr-8 sm:pr-0">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
          {item.name}
        </h3>
        <p className="text-[#06A1B7] font-bold text-base mt-0.5">
          ₹{item.price}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={handleDecrease}
              className="p-2 sm:p-2.5 hover:bg-gray-50 text-gray-600 transition-colors active:scale-95"
              aria-label="Decrease quantity"
            >
              {item.quantity === 1 ? <Trash2 size={15} className="text-red-500" /> : <Minus size={15} />}
            </button>

            <span className="w-9 text-center text-xs sm:text-sm font-bold text-gray-800">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={isMaxReached}
              className="p-2 sm:p-2.5 hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total</span>
            <span className="font-extrabold text-gray-900 text-base">
              ₹{item.price * item.quantity}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-4 right-4 sm:static text-gray-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
        title="Remove item"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
});

CartItemRow.displayName = "CartItemRow";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartState = useSelector((state) => state.cart);
  const items = useMemo(() => cartState?.items || [], [cartState?.items]);
  const { user } = useSelector((state) => state.auth);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
      0
    );
  }, [items]);

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const finalTotal = subtotal + shipping;

  const handleClearCart = useCallback(() => {
    if (user) {
      dispatch(clearCartThunk());
    } else {
      dispatch(clearCart());
    }
  }, [dispatch, user]);

  const handleCheckout = useCallback(() => {
    if (!user) {
      navigate("/auth/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  }, [navigate, user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 bg-gray-50/50">
        <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center text-[#06A1B7] mb-6 shadow-inner animate-pulse">
          <ShoppingCart size={44} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm sm:text-base text-center max-w-md mb-8">
          Looks like you haven't added anything to your cart yet. Explore our shop and find something you love!
        </p>
        <Link
          to="/shop"
          className="bg-[#06A1B7] hover:bg-[#058a9d] text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen  px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#06A1B7] transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Continue Shopping</span>
          </button>
          
          <button
            type="button"
            onClick={handleClearCart}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors active:scale-95"
          >
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8 tracking-tight">
          Shopping Cart <span className="text-base font-medium text-gray-400">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <CartItemRow 
                key={item._id || item.productId} 
                item={item} 
                user={user} 
                dispatch={dispatch} 
              />
            ))}
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3.5 py-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Estimate</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <div className="text-xs text-[#06A1B7] bg-cyan-50/80 p-3 rounded-xl border border-cyan-100">
                  Add <span className="font-bold">₹{500 - subtotal}</span> more to unlock free shipping!
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-6">
              <span className="text-base font-bold text-gray-900">Total Amount</span>
              <span className="text-2xl font-black text-[#06A1B7]">₹{finalTotal}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-[#06A1B7] hover:bg-[#058a9d] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98] mb-4"
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
              <ShieldCheck size={16} className="text-[#06A1B7]" />
              <span>Secure Checkout Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;