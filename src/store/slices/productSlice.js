import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";
import { averageRating } from "./reviewSlice"; // Chỉ import averageRating

export const fetchProductApiById = createAsyncThunk(
  "product/fetchProductApi",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const createProductApi = createAsyncThunk(
  "product/createProductApi",
  async ({ data, category }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(`/products/${category}`, data);
      if (
        !response.data ||
        typeof response.data !== "object" ||
        Object.keys(response.data).length === 0
      ) {
        return { message: "API trả về dữ liệu không hợp lệ hoặc rỗng" };
      }
      return response.data;
    } catch (error) {
      console.error(
        "Create product error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response ? error.response.data : { message: error.message }
      );
    }
  }
);

export const fetchAllProductsPaginated = createAsyncThunk(
  "product/fetchAllProductsPaginated",
  async ({ page, size, categories, ratings, sortBy }, { rejectWithValue, dispatch }) => {
    try {
      let url = `https://trustreviews.onrender.com/products/${page}/${size}/paging?size=${size}`;
      if (categories && categories.length > 0) {
        url += `&categories=${categories.join(",")}`;
      }
      if (ratings && ratings.length > 0) {
        url += `&ratings=${ratings.join(",")}`;
      }
      if (sortBy) {
        url += `&sortBy=${sortBy}`;
      }
      
      console.log("Calling API with URL:", url);
      console.log("API parameters:", { page, size, categories, ratings, sortBy });
      
      const response = await fetcher.get(url);
      console.log("API response:", response.data);
      
      // Kiểm tra categories của các sản phẩm trả về
      const products = response.data.content || [];
      console.log("Products returned:", products.length);
      console.log("Categories in response:", products.map(p => ({ id: p.id, name: p.name, category: p.category })));
      
      // Kiểm tra xem có sản phẩm nào thuộc category được filter không
      if (categories && categories.length > 0) {
        const filteredProducts = products.filter(p => categories.includes(p.category));
        console.log("Products matching filter categories:", filteredProducts.length);
        console.log("Matching products:", filteredProducts.map(p => ({ id: p.id, name: p.name, category: p.category })));
      }

      // Fetch average rating for each product
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
        ...response.data,
        content: enrichedProducts,
      };
    } catch (error) {
      console.error("API error:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchSortedRating = createAsyncThunk(
  "product/fetchSortedRating",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `/products/sorted-by-rating?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: null,
    allProducts: [],
    allProductsPagination: null,
    isLoading: false,
    error: null,
    topRatedProducts: [],
    isLoadingTopRated: false,
    errorTopRated: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductApiById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductApiById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.product = payload;
      })
      .addCase(fetchProductApiById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(createProductApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProductApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        if (payload.message) {
          state.error = payload;
        } else {
          state.product = payload;
        }
      })
      .addCase(createProductApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(fetchAllProductsPaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsPaginated.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (payload && payload.content && Array.isArray(payload.content)) {
          state.allProducts = payload.content;
          state.allProductsPagination = {
            totalPages: payload.totalPages,
            totalElements: payload.totalElements,
            number: payload.number,
            size: payload.size,
            first: payload.first,
            last: payload.last,
          };
        } else {
          state.allProducts = [];
          state.allProductsPagination = null;
          console.warn(
            "Unexpected payload structure for all products:",
            payload
          );
        }
      })
      .addCase(fetchAllProductsPaginated.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.allProducts = [];
        state.allProductsPagination = null;
      })
      .addCase(fetchSortedRating.pending, (state) => {
        state.isLoadingTopRated = true;
        state.errorTopRated = null;
      })
      .addCase(fetchSortedRating.fulfilled, (state, { payload }) => {
        state.isLoadingTopRated = false;
        state.errorTopRated = null;
        state.topRatedProducts = payload.content;
      })
      .addCase(fetchSortedRating.rejected, (state, { payload }) => {
        state.isLoadingTopRated = false;
        state.errorTopRated = payload;
        state.topRatedProducts = [];
      });
  },
});

export default productSlice.reducer;