import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

// Async thunk để fetch danh sách review theo ID review và có phân trang
export const fetchReviewsPaginated = createAsyncThunk(
  "review/fetchReviewsPaginated",
  async ({ reviewId, page, size }, { rejectWithValue }) => {
    try {
      // Xây dựng URL theo cấu trúc được cung cấp và truyền page, size qua query params
      const response = await fetcher.get(
        `https://trustreviews.onrender.com/reviews/${reviewId}/{page}/{size}/paging?page=${page}&size=${size}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để fetch danh sách review theo productId
export const fetchReviewsByProductId = createAsyncThunk(
  "review/fetchReviewsByProductId",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(
        `https://trustreviews.onrender.com/reviews/review/${productId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message  
      );
    }
  }
);

// Async thunk để tạo review mới cho một product theo ID
export const createProductReview = createAsyncThunk(
  "review/createProductReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `https://trustreviews.onrender.com/reviews/${productId}`,
        reviewData // Dữ liệu review cần gửi lên
      );
      // Giả định API trả về object review vừa được tạo
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để đánh dấu review là hữu ích/không hữu ích
export const markReviewHelpful = createAsyncThunk(
  "review/markReviewHelpful",
  async ({ reviewId, status }, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST với reviewId trong path và status qua query parameter
      // Cần kiểm tra lại API endpoint chính xác và cách truyền status (query/body).
      // Giả định endpoint là POST /reviews/{reviewId}/helpful và status là query param.
      const response = await fetcher.post(
                `https://trustreviews.onrender.com/reviews/helpful/${reviewId}/{status}?status=${status}`// Adjusted URL slightly based on common patterns
      );
      // Giả định API trả về object review đã được cập nhật trạng thái helpful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để update review theo ID
export const updateProductReview = createAsyncThunk(
  "review/updateProductReview",
  async ({ id, updatedReviewData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(
        `https://trustreviews.onrender.com/reviews/${id}`,
        updatedReviewData // Dữ liệu review đã cập nhật cần gửi lên
      );
      // Giả định API trả về object review đã được cập nhật
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để xóa review theo ID
export const deleteProductReview = createAsyncThunk(
  "review/deleteProductReview",
  async (id, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu DELETE đến URL với ID của review
      await fetcher.delete(`https://trustreviews.onrender.com/reviews/${id}`);
      // Trả về ID của review đã xóa để cập nhật state
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [], // Danh sách reviews
    pagination: null, // Thông tin phân trang nếu API trả về
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsPaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewsPaginated.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Kiểm tra cấu trúc payload. Nếu payload chứa danh sách reviews và thông tin phân trang
        if (payload && payload.content && Array.isArray(payload.content)) {
            state.reviews = payload.content;
            // Giả định API trả về cấu trúc { content: [...], totalPages: N, totalElements: M, ... }
            state.pagination = {
                totalPages: payload.totalPages,
                totalElements: payload.totalElements,
                // Thêm các thông tin phân trang khác nếu có
            };
        } else if (Array.isArray(payload)) {
             // Trường hợp API chỉ trả về mảng reviews
            state.reviews = payload;
            state.pagination = null; // Không có thông tin phân trang
        } else {
             // Trường hợp payload không như mong đợi, có thể xử lý lỗi hoặc clear state
             state.reviews = [];
             state.pagination = null;
             console.warn("Unexpected payload structure for reviews:", payload);
        }
      })
      .addCase(fetchReviewsPaginated.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.reviews = []; // Xóa reviews khi có lỗi
        state.pagination = null;
      })
      // Thêm xử lý cho createProductReview
      .addCase(createProductReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProductReview.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Thêm review vừa tạo vào danh sách reviews nếu payload hợp lệ
        if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
            // Có thể bạn muốn thêm review này vào state.reviews hoặc refresh lại danh sách reviews chính
            // Tùy thuộc vào luồng dữ liệu mong muốn. Ví dụ: thêm vào cuối danh sách reviews hiện tại
            // state.reviews.push(payload); // hoặc state.reviews = [...state.reviews, payload];
            // Hiện tại, chỉ cập nhật trạng thái loading và error.
            console.log("Review created successfully:", payload);
        } else {
             console.warn("Create product review fulfilled but received invalid payload:", payload);
        }
      })
      .addCase(createProductReview.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Thêm xử lý cho markReviewHelpful
      .addCase(markReviewHelpful.pending, (state) => {
        //state.isLoading = true; // Optional: show loading specifically for this action
        state.error = null;
      })
      .addCase(markReviewHelpful.fulfilled, (state, { payload }) => {
        //state.isLoading = false; // Optional
        // Cập nhật review trong danh sách reviews nếu payload hợp lệ và có id trùng khớp
        if (payload && typeof payload === 'object' && payload.id) {
            state.reviews = state.reviews.map(review =>
                review.id === payload.id ? payload : review // Cập nhật review với dữ liệu mới từ payload
            );
            console.log("Review updated after helpful click:", payload);
        } else {
             console.warn("Mark review helpful fulfilled but received invalid payload or missing ID:", payload);
        }
      })
      .addCase(markReviewHelpful.rejected, (state, { payload }) => {
        //state.isLoading = false; // Optional
        state.error = payload;
        console.error("Failed to mark review helpful:", payload);
      })
      // Thêm xử lý cho updateProductReview
      .addCase(updateProductReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductReview.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Cập nhật review trong danh sách reviews nếu payload hợp lệ và có id trùng khớp
        if (payload && typeof payload === 'object' && payload.id) {
            state.reviews = state.reviews.map(review =>
                review.id === payload.id ? payload : review // Cập nhật review với dữ liệu mới từ payload
            );
        } else {
             console.warn("Update product review fulfilled but received invalid payload or missing ID:", payload);
        }
      })
      .addCase(updateProductReview.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Thêm xử lý cho deleteProductReview
      .addCase(deleteProductReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProductReview.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Lọc bỏ review đã xóa khỏi danh sách reviews dựa vào ID
        state.reviews = state.reviews.filter(review => review.id !== payload);
      })
      .addCase(deleteProductReview.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Thêm xử lý cho fetchReviewsByProductId
      .addCase(fetchReviewsByProductId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProductId.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        if (Array.isArray(payload)) {
          state.reviews = payload;
        } else if (payload && Array.isArray(payload.content)) {
          state.reviews = payload.content;
        } else if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
          // If the API returns a single review object, put it in an array
          state.reviews = [payload];
        } else {
          state.reviews = [];
          console.warn("Unexpected payload structure for product reviews:", payload);
        }
      })
      .addCase(fetchReviewsByProductId.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer; 