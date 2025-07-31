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
      monthlyViews: 0,
      topProducts: []
    },
    summary: {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      totalCategories: 0
    },
    newProductGrowth: {
      previousWeekCount: 0,
      currentWeekCount: 0,
      growthPercentage: 0
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
        monthlyViews: 0,
        topProducts: []
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
        previousWeekCount: 0,
        currentWeekCount: 0,
        growthPercentage: 0
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
        // API trả về dữ liệu với cấu trúc mới
        state.viewStats = {
          totalViews: payload.totalViewCount || 0,
          dailyViews: payload.dailyViewCount || 0,
          weeklyViews: payload.weeklyViewCount || 0,
          monthlyViews: payload.monthlyViewCount || 0,
          topProducts: payload.topViewProducts || []
        };
      })
      .addCase(fetchProductViewStatsApi.rejected, (state, { payload }) => {
        state.isLoading.viewStats = false;
        state.error.viewStats = payload;
        state.viewStats = {
          totalViews: 0,
          dailyViews: 0,
          weeklyViews: 0,
          monthlyViews: 0,
          topProducts: []
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
        // API trả về dữ liệu với cấu trúc mới
        const categoryCounts = payload.categoryCounts || {};
        const totalCategories = Object.keys(categoryCounts).filter(key => categoryCounts[key] > 0).length;
        
        state.summary = {
          totalProducts: payload.totalProducts || 0,
          activeProducts: payload.activeProducts || 0,
          inactiveProducts: payload.inactiveProducts || 0,
          totalCategories: totalCategories
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
        // API trả về dữ liệu với cấu trúc mới
        state.newProductGrowth = {
          previousWeekCount: payload.previousWeekCount || 0,
          currentWeekCount: payload.currentWeekCount || 0,
          growthPercentage: payload.growthPercentage || 0
        };
      })
      .addCase(fetchNewProductGrowthApi.rejected, (state, { payload }) => {
        state.isLoading.newProductGrowth = false;
        state.error.newProductGrowth = payload;
        state.newProductGrowth = {
          previousWeekCount: 0,
          currentWeekCount: 0,
          growthPercentage: 0
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
        
        // API trả về dữ liệu với cấu trúc mới: {LAPTOP: 4.49, DIEN_THOAI: 4.48}
        const categoryRatings = payload || {};
        const categories = Object.keys(categoryRatings);
        const ratings = Object.values(categoryRatings);
        
        // Tính đánh giá trung bình tổng
        const overallRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
        
        // Chuyển đổi thành format phù hợp cho component
        const ratingDistribution = categories.map(category => ({
          category: category,
          avgRating: categoryRatings[category],
          reviewCount: 1 // Giả sử mỗi danh mục có ít nhất 1 đánh giá
        }));
        
        state.avgRating = {
          overallRating: overallRating,
          totalReviews: categories.length,
          ratingDistribution: ratingDistribution
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