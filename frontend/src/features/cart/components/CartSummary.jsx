import { useSelector } from "react-redux";

const CartSummary = () => {
  const {
    totalItems,
    totalPrice,
  } = useSelector((state) => state.cart);

  return (
    <div className="p-5">

      <div className="flex justify-between mb-2">

        <span>Total Items</span>

        <span>{totalItems}</span>

      </div>

      <div className="flex justify-between font-bold text-xl">

        <span>Subtotal</span>

        <span className="text-[#06A1B7]">

          ₹{totalPrice}

        </span>

      </div>

    </div>
  );
};

export default CartSummary;