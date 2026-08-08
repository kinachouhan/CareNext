import { useSelector } from "react-redux";
import { selectCartCount, selectCartSubtotal } from "../../../slice/cart/cartSlice";

const CartSummary = () => {
  const totalItems = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  return (
    <div className="p-5">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>Total Items</span>
        <span className="font-semibold text-gray-900">{totalItems}</span>
      </div>

      <div className="flex justify-between items-center font-bold text-xl">
        <span>Subtotal</span>
        <span className="text-[#06A1B7]">
          ₹{subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default CartSummary;