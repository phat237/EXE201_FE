import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";


export const getFeedbackPartner = createAsyncThunk(
    "feedbackPartner/getFeedbackPartner",
    async({reviewId}, {rejectWithValue}) => {
        try {
            const response = await fetcher.get(`/partner-feedback/can-feedback?reviewId=${reviewId}`)
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const createFeedbackPartner = createAsyncThunk(
    "feedbackPartner/createFeedbackPartner",
    async({reviewId, content}, {rejectWithValue}) => {
        try {
            // Lấy token từ localStorage
            const currentUserStr = localStorage.getItem("currentUser");
            let accessToken = null;
            if (currentUserStr) {
                try {
                    const currentUser = JSON.parse(currentUserStr);
                    accessToken = currentUser.token;
                } catch {
                    // Bỏ qua lỗi parse
                }
            }
            const response = await fetcher.post(
                `/partner-feedback/${reviewId}`,
                { content }, // gửi content lên backend
                accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
            );
            return response.data
        } catch (error) {
             return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const getAllFeedback = createAsyncThunk(
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/partner-feedback")
            return response.data
        } catch (error) {
             return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)



const feedbackSlice = createSlice({
    name:"feedbackPartner",
    initialState:{
        feedbackPartner:[],
        feedbackALL:[],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
builder.addCase(getFeedbackPartner.pending, (state) => {
    state.isLoading = true
})
.addCase(getFeedbackPartner.fulfilled, (state, {payload}) => {
 state.isLoading = false;
 state.error = null;
 state.feedbackPartner = payload
})
.addCase(getFeedbackPartner.rejected, (state, {payload}) => {
    state.error = payload
    state.isLoading = false
})
.addCase(createFeedbackPartner.pending, (state) => {
    state.isLoading = true
})
.addCase(createFeedbackPartner.fulfilled, (state, {payload}) => {
 state.isLoading = false;
 state.error = null;
 state.feedbackPartner = payload
})
.addCase(createFeedbackPartner.rejected, (state, {payload}) => {
    state.error = payload
    state.isLoading = false
})
.addCase(getAllFeedback.pending, (state) => {
    state.isLoading = true
})
.addCase(getAllFeedback.fulfilled, (state, {payload}) => {
 state.isLoading = false;
 state.error = null;
 state.feedbackPartner = payload
})
.addCase(getAllFeedback.rejected, (state, {payload}) => {
    state.error = payload
    state.isLoading = false
})
    }
})

export default feedbackSlice.reducer