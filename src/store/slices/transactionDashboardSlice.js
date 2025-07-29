import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";


export const getTopPartner = createAsyncThunk(
    "transactionDashboard/getTopPartner",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/transactions/admin/dashboard/top-partners")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)


export const getSummary = createAsyncThunk(
    "transactionDashboard/getSummary",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/transactions/admin/dashboard/summary")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const getRevenueGrowth = createAsyncThunk(
    "transactionDashboard/getRevenueGrowth",
    async(_, {rejectWithValue}) => {
        try {
            const response = await fetcher.get("/transactions/admin/dashboard/revenue-growth")
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
              );
        }
    }
)

export const transactionDashboardSlice = createSlice({
    name:"transactionDashboard",
    initialState:{
        transactionTopPartner:[],
        transactionSummary:[],
        transactionRevenueGrowth:[],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers:(builder) => {
        builder.addCase(getTopPartner.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getTopPartner.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.transactionTopPartner = payload
        })
        .addCase(getTopPartner.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload
        }).addCase(getSummary.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getSummary.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.transactionSummary = payload
        })
        .addCase(getSummary.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload
        }).addCase(getRevenueGrowth.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getRevenueGrowth.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null;
            state.transactionRevenueGrowth = payload
        })
        .addCase(getRevenueGrowth.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload
        })
    }
    
})

export default transactionDashboardSlice.reducer