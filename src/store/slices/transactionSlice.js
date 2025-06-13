import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

export const transactionDepositApi = createAsyncThunk(
  "transaction/deposit",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Gửi dữ liệu tới API deposit:", data);
      const response = await fetcher.post("/transactions/deposit", data);
      console.log("Phản hồi đầy đủ từ API deposit:", response.data);
      if (!response.data.checkoutUrl) {
        console.warn("Checkout URL không được trả về:", response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Lỗi API deposit:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transaction: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(transactionDepositApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(transactionDepositApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.transaction = payload;
      })
      .addCase(transactionDepositApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export default transactionSlice.reducer;