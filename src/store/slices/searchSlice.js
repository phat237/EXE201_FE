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
      
      console.log("Search API URL:", url);
      console.log("Search parameters:", { keyword, page, size, categories, ratings, sortBy });
      
      const response = await fetcher(url);
      console.log("Search API response:", response);
      
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
              reviewCount: ratingResponse.reviewCount || 0,
            };
          } catch (error) {
            console.error(
              `Error fetching average rating for product ${product.id}:`,
              error
            );
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