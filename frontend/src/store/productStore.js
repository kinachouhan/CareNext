import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../slice/product/productSlice.js"

export const store = configureStore({
  reducer: {
    product: productReducer
  },
});