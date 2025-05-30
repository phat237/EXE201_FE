import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

// Async thunk để fetch danh sách các gói thành viên
export const fetchPartnerPackages = createAsyncThunk(
  "partnerPackage/fetchPartnerPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        "https://trustreviews.onrender.com/partner-packages"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để tạo mới partner package
export const createPartnerPackage = createAsyncThunk(
  "partnerPackage/createPartnerPackage",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `https://trustreviews.onrender.com/partner-packages/${id}`,
        data
      );
      if (
        !response.data ||
        typeof response.data !== "object" ||
        Object.keys(response.data).length === 0
      ) {
        return { message: "API trả về dữ liệu không hợp lệ hoặc rỗng" };
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

// Async thunk để fetch các gói thành viên có sẵn
export const fetchAvailablePartnerPackages = createAsyncThunk(
  "partnerPackage/fetchAvailablePartnerPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        "https://trustreviews.onrender.com/partner-packages/available"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để deactivate một partner package
export const deactivatePartnerPackage = createAsyncThunk(
  "partnerPackage/deactivatePartnerPackage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `https://trustreviews.onrender.com/partner-packages/${id}/deactivate`
      );
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const partnerPackageSlice = createSlice({
  name: "partnerPackage",
  initialState: {
    packages: [],
    availablePackages: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnerPackages.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.packages = Array.isArray(payload) ? payload : [payload];
      })
      .addCase(fetchPartnerPackages.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Thêm xử lý cho createPartnerPackage
      .addCase(createPartnerPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPartnerPackage.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.message) {
          state.error = payload;
        } else {
          state.packages = [...state.packages, payload];
        }
      })
      .addCase(createPartnerPackage.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(fetchAvailablePartnerPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailablePartnerPackages.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.availablePackages = Array.isArray(payload) ? payload : [payload];
      })
      .addCase(fetchAvailablePartnerPackages.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(deactivatePartnerPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivatePartnerPackage.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.packages = state.packages.map(pkg =>
          pkg.id === payload.id ? { ...pkg, ...payload } : pkg
        );
        state.availablePackages = state.availablePackages.map(pkg =>
          pkg.id === payload.id ? { ...pkg, ...payload } : pkg
        );
      })
      .addCase(deactivatePartnerPackage.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export default partnerPackageSlice.reducer; 