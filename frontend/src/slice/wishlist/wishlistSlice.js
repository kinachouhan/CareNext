import { createSlice } from "@reduxjs/toolkit";
import { clearWishlistThunk, getWishlistThunk, toggleWishlistThunk } from "./wishlistThunk";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlistThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlistThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getWishlistThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlistThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearWishlistThunk.fulfilled, (state) => {
  state.items = [];
});
  },
});

export default wishlistSlice.reducer;