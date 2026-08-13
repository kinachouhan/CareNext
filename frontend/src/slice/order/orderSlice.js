import { createSlice } from "@reduxjs/toolkit";
import {
  placeOrderThunk,
  getOrdersThunk,
  updatePaymentStatusThunk,
  updateOrderStatusThunk,
  getAllAdminOrdersThunk,
  cancelOrderThunk,
} from "./orderThunk";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    successOrder: null,
    error: null,
  },
  reducers: {
    clearOrderState(state) {
      state.successOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------------- PLACE ORDER ---------------- */
      .addCase(placeOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successOrder = action.payload;
        // Instantly prepend the new order so it appears right away
        if (action.payload) {
          state.orders.unshift(action.payload);
        }
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- GET ORDERS ---------------- */
      .addCase(getOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;

        // Explicitly handle both array responses or object-wrapped responses
        if (Array.isArray(action.payload)) {
          state.orders = action.payload;
        } else if (
          action.payload?.orders &&
          Array.isArray(action.payload.orders)
        ) {
          state.orders = action.payload.orders;
        } else {
          state.orders = [];
        }
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllAdminOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;

        // Handle object response wrapper containing pagination info and orders array
        if (action.payload && Array.isArray(action.payload.orders)) {
          state.orders = action.payload.orders;
          state.totalPages = action.payload.totalPages || 1;
          state.totalOrders =
            action.payload.totalOrders || action.payload.orders.length;
        } else if (Array.isArray(action.payload)) {
          // Fallback if it's just a raw array
          state.orders = action.payload;
          state.totalPages = 1;
          state.totalOrders = action.payload.length;
        } else {
          state.orders = [];
        }
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id,
        );
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(updatePaymentStatusThunk.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id,
        );
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
