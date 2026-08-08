import { useDispatch, useSelector } from "react-redux";
import {
  openCart,
  setCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../../slice/cart/cartSlice";
import {
  addToCartThunk,
  updateCartThunk,
  removeFromCartThunk,
} from "../../../slice/cart/cartThunk";

const useCart = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const cartState = useSelector((state) => state.cart);
  const items = cartState?.items || [];

  // Helper function to safely extract the correct Product ID whether populated or local
  const getProductId = (item) => {
    if (!item) return null;
    if (typeof item.product === "object" && item.product !== null) {
      return item.product._id || item.product.id;
    }
    return item.product || item._id || item.id;
  };

  // Check if item exists in cart
  const isInCart = (id) =>
    items.some((item) => getProductId(item) === id || item._id === id);

  const addToCart = (product) => {
    const productId = product._id || product.id;

    if (user) {
      dispatch(addToCartThunk({ productId, quantity: 1 }));
      dispatch(openCart());
      return;
    }

    const existing = items.find((item) => getProductId(item) === productId);
    let updated;

    if (existing) {
      updated = items.map((item) =>
        getProductId(item) === productId
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item
      );
    } else {
      updated = [...items, { ...product, _id: productId, quantity: 1 }];
    }

    dispatch(setCart(updated));
    dispatch(openCart());
  };

  const removeItem = (item) => {
    const productId = getProductId(item);
    if (user) {
      dispatch(removeFromCartThunk(productId));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const increase = (item) => {
    const productId = getProductId(item);
    if (user) {
      dispatch(
        updateCartThunk({
          productId,
          quantity: Number(item.quantity) + 1,
        })
      );
    } else {
      dispatch(increaseQuantity(productId));
    }
  };

  const decrease = (item) => {
    const productId = getProductId(item);
    
    // If quantity is 1 or less, remove completely
    if (Number(item.quantity) <= 1) {
      removeItem(item);
      return;
    }

    if (user) {
      dispatch(
        updateCartThunk({
          productId,
          quantity: Number(item.quantity) - 1,
        })
      );
    } else {
      dispatch(decreaseQuantity(productId));
    }
  };

  return {
    items,
    addToCart,
    removeItem,
    increase,
    decrease,
    isInCart,
  };
};

export default useCart;