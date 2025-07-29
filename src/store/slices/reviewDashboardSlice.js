import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";


export const getReviewVerification = createAsyncThunk(
    "reviewDashboard/getReviewVerification",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/reviews/admin/dashboard/verification-stats")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const getReviewSummary = createAsyncThunk(
    "reviewDashboard/getReviewSummary",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/reviews/admin/dashboard/summary")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const getNewReviewGrowth = createAsyncThunk(
    "reviewDashboard/getNewReviewGrowth",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/reviews/admin/dashboard/new-review-growth")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const reviewDashboardSlice = createSlice({
    name:"reviewDashboard",
    initialState:{
        reviewVerificationStat:[],
        reviewSummary:[],
        reviewNewGrowth:[],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers:(builder) => {
        builder.addCase(getReviewVerification.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getReviewVerification.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.reviewVerificationStat = payload
        })
        .addCase(getReviewVerification.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload
        })
        .addCase(getReviewSummary.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getReviewSummary.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.reviewSummary = payload
        })
        .addCase(getReviewSummary.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload
        })
        .addCase(getNewReviewGrowth.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getNewReviewGrowth.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.reviewNewGrowth = payload
        })
        .addCase(getNewReviewGrowth.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload
        })
    }
})

export default reviewDashboardSlice.reducer