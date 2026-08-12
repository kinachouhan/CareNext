import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const getAddressesThunk = createAsyncThunk("address/get", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/addresses", { withCredentials: true });
    return res.data.addresses;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
  }
});

export const addAddressThunk = createAsyncThunk("address/add", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/addresses", formData, { withCredentials: true });
    return res.data.addresses;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add address");
  }
});

export const deleteAddressThunk = createAsyncThunk("address/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/addresses/${id}`, { withCredentials: true });
    return res.data.addresses;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete address");
  }
});

export const updateAddressThunk = createAsyncThunk("address/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/addresses/${id}`, formData, { withCredentials: true });
    return res.data.addresses;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update address");
  }
});