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

export const fetchAllProductsPaginated = createAsyncThunk(
  "product/fetchAllProductsPaginated",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `https://trustreviews.onrender.com/products/${page}/{size}/paging?size=${size}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: null, // Thay đổi từ mảng [] thành null để lưu 1 object
    allProducts: [],
    allProductsPagination: null,
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
        state.product = payload; // Lưu trực tiếp payload (là 1 object) vào state.product
      })
      .addCase(fetchProductApiById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Các case khác giữ nguyên
      .addCase(createProductApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProductApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.message) {
          state.error = payload;
        } else {
          state.product = payload; // Cập nhật sản phẩm mới tạo
        }
        console.log("Fulfilled payload:", JSON.stringify(payload, null, 2));
      })
      .addCase(createProductApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(fetchAllProductsPaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.allProducts = [];
        state.allProductsPagination = null;
      })
      .addCase(fetchAllProductsPaginated.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload && payload.content && Array.isArray(payload.content)) {
          state.allProducts = payload.content;
          state.allProductsPagination = {
            totalPages: payload.totalPages,
            totalElements: payload.totalElements,
            number: payload.number,
            size: payload.size,
            first: payload.first,
            last: payload.last,
          };
        } else if (Array.isArray(payload)) {
          state.allProducts = payload;
          state.allProductsPagination = null;
        } else {
          state.allProducts = [];
          state.allProductsPagination = null;
          console.warn("Unexpected payload structure for all products:", payload);
        }
      })
      .addCase(fetchAllProductsPaginated.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.allProducts = [];
        state.allProductsPagination = null;
      });
  },
});

export default productSlice.reducer;
