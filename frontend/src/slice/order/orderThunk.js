import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const placeOrderThunk = createAsyncThunk(
  "order/place",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await api.post("/orders", orderData, { withCredentials: true });
      return res.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to place order");
    }
  }
);

/* ----------------------------- GET USER ORDERS ----------------------------- */
export const getOrdersThunk = createAsyncThunk(
  "order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders", { withCredentials: true });
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);