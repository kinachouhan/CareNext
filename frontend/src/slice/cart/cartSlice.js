import { createSlice } from "@reduxjs/toolkit";
import {
  getCartThunk,
  addToCartThunk,
  updateCartThunk,
  removeFromCartThunk,
  clearCartThunk,
} from "./cartThunk";

/* ----------------------------- Guest Cart ----------------------------- */

const getGuestCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem("guest_cart"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  localStorage.setItem("guest_cart", JSON.stringify(Array.isArray(items) ? items : []));
};

/* ---------------------------- Initial State --------------------------- */

const initialState = {
  items: getGuestCart(),
  open: false,
  loading: false,
  error: null,
};

/* ------------------------------ Slice -------------------------------- */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart(state) {
      state.open = true;
    },
    closeCart(state) {
      state.open = false;
    },
    toggleCart(state) {
      state.open = !state.open;
    },
    setCart(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      saveGuestCart(state.items);
    },
    increaseQuantity(state, action) {
      if (!Array.isArray(state.items)) state.items = [];
      state.items = state.items.map((item) => {
        if (item._id === action.payload || item.productId === action.payload) {
          const currentQty = Number(item.quantity) || 1;
          const maxStock = item.stock !== undefined && item.stock !== null ? Number(item.stock) : 99;
          return {
            ...item,
            quantity: Math.min(currentQty + 1, maxStock),
          };
        }
        return item;
      });
      saveGuestCart(state.items);
    },
    decreaseQuantity(state, action) {
      if (!Array.isArray(state.items)) state.items = [];
      state.items = state.items.map((item) =>
        item._id === action.payload || item.productId === action.payload
          ? {
              ...item,
              quantity: Math.max(Number(item.quantity) - 1, 1),
            }
          : item
      );
      saveGuestCart(state.items);
    },
    removeFromCart(state, action) {
      if (!Array.isArray(state.items)) state.items = [];
      state.items = state.items.filter(
        (item) => item._id !== action.payload && item.productId !== action.payload
      );
      saveGuestCart(state.items);
    },
    clearCart(state) {
  state.items = [];
  localStorage.removeItem("guest_cart");
},
  },
  extraReducers: (builder) => {
    builder
      /* ---------------- GET CART ---------------- */
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- ADD TO CART ---------------- */
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.open = true;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- UPDATE CART ---------------- */
      .addCase(updateCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(updateCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- REMOVE ITEM ---------------- */
      .addCase(removeFromCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- CLEAR CART ---------------- */
      /* ---------------- CLEAR CART ---------------- */
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* ----------------------------- Actions ----------------------------- */

export const {
  openCart,
  closeCart,
  toggleCart,
  setCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

/* ---------------------------- Selectors (Safe) ---------------------------- */

export const selectCartItems = (state) => state.cart?.items || [];

export const selectCartLoading = (state) => state.cart?.loading || false;

export const selectCartError = (state) => state.cart?.error || null;

export const selectCartOpen = (state) => state.cart?.open || false;

export const selectCartCount = (state) => {
  const items = state.cart?.items;
  if (!Array.isArray(items)) return 0;
  return items.reduce((total, item) => total + (Number(item?.quantity) || 0), 0);
};

export const selectCartSubtotal = (state) => {
  const items = state.cart?.items;
  if (!Array.isArray(items)) return 0;
  return items.reduce(
    (total, item) => total + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
    0
  );
};

export default cartSlice.reducer;