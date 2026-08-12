import { createSlice } from "@reduxjs/toolkit";
import { placeOrderThunk, getOrdersThunk } from "./orderThunk";

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
        // Optionally prepend the new order directly into the array for instant UI update
        state.orders.unshift(action.payload);
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
        state.orders = action.payload;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;