import { X, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  closeCart,
  clearCart,
} from "../../../slice/cart/cartSlice";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

const CartDrawer = () => {
  const dispatch = useDispatch();

  const { isOpen, items } = useSelector(
    (state) => state.cart
  );

  return (
    <>
      {/* Overlay */}

      <div
        onClick={() => dispatch(closeCart())}
        className={`
        fixed inset-0
        bg-black/40
        backdrop-blur-sm
        transition-all duration-300
        z-40

        ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }
      `}
      />

      {/* Drawer */}

      <aside
        className={`
        fixed
        top-0
        right-0
        h-screen

        w-full
        sm:w-[420px]

        bg-white

        shadow-2xl

        z-50

        transition-transform
        duration-300
        ease-in-out

        flex
        flex-col

        ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }
      `}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b p-5">

          <div className="flex items-center gap-2">

            <ShoppingCart
              className="text-[#06A1B7]"
              size={22}
            />

            <h2 className="font-bold text-xl">
              Shopping Cart
            </h2>

          </div>

          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X />
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto">

          {items.length === 0 ? (

            <div className="h-full flex flex-col justify-center items-center p-8">

              <ShoppingCart
                size={60}
                className="text-gray-300"
              />

              <h3 className="mt-4 text-xl font-semibold">

                Your Cart is Empty

              </h3>

              <p className="text-gray-500 mt-2">

                Add products to continue shopping

              </p>

            </div>

          ) : (

            items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
              />
            ))

          )}

        </div>

        {/* Footer */}

        {items.length > 0 && (

          <div className="border-t">

            <CartSummary />

            <div className="p-5">

              <button
                onClick={() => dispatch(clearCart())}
                className="
                w-full
                mb-3
                py-3
                rounded-xl
                border
                hover:bg-gray-50
                "
              >
                Clear Cart
              </button>

              <button
                className="
                w-full
                py-3
                rounded-xl
                bg-[#06A1B7]
                text-white
                font-semibold
                hover:bg-cyan-700
                "
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