import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { fetcher } from "../../apis/fetcher";

const userLocal = JSON.parse(localStorage.getItem("currentUser"));

export const registerApi = createAsyncThunk(
  "auth/registerApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/accounts/register/user", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const registerParnerApi = createAsyncThunk(
  "auth/registerParnerApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/accounts/register/partner", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const loginApi = createAsyncThunk(
  "auth/loginApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetcher.post("/accounts/login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: userLocal,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      toast.success("Đăng xuất thành công");
    },
    login: (state, { payload }) => {
      state.currentUser = payload;
      localStorage.setItem("currentUser", JSON.stringify(payload));
      if (payload?.accessToken || payload?.token) {
        localStorage.setItem("accessToken", payload.accessToken || payload.token);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.currentUser = payload;
    });
    builder.addCase(registerApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(loginApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.currentUser = payload;
      if (payload?.accessToken || payload?.token) {
        localStorage.setItem("accessToken", payload.accessToken || payload.token);
      }
    });
    builder.addCase(loginApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(registerParnerApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerParnerApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.currentUser = payload;
    });
    builder.addCase(registerParnerApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
