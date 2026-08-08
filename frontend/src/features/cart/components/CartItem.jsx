import { memo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import useCart from "../hooks/useCart";

const CartItem = ({ item }) => {
  const { increase, decrease, removeItem } = useCart();

  const maxStock = item.stock !== undefined && item.stock !== null ? Number(item.stock) : 99;
  const isMaxReached = Number(item.quantity) >= maxStock;

  return (
    <div className="flex gap-4 p-5 border-b border-gray-100 items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 rounded-xl object-cover bg-gray-50 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {item.name}
        </h3>

        <p className="mt-1 text-[#06A1B7] font-bold text-sm">
          ₹{item.price}
        </p>

        <div className="flex justify-between items-center mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => decrease(item)}
              className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Decrease quantity"
            >
              {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
            </button>

            <span className="w-8 text-center text-xs font-bold text-gray-800">
              {item.quantity}
            </span>

            <button
              onClick={() => increase(item)}
              disabled={isMaxReached}
              className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Remove Button - passing the whole item object to match useCart expectations */}
          <button
            onClick={() => removeItem(item)}
            className="text-gray-400 hover:text-red-600 p-2 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(CartItem);