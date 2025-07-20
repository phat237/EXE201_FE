import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

export const checkoutSuccessApi = createAsyncThunk(
  "checkout/checkoutSuccessApi",
  async ({ orderCode, partnerId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.currentUser?.token || state.auth.currentUser?.accessToken;
      const response = await fetcher.post(
        `/transactions/success/${orderCode}/${partnerId}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi API deposit:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkoutFailApi = createAsyncThunk(
  "checkout/checkoutFailApi",
  async ({ orderCode }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.currentUser?.token || state.auth.currentUser?.accessToken;
      const response = await fetcher.post(
        `/transactions/fail/${orderCode}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi API deposit:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkoutSuccessApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkoutSuccessApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.checkout = payload;
      })
      .addCase(checkoutSuccessApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(checkoutFailApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkoutFailApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.checkout = payload;
      })
      .addCase(checkoutFailApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export default checkoutSlice.reducer;
