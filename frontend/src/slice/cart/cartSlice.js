import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const cart = localStorage.getItem("cart");

    return cart
      ? JSON.parse(cart)
      : {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        };
  } catch {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  }
};

const saveCart = (state) => {
  localStorage.setItem(
    "cart",
    JSON.stringify({
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
    })
  );
};

const initialState = {
  ...loadCart(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    addToCart: (state, action) => {
      const product = action.payload;

      const existing = state.items.find(
        (item) => item._id === product._id
      );

      if (existing) {
        if (existing.quantity < existing.stock) {
          existing.quantity += 1;
        }
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }

      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      saveCart(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );

      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      saveCart(state);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item._id === action.payload
      );

      if (item && item.quantity < item.stock) {
        item.quantity++;
      }

      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      saveCart(state);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item._id === action.payload
      );

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity--;
      } else {
        state.items = state.items.filter(
          (cartItem) => cartItem._id !== action.payload
        );
      }

      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      saveCart(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;

      saveCart(state);
    },
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;