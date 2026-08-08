import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../slice/product/productSlice.js"
import cartReducer from "../slice/cart/cartSlice.js";
import authReducer from "../slice/auth/authSlice.js"

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart :cartReducer,
    auth: authReducer,
  },
});