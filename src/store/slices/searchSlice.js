import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

export const searchApi = createAsyncThunk(
  "search/searchApi",
  async ({ keyword, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetcher(
        `/products/search/paging?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
      );
      console.log("API response in slice:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchResults: [],
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchApi.fulfilled, (state, action) => {
        state.isLoading = false;
        // Nếu action.payload có .content thì lấy luôn, nếu có .data.content thì lấy .data.content
        state.searchResults = action.payload.content
          ? action.payload.content
          : action.payload.data?.content || [];
        state.pagination = action.payload.content
          ? action.payload
          : action.payload.data || null;
      })
      .addCase(searchApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export default searchSlice.reducer;