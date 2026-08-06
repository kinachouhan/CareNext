import { createSlice } from "@reduxjs/toolkit";
import {
  addProductThunk,
  deleteProductThunk,
  getProductByIdThunk,
  getProductsThunk,
  updateProductThunk,
} from "./productThunk";

const initialState = {
  products: [],
  isLoading: false,
  selectedProduct: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProductThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getProductsThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteProductThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload,
        );
      })
      .addCase(deleteProductThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateProductThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getProductByIdThunk.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductByIdThunk.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default productSlice.reducer;
