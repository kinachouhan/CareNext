import { memo } from "react";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { useDispatch } from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../../slice/cart/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex gap-4 p-5 border-b">

      <img
        src={item.image}
        alt={item.name}
        className="
        w-20
        h-20
        object-cover
        rounded-xl
        "
      />

      <div className="flex-1">

        <h3 className="font-semibold">
          {item.name}
        </h3>

        <p className="text-[#06A1B7] font-bold mt-1">
          ₹{item.price}
        </p>

        <div className="flex items-center justify-between mt-4">

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                dispatch(
                  decreaseQuantity(item._id)
                )
              }
              className="p-1 rounded border"
            >
              <Minus size={16} />
            </button>

            <span>{item.quantity}</span>

            <button
              disabled={
                item.quantity >= item.stock
              }
              onClick={() =>
                dispatch(
                  increaseQuantity(item._id)
                )
              }
              className="p-1 rounded border"
            >
              <Plus size={16} />
            </button>

          </div>

          <button
            onClick={() =>
              dispatch(removeFromCart(item._id))
            }
            className="text-red-500"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default memo(CartItem);