import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../apis/fetcher";

export const fetchAccountCountsApi = createAsyncThunk(
  "account/fetchAccountCountsApi",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const currentUser = state.auth.currentUser;
    const accessToken = currentUser?.token || currentUser?.accessToken;
    
    try {
      const response = await fetcher.get("/accounts/account-counts", {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching account counts:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchRegistrationGrowthApi = createAsyncThunk(
  "account/fetchRegistrationGrowthApi",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const currentUser = state.auth.currentUser;
    const accessToken = currentUser?.token || currentUser?.accessToken;
    
    try {
      const response = await fetcher.get("/accounts/registration-growth", {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching registration growth:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchOnlineUsersApi = createAsyncThunk(
  "account/fetchOnlineUsersApi",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const currentUser = state.auth.currentUser;
    const accessToken = currentUser?.token || currentUser?.accessToken;
    
    try {
      const response = await fetcher.get("/accounts/online-users", {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching online users:", error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    accountCounts: {
      userCount: 0,
      partnerCount: 0,
      totalCount: 0
    },
    registrationGrowth: {
      monthlyGrowth: [],
      yearlyGrowth: [],
      totalGrowth: 0
    },
    onlineUsers: {
      userCount: 0,
      partnerCount: 0,
      totalOnline: 0,
      lastUpdated: null
    },
    isLoading: false,
    isLoadingGrowth: false,
    isLoadingOnline: false,
    error: null,
    growthError: null,
    onlineError: null,
  },
  reducers: {
    clearAccountCounts: (state) => {
      state.accountCounts = {
        userCount: 0,
        partnerCount: 0,
        totalCount: 0
      };
      state.error = null;
    },
    clearRegistrationGrowth: (state) => {
      state.registrationGrowth = {
        monthlyGrowth: [],
        yearlyGrowth: [],
        totalGrowth: 0
      };
      state.growthError = null;
    },
    clearOnlineUsers: (state) => {
      state.onlineUsers = {
        userCount: 0,
        partnerCount: 0,
        totalOnline: 0,
        lastUpdated: null
      };
      state.onlineError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountCountsApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountCountsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        // Giả sử API trả về dữ liệu có cấu trúc như { userCount: number, partnerCount: number }
        state.accountCounts = {
          userCount: payload.userCount || 0,
          partnerCount: payload.partnerCount || 0,
          totalCount: (payload.userCount || 0) + (payload.partnerCount || 0)
        };
      })
      .addCase(fetchAccountCountsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.accountCounts = {
          userCount: 0,
          partnerCount: 0,
          totalCount: 0
        };
      })
      .addCase(fetchRegistrationGrowthApi.pending, (state) => {
        state.isLoadingGrowth = true;
        state.growthError = null;
      })
      .addCase(fetchRegistrationGrowthApi.fulfilled, (state, { payload }) => {
        state.isLoadingGrowth = false;
        state.growthError = null;
        // Giả sử API trả về dữ liệu có cấu trúc như { monthlyGrowth: [], yearlyGrowth: [], totalGrowth: number }
        state.registrationGrowth = {
          monthlyGrowth: payload.monthlyGrowth || [],
          yearlyGrowth: payload.yearlyGrowth || [],
          totalGrowth: payload.totalGrowth || 0
        };
      })
      .addCase(fetchRegistrationGrowthApi.rejected, (state, { payload }) => {
        state.isLoadingGrowth = false;
        state.growthError = payload;
        state.registrationGrowth = {
          monthlyGrowth: [],
          yearlyGrowth: [],
          totalGrowth: 0
        };
      })
      .addCase(fetchOnlineUsersApi.pending, (state) => {
        state.isLoadingOnline = true;
        state.onlineError = null;
      })
      .addCase(fetchOnlineUsersApi.fulfilled, (state, { payload }) => {
        state.isLoadingOnline = false;
        state.onlineError = null;
        // Giả sử API trả về dữ liệu có cấu trúc như { userCount: number, partnerCount: number, totalOnline: number, lastUpdated: string }
        state.onlineUsers = {
          userCount: payload.userCount || 0,
          partnerCount: payload.partnerCount || 0,
          totalOnline: payload.totalOnline || 0,
          lastUpdated: payload.lastUpdated || new Date().toISOString()
        };
      })
      .addCase(fetchOnlineUsersApi.rejected, (state, { payload }) => {
        state.isLoadingOnline = false;
        state.onlineError = payload;
        state.onlineUsers = {
          userCount: 0,
          partnerCount: 0,
          totalOnline: 0,
          lastUpdated: null
        };
      });
  },
});

export const { clearAccountCounts, clearRegistrationGrowth, clearOnlineUsers } = accountSlice.actions;
export default accountSlice.reducer;

// Selectors
export const selectAccountCounts = (state) => state.account.accountCounts;
export const selectAccountCountsLoading = (state) => state.account.isLoading;
export const selectAccountCountsError = (state) => state.account.error;

// Registration Growth Selectors
export const selectRegistrationGrowth = (state) => state.account.registrationGrowth;
export const selectRegistrationGrowthLoading = (state) => state.account.isLoadingGrowth;
export const selectRegistrationGrowthError = (state) => state.account.growthError;

// Online Users Selectors
export const selectOnlineUsers = (state) => state.account.onlineUsers;
export const selectOnlineUsersLoading = (state) => state.account.isLoadingOnline;
export const selectOnlineUsersError = (state) => state.account.onlineError; 