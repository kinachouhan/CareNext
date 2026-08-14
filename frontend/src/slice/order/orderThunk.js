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


export const getOrdersThunk = createAsyncThunk(
  "order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders", { withCredentials: true });
      return res.data.orders;
    } catch (error) {
      console.error("API /orders Error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);


export const getAllAdminOrdersThunk = createAsyncThunk(
  "order/getAllAdminOrders",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await api.get(`/orders/admin/all?page=${page}&limit=10`, { withCredentials: true });
      return res.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);
export const updateOrderStatusThunk = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/orders/admin/${id}/status`, { orderStatus }, { withCredentials: true });
      return res.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

export const updatePaymentStatusThunk = createAsyncThunk(
  "order/updatePaymentStatus",
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/orders/admin/${id}/payment`, { paymentStatus }, { withCredentials: true });
      return res.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update payment status");
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, thunkAPI) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, {}, { withCredentials: true });
      return response.data.order || response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  })