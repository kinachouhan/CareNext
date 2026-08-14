import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const addProductThunk = createAsyncThunk(
  "/products/add",
  async (formData, thunkApi) => {
    try {
      const response = await api.post("/products/add", formData);
      return response.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to add product",
      );
    }
  }
);

export const getProductsThunk = createAsyncThunk(
  "products",
  async (_, thunkApi) => {
    try {
      const response = await api.get("/products");
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to get product",
      );
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  "product/delete",
  async (id, thunkApi) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  "product/update",
  async ({ id, formData }, thunkApi) => {
    try {
      let response = await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  }
);

export const getProductByIdThunk = createAsyncThunk(
  "product/getById",
  async (id, thunkApi) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to get product"
      );
    }
  }
);

// Create Review
export const createReviewThunk = createAsyncThunk(
  "product/createReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/products/${productId}/reviews`,
        { rating, comment }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to submit review"
      );
    }
  }
);

// Update Review
export const updateReviewThunk = createAsyncThunk(
  "product/updateReview",
  async ({ productId, reviewId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/products/${productId}/reviews/${reviewId}`,
        { rating, comment }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update review"
      );
    }
  }
);

// Delete Review
// Delete Review
export const deleteReviewThunk = createAsyncThunk(
  "product/deleteReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/products/${productId}/reviews/${reviewId}`
      );
      
      // Safely unwrap data whether it's nested under .data or sent directly
      const payload = response.data.data || response.data;
      
      return {
        reviews: payload.reviews || [],
        ratings: payload.ratings || 0,
        numReviews: payload.numReviews || 0
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);