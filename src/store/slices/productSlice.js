import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

export const fetchProductApiById = createAsyncThunk(
  "product/fetchProductApi",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const createProductApi = createAsyncThunk(
  "product/createProductApi",
  async ({ data, category }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/products/${category}`, data);

      if (
        !response.data ||
        typeof response.data !== "object" ||
        Object.keys(response.data).length === 0
      ) {
        return { message: "API trả về dữ liệu không hợp lệ hoặc rỗng" };
      }
      return response.data;
    } catch (error) {
      console.error(
        "Create product error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductApiById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductApiById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.product = Array.isArray(payload) ? payload : [payload];
      })
      .addCase(fetchProductApiById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(createProductApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProductApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.message) {
          state.error = payload;
        } else {
          state.product = [...state.product, payload];
        }
        console.log("Fulfilled payload:", JSON.stringify(payload, null, 2));
      })
      .addCase(createProductApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export default productSlice.reducer;
