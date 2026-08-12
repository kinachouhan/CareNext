import { createSlice } from "@reduxjs/toolkit";
import {
  getWishlistThunk,
  toggleWishlistThunk,
  clearWishlistThunk,
  syncWishlistThunk,
} from "./wishlistThunk";

/* ----------------------------- Guest Wishlist ----------------------------- */

const getGuestWishlist = () => {
  try {
    const data = JSON.parse(localStorage.getItem("guest_wishlist"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveGuestWishlist = (items) => {
  localStorage.setItem("guest_wishlist", JSON.stringify(Array.isArray(items) ? items : []));
};

/* ---------------------------- Initial State --------------------------- */

const initialState = {
  items: getGuestWishlist(),
  loading: false,
  error: null,
};

/* ------------------------------ Slice -------------------------------- */

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      saveGuestWishlist(state.items);
    },
    removeFromWishlist(state, action) {
      if (!Array.isArray(state.items)) state.items = [];
      state.items = state.items.filter(
        (item) => (item._id || item.id || item) !== action.payload
      );
      saveGuestWishlist(state.items); // Ensures localStorage stays updated for guests
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem("guest_wishlist");
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------------- GET WISHLIST ---------------- */
      .addCase(getWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        saveGuestWishlist(state.items); // Persist fetched data locally for guests
      })
      .addCase(getWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- TOGGLE WISHLIST ---------------- */
      .addCase(toggleWishlistThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        saveGuestWishlist(state.items);
      })
      .addCase(toggleWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- CLEAR WISHLIST ---------------- */
      .addCase(clearWishlistThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        localStorage.removeItem("guest_wishlist");
      })
      .addCase(clearWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- SYNC WISHLIST ---------------- */
      .addCase(syncWishlistThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(syncWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* ----------------------------- Actions ----------------------------- */

export const { setWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

/* ---------------------------- Selectors (Safe) ---------------------------- */

export const selectWishlistItems = (state) => state.wishlist?.items || [];

export const selectWishlistLoading = (state) => state.wishlist?.loading || false;

export const selectWishlistError = (state) => state.wishlist?.error || null;

export const selectWishlistCount = (state) => {
  const items = state.wishlist?.items;
  return Array.isArray(items) ? items.length : 0;
};

export default wishlistSlice.reducer;