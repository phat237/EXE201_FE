import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

// API endpoint
const API_URL = 'https://trustreviews.onrender.com/vouchers';

// Async thunk để fetch danh sách voucher
export const fetchVouchers = createAsyncThunk(
  "vouchers/fetchVouchers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để Tạo Voucher
export const bulkCreateVouchers = createAsyncThunk(
  "voucher/bulkCreateVouchers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("https://trustreviews.onrender.com/vouchers/bulk-create", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để cập nhật nhiều voucher
export const batchUpdateVouchers = createAsyncThunk(
  "voucher/batchUpdateVouchers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.put("https://trustreviews.onrender.com/vouchers/batch-update", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để xóa voucher theo id
export const deleteVoucher = createAsyncThunk(
  "voucher/deleteVoucher",
  async (id, { rejectWithValue }) => {
    try {
      await fetcher.delete(`https://trustreviews.onrender.com/vouchers/${id}`);
      return id; // Trả về id để cập nhật lại state
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const voucherSlice = createSlice({
  name: "vouchers",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(bulkCreateVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateVouchers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        // Có thể push payload vào vouchers nếu muốn cập nhật ngay giao diện
        // state.vouchers = [...state.vouchers, ...payload];
      })
      .addCase(bulkCreateVouchers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(batchUpdateVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batchUpdateVouchers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        // Nếu muốn cập nhật lại danh sách vouchers trong state:
        // state.vouchers = payload;
      })
      .addCase(batchUpdateVouchers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVoucher.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        // Xóa voucher khỏi danh sách vouchers trong state
        state.data = state.data.filter(voucher => voucher.id !== payload);
      })
      .addCase(deleteVoucher.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default voucherSlice.reducer;
