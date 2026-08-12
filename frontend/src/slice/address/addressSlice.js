import { createSlice } from "@reduxjs/toolkit";
import { getAddressesThunk, addAddressThunk, deleteAddressThunk, updateAddressThunk } from "./addressThunk";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAddressesThunk.pending, (state) => { state.loading = true; })
      .addCase(getAddressesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getAddressesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddressThunk.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(updateAddressThunk.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
  },
});

export default addressSlice.reducer;