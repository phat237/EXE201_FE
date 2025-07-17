import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

// Async thunk để gọi API lấy tổng lượt xem theo thương hiệu
export const totalViewProductByBrand = createAsyncThunk(
  "dashboard/totalViewProductByBrand",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get("/products/total-views-by-brand");
    
      return response.data;
    } catch (error) {
     
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const totalCoutByPartner = createAsyncThunk(
    "dashboard/totalCoutByPartner",
    async(_, {rejectWithValue})  => {
        try {
            const response = await fetcher.get("/products/count-by-partner");
            return response.data
        } catch (error) {
              return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const reviewTotalByBrand = createAsyncThunk(
    "dashboard/reviewTotalByBrand",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/reviews/total-by-brand")
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const averageRating = createAsyncThunk(
    "dashboard/averageRating",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/reviews/average-rating-by-brand")
            return response.data
        } catch (error) {
             return rejectWithValue(error.response?.data || error.message);
        }
    }
)

// Tạo slice cho dashboard
export const dashboardPartnerSlice = createSlice({
  name: "dashboard",
  initialState: {
    totalViewProductByBrand: [],
    totalCoutByPartner:[],
    reviewTotalByBrand:[],
    averageRating:[],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(totalViewProductByBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(totalViewProductByBrand.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.totalViewProductByBrand = payload;
      })
      .addCase(totalViewProductByBrand.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(totalCoutByPartner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(totalCoutByPartner.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.totalCoutByPartner = payload;
      })
      .addCase(totalCoutByPartner.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(reviewTotalByBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reviewTotalByBrand.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.reviewTotalByBrand = payload;
      })
      .addCase(reviewTotalByBrand.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(averageRating.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(averageRating.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.averageRating = payload;
      })
      .addCase(averageRating.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
  },
});

// Export reducer
export default dashboardPartnerSlice.reducer;