import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";
import { fetchReviewsByIdPaginated } from "./reviewSlice"; // Import action để lấy đánh giá

// Hàm tính averageRating từ danh sách reviews
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
};

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
  async ({ page, size, categories }, { rejectWithValue, dispatch }) => {
    try {
      let url = `https://trustreviews.onrender.com/products/${page}/{size}/paging?size=${size}`;
      if (categories) {
        url += `&categories=${categories}`;
      }
      const response = await fetcher.get(url);

      // Fetch đánh giá cho từng sản phẩm để tính averageRating
      const products = response.data.content || [];
      const enrichedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            const reviewsResponse = await dispatch(
              fetchReviewsByIdPaginated({ id: product.id, page: 0, size: 100 }) // Lấy tất cả đánh giá
            ).unwrap();
            const reviews = reviewsResponse.content || [];
            const averageRating = calculateAverageRating(reviews);
            return { ...product, averageRating, reviewCount: reviews.length };
          } catch (error) {
            console.error(
              `Error fetching reviews for product ${product.id}:`,
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
        console.log("Fulfilled payload:", JSON.stringify(payload, null, 2));
      })
      .addCase(createProductApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(fetchAllProductsPaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.allProducts = [];
        state.allProductsPagination = null;
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
        } else if (Array.isArray(payload)) {
          state.allProducts = payload;
          state.allProductsPagination = null;
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
      });
  },
});

export default productSlice.reducer;
