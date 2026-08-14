import { createSlice } from "@reduxjs/toolkit";
import {
  addProductThunk,
  createReviewThunk,
  updateReviewThunk,
  deleteReviewThunk,
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
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Product
      .addCase(addProductThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addProductThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Get All Products
      .addCase(getProductsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductsThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Delete Product
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

      // Update Product
      .addCase(updateProductThunk.pending, (state) => {
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
      .addCase(updateProductThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Get Single Product by ID
      .addCase(getProductByIdThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductByIdThunk.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductByIdThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Create Review
      .addCase(createReviewThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReviewThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedProduct) {
          state.selectedProduct.reviews = action.payload.reviews;
          state.selectedProduct.ratings = action.payload.ratings;
          state.selectedProduct.numReviews = action.payload.numReviews;
        }
      })
      .addCase(createReviewThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Update Review
      .addCase(updateReviewThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReviewThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedProduct) {
          state.selectedProduct.reviews = action.payload.reviews;
          state.selectedProduct.ratings = action.payload.ratings;
          state.selectedProduct.numReviews = action.payload.numReviews;
        }
      })
      .addCase(updateReviewThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Delete Review
      .addCase(deleteReviewThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedProduct) {
          state.selectedProduct.reviews = action.payload.reviews;
          state.selectedProduct.ratings = action.payload.ratings;
          state.selectedProduct.numReviews = action.payload.numReviews;
        }
      })
      .addCase(deleteReviewThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;