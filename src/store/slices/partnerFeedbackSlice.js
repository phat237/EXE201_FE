import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

const API_URL = "https://trustreviews.onrender.com/partner-feedback";

// Async thunk để fetch danh sách phản hồi đối tác
export const fetchPartnerFeedback = createAsyncThunk(
  "partnerFeedback/fetchPartnerFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để fetch phản hồi đối tác theo ID
export const fetchPartnerFeedbackById = createAsyncThunk(
  "partnerFeedback/fetchPartnerFeedbackById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để tạo feedback cho một review cụ thể của đối tác
export const createPartnerReviewFeedback = createAsyncThunk(
  "partnerFeedback/createPartnerReviewFeedback",
  async ({ reviewId, feedbackData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(
        `${API_URL}/${reviewId}`,
        feedbackData
      );
      // Assuming the API returns the newly created feedback object
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để update feedback cho một review cụ thể của đối tác
export const updatePartnerReviewFeedback = createAsyncThunk(
  "partnerFeedback/updatePartnerReviewFeedback",
  async ({ reviewId, feedbackData }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(
        `${API_URL}/${reviewId}`,
        feedbackData
      );
      // Assuming the API returns the updated feedback object
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để xóa feedback của đối tác theo ID
export const deletePartnerFeedback = createAsyncThunk(
  "partnerFeedback/deletePartnerFeedback",
  async (id, { rejectWithValue }) => {
    try {
      // Assuming the API returns success or the deleted ID upon successful deletion
      await fetcher.delete(`${API_URL}/${id}`);
      return id; // Return the ID to update the state
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const partnerFeedbackSlice = createSlice({
  name: "partnerFeedback",
  initialState: {
    feedback: [],
    selectedFeedback: null, // State mới để lưu phản hồi theo ID
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnerFeedback.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.feedback = Array.isArray(payload) ? payload : [payload];
      })
      .addCase(fetchPartnerFeedback.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Thêm xử lý cho fetchPartnerFeedbackById
      .addCase(fetchPartnerFeedbackById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedFeedback = null; // Reset selectedFeedback khi pending
      })
      .addCase(fetchPartnerFeedbackById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.selectedFeedback = payload; // Lưu phản hồi theo ID
      })
      .addCase(fetchPartnerFeedbackById.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.selectedFeedback = null; // Reset selectedFeedback khi lỗi
      })
      // Thêm xử lý cho createPartnerReviewFeedback
      .addCase(createPartnerReviewFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPartnerReviewFeedback.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Add the newly created feedback to the feedback list
        // Check if the payload is an object before adding
        if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
          state.feedback = [...state.feedback, payload];
        } else {
           // Optionally handle cases where API doesn't return a valid object on creation
           console.warn("Create partner review feedback fulfilled but received invalid payload:", payload);
        }
      })
      .addCase(createPartnerReviewFeedback.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Thêm xử lý cho updatePartnerReviewFeedback
      .addCase(updatePartnerReviewFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePartnerReviewFeedback.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Update the feedback item in the feedback list
        state.feedback = state.feedback.map(item =>
          item.id === payload.id ? payload : item
        );
      })
      .addCase(updatePartnerReviewFeedback.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Thêm xử lý cho deletePartnerFeedback
      .addCase(deletePartnerFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePartnerFeedback.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Remove the deleted feedback item from the feedback list by ID
        state.feedback = state.feedback.filter(item => item.id !== payload);
      })
      .addCase(deletePartnerFeedback.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export default partnerFeedbackSlice.reducer; 