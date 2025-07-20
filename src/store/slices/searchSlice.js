import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";
import { averageRating } from "./reviewSlice"; // Import averageRating

export const searchApi = createAsyncThunk(
  "search/searchApi",
  async ({ keyword, page = 0, size = 10, categories = [], ratings = [], sortBy = "popular" }, { rejectWithValue, dispatch }) => {
    try {
      let url = `/products/search/paging?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
      
      // Thêm filter parameters nếu có
      if (categories && categories.length > 0) {
        url += `&categories=${categories.join(",")}`;
      }
      if (ratings && ratings.length > 0) {
        url += `&ratings=${ratings.join(",")}`;
      }
      if (sortBy) {
        url += `&sortBy=${sortBy}`;
      }
      
     
      
      const response = await fetcher(url);
    
      
      const products = response.content || response.data?.content || [];
      
      // Fetch average rating for each product (giống như trong productSlice)
      const enrichedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            const ratingResponse = await dispatch(
              averageRating(product.id)
            ).unwrap();
            return {
              ...product,
              averageRating: ratingResponse.averageRating || 0,
              reviewCount: ratingResponse.totalReviewers || 0, // Lấy đúng trường
            };
          } catch {
            return { ...product, averageRating: 0, reviewCount: 0 };
          }
        })
      );

      return {
        ...response,
        content: enrichedProducts,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchCategory = createAsyncThunk(
  "search/searchCategory",
  async({category,page, size }, {rejectWithValue, dispatch}) => {
    try {
      const response = await fetcher.get(`/products/search-by-category?category=${category}&page=${page}&size=${size}`)
      
      const products = response.data.content || response.data?.content || [];
      
      // Fetch average rating for each product (giống như trong searchApi)
      const enrichedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            const ratingResponse = await dispatch(
              averageRating(product.id)
            ).unwrap();
            return {
              ...product,
              averageRating: ratingResponse.averageRating || 0,
              reviewCount: ratingResponse.totalReviewers || 0, // Lấy đúng trường
            };
          } catch {
            return { ...product, averageRating: 0, reviewCount: 0 };
          }
        })
      );

      return {
        ...response.data,
        content: enrichedProducts,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchResults: [],
    searchCategory: {},
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
      })
      .addCase(searchCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(searchCategory.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        state.error = null;
        state.searchCategory = payload; // payload nên có content, totalPages
      })
      .addCase(searchCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Lỗi không xác định";
      })
  },
});

export default searchSlice.reducer;