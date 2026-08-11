import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axios";



export const getWishlistThunk = createAsyncThunk(
  "wishlist/get",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // If user is logged in, fetch from backend
      if (auth?.user) {
        const response = await api.get("/wishlist", { withCredentials: true });
        return response.data.wishlist.products;
      } 
      
      // If guest, load from localStorage
      const localData = localStorage.getItem("guest_wishlist");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);


export const toggleWishlistThunk = createAsyncThunk(
  "wishlist/toggle",
  async (product, { getState, rejectWithValue }) => {
    try {
      const { auth, wishlist } = getState();
      const productId = product._id || product.id || product;

      // 1. LOGGED IN USER -> Sync with MongoDB Backend
      if (auth?.user) {
        const response = await api.post(
          `wishlist/toggle`, 
          { productId }, 
          { withCredentials: true }
        );
        return response.data.wishlist.products;
      }

      // 2. GUEST USER -> Sync with LocalStorage
      let currentItems = [...wishlist.items];
      const existingIndex = currentItems.findIndex(
        (item) => (item._id || item.id || item) === productId
      );

      if (existingIndex > -1) {
        // Remove if exists
        currentItems.splice(existingIndex, 1);
      } else {
        // Add full product object if available, otherwise just ID
        currentItems.push(product);
      }

      localStorage.setItem("guest_wishlist", JSON.stringify(currentItems));
      return currentItems;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update wishlist");
    }
  }
);

export const clearWishlistThunk = createAsyncThunk(
  "wishlist/clear",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (auth?.user) {
        await axios.delete(`${API_URL}/clear`, { withCredentials: true });
      }
      localStorage.removeItem("guest_wishlist");
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear wishlist");
    }
  }
);