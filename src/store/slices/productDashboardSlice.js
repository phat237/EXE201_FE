import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

export const fetchProductViewStatsApi = createAsyncThunk(
  "productDashboard/fetchProductViewStatsApi",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const currentUser = state.auth.currentUser;
    const accessToken = currentUser?.token || currentUser?.accessToken;
    
    try {
      const response = await fetcher.get("/products/admin/dashboard/view-stats", {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching product view stats:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchProductSummaryApi = createAsyncThunk(
  "productDashboard/fetchProductSummaryApi",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const currentUser = state.auth.currentUser;
    const accessToken = currentUser?.token || currentUser?.accessToken;
    
    try {
      const response = await fetcher.get("/products/admin/dashboard/summary", {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching product summary:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchNewProductGrowthApi = createAsyncThunk(
  "productDashboard/fetchNewProductGrowthApi",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const currentUser = state.auth.currentUser;
    const accessToken = currentUser?.token || currentUser?.accessToken;
    
    try {
      const response = await fetcher.get("/products/admin/dashboard/new-product-growth", {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching new product growth:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchAvgRatingApi = createAsyncThunk(
  "productDashboard/fetchAvgRatingApi",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const currentUser = state.auth.currentUser;
    const accessToken = currentUser?.token || currentUser?.accessToken;
    
    try {
      const response = await fetcher.get("/products/admin/dashboard/avg-rating", {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const productDashboardSlice = createSlice({
  name: "productDashboard",
  initialState: {
    viewStats: {
      totalViews: 0,
      dailyViews: 0,
      weeklyViews: 0,
      monthlyViews: 0
    },
    summary: {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      totalCategories: 0
    },
    newProductGrowth: {
      weeklyGrowth: [],
      monthlyGrowth: [],
      totalGrowth: 0
    },
    avgRating: {
      overallRating: 0,
      totalReviews: 0,
      ratingDistribution: []
    },
    isLoading: {
      viewStats: false,
      summary: false,
      newProductGrowth: false,
      avgRating: false
    },
    error: {
      viewStats: null,
      summary: null,
      newProductGrowth: null,
      avgRating: null
    }
  },
  reducers: {
    clearViewStats: (state) => {
      state.viewStats = {
        totalViews: 0,
        dailyViews: 0,
        weeklyViews: 0,
        monthlyViews: 0
      };
      state.error.viewStats = null;
    },
    clearSummary: (state) => {
      state.summary = {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        totalCategories: 0
      };
      state.error.summary = null;
    },
    clearNewProductGrowth: (state) => {
      state.newProductGrowth = {
        weeklyGrowth: [],
        monthlyGrowth: [],
        totalGrowth: 0
      };
      state.error.newProductGrowth = null;
    },
    clearAvgRating: (state) => {
      state.avgRating = {
        overallRating: 0,
        totalReviews: 0,
        ratingDistribution: []
      };
      state.error.avgRating = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // View Stats
      .addCase(fetchProductViewStatsApi.pending, (state) => {
        state.isLoading.viewStats = true;
        state.error.viewStats = null;
      })
      .addCase(fetchProductViewStatsApi.fulfilled, (state, { payload }) => {
        state.isLoading.viewStats = false;
        state.error.viewStats = null;
        state.viewStats = {
          totalViews: payload.totalViews || 0,
          dailyViews: payload.dailyViews || 0,
          weeklyViews: payload.weeklyViews || 0,
          monthlyViews: payload.monthlyViews || 0
        };
      })
      .addCase(fetchProductViewStatsApi.rejected, (state, { payload }) => {
        state.isLoading.viewStats = false;
        state.error.viewStats = payload;
        state.viewStats = {
          totalViews: 0,
          dailyViews: 0,
          weeklyViews: 0,
          monthlyViews: 0
        };
      })
      // Summary
      .addCase(fetchProductSummaryApi.pending, (state) => {
        state.isLoading.summary = true;
        state.error.summary = null;
      })
      .addCase(fetchProductSummaryApi.fulfilled, (state, { payload }) => {
        state.isLoading.summary = false;
        state.error.summary = null;
        state.summary = {
          totalProducts: payload.totalProducts || 0,
          activeProducts: payload.activeProducts || 0,
          inactiveProducts: payload.inactiveProducts || 0,
          totalCategories: payload.totalCategories || 0
        };
      })
      .addCase(fetchProductSummaryApi.rejected, (state, { payload }) => {
        state.isLoading.summary = false;
        state.error.summary = payload;
        state.summary = {
          totalProducts: 0,
          activeProducts: 0,
          inactiveProducts: 0,
          totalCategories: 0
        };
      })
      // New Product Growth
      .addCase(fetchNewProductGrowthApi.pending, (state) => {
        state.isLoading.newProductGrowth = true;
        state.error.newProductGrowth = null;
      })
      .addCase(fetchNewProductGrowthApi.fulfilled, (state, { payload }) => {
        state.isLoading.newProductGrowth = false;
        state.error.newProductGrowth = null;
        state.newProductGrowth = {
          weeklyGrowth: payload.weeklyGrowth || [],
          monthlyGrowth: payload.monthlyGrowth || [],
          totalGrowth: payload.totalGrowth || 0
        };
      })
      .addCase(fetchNewProductGrowthApi.rejected, (state, { payload }) => {
        state.isLoading.newProductGrowth = false;
        state.error.newProductGrowth = payload;
        state.newProductGrowth = {
          weeklyGrowth: [],
          monthlyGrowth: [],
          totalGrowth: 0
        };
      })
      // Average Rating
      .addCase(fetchAvgRatingApi.pending, (state) => {
        state.isLoading.avgRating = true;
        state.error.avgRating = null;
      })
      .addCase(fetchAvgRatingApi.fulfilled, (state, { payload }) => {
        state.isLoading.avgRating = false;
        state.error.avgRating = null;
        state.avgRating = {
          overallRating: payload.overallRating || 0,
          totalReviews: payload.totalReviews || 0,
          ratingDistribution: payload.ratingDistribution || []
        };
      })
      .addCase(fetchAvgRatingApi.rejected, (state, { payload }) => {
        state.isLoading.avgRating = false;
        state.error.avgRating = payload;
        state.avgRating = {
          overallRating: 0,
          totalReviews: 0,
          ratingDistribution: []
        };
      });
  },
});

export const { 
  clearViewStats, 
  clearSummary, 
  clearNewProductGrowth, 
  clearAvgRating 
} = productDashboardSlice.actions;
export default productDashboardSlice.reducer;

// Selectors
export const selectViewStats = (state) => state.productDashboard.viewStats;
export const selectViewStatsLoading = (state) => state.productDashboard.isLoading.viewStats;
export const selectViewStatsError = (state) => state.productDashboard.error.viewStats;

export const selectSummary = (state) => state.productDashboard.summary;
export const selectSummaryLoading = (state) => state.productDashboard.isLoading.summary;
export const selectSummaryError = (state) => state.productDashboard.error.summary;

export const selectNewProductGrowth = (state) => state.productDashboard.newProductGrowth;
export const selectNewProductGrowthLoading = (state) => state.productDashboard.isLoading.newProductGrowth;
export const selectNewProductGrowthError = (state) => state.productDashboard.error.newProductGrowth;

export const selectAvgRating = (state) => state.productDashboard.avgRating;
export const selectAvgRatingLoading = (state) => state.productDashboard.isLoading.avgRating;
export const selectAvgRatingError = (state) => state.productDashboard.error.avgRating; 