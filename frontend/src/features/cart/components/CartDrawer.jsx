import React, { useMemo, useCallback } from "react";
import { X, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  closeCart,
  clearCart,
} from "../../../slice/cart/cartSlice";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { clearCartThunk } from "../../../slice/cart/cartThunk";

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartState = useSelector((state) => state.cart);
  const open = cartState?.open || false;
  const items = cartState?.items || []; 
  const { user } = useSelector((state) => state.auth);

  // Memoize total item counts to boost render performance
  const totalItemsCount = useMemo(() => {
    return items.reduce((total, item) => total + (Number(item?.quantity) || 0), 0);
  }, [items]);

  const handleClose = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  const handleClearCart = useCallback(() => {
    if (user) {
      dispatch(clearCartThunk());
    } else {
      dispatch(clearCart());
    }
  }, [dispatch, user]);

  const handleViewCart = useCallback(() => {
    dispatch(closeCart());
    navigate("/cart");
  }, [dispatch, navigate]);

  const handleCheckout = useCallback(() => {
    dispatch(closeCart());
    if (!user) {
      navigate("/auth/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  }, [dispatch, navigate, user]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`
          fixed inset-0
          bg-black/50
          backdrop-blur-sm
          transition-opacity duration-300
          z-40
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 h-screen
          w-full sm:w-[440px]
          bg-white shadow-2xl z-50
          transition-transform duration-300 ease-in-out
          flex flex-col
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#06A1B7]/10 rounded-xl text-[#06A1B7]">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 leading-none">
                Shopping Cart
              </h2>
              <span className="text-xs text-gray-500 mt-1 block">
                {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                title="Clear Cart"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body (Items List) */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center p-8 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <ShoppingCart size={36} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Your Cart is Empty
              </h3>
              <p className="text-gray-500 text-sm mt-1 max-w-[240px]">
                Explore our store and add items to your cart to get started.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item._id || item.productId}
                item={item}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <CartSummary />

            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* View Cart Page Button */}
              <button
                onClick={handleViewCart}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>View Cart</span>
                <ArrowRight size={16} />
              </button>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-xl bg-[#06A1B7] hover:bg-[#058a9d] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98]"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;