import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, registerThunk, getMeThunk, logoutThunk } from "./authThunk";

const initialState = {
  user: null, 
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload; 
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getMeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
      
        state.error = action.payload;
      });

  },
});

export default authSlice.reducer;