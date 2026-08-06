import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const addProductThunk = createAsyncThunk(
  "/products/add",
  async (formData, thunkApi) => {
    try {
      const response = await api.post("/products/add", formData);
      return response.data.product;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to add product",
      );
    }
  },
);

export const getProductsThunk = createAsyncThunk(
  "products",
  async (_, thunkApi) => {
    try {
      const response = await api.get("/products");
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to get product",
      );
    }
  },
);

export const deleteProductThunk = createAsyncThunk(
  "product/delete",
  async (id, thunkApi) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

export const updateProductThunk = createAsyncThunk(
  "product/update",
  async ({id, formData}, thunkApi) => {
    try {
      let response = await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);



export const getProductByIdThunk = createAsyncThunk(
  "product/getById",
  async (id, thunkApi) => {
    try {
      const response = await api.get(`/products/${id}`);

      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to get product"
      );
    }
  }
);


