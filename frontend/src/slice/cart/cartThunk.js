import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios"; 


const formatCartItems = (cartDoc) => {
  if (!cartDoc || !cartDoc.items) return [];
  
  
  return cartDoc.items.map((item) => {
    const product = item.product || {};
    return {
      _id: product._id || item.product,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: item.quantity,
    };
  });
};

export const getCartThunk = createAsyncThunk(
  "cart/getCart",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/cart");
      return formatCartItems(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      const { data } = await api.post("/cart", {
        productId,
        quantity,
      });

      return formatCartItems(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const updateCartThunk = createAsyncThunk(
  "cart/updateCart",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const response = await api.put(`/cart/${productId}`, { quantity });
      return formatCartItems(response.data); // Fixed: Format cart items array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/removeCart",
  async (productId, thunkAPI) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return formatCartItems(response.data); // Fixed: Format cart items array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



export const clearCartThunk = createAsyncThunk(
  "cart/clear",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.delete("/cart");
      return formatCartItems(data); // Returns the formatted empty cart array from backend
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);