import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { fetcher } from "../../apis/fetcher";

// Lấy và kiểm tra dữ liệu từ localStorage
const currentUserStr = localStorage.getItem("currentUser");
let userLocal = null;
if (currentUserStr) {
  try {
    userLocal = JSON.parse(currentUserStr);
  } catch (e) {
    console.error("Lỗi parse currentUser từ localStorage:", e);
    localStorage.removeItem("currentUser"); 
  }
} else {
  console.log("Không tìm thấy currentUser trong localStorage");
}

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
  async (data, { rejectWithValue, getState }) => {
    const state = getState();
    const currentUser = state.auth.currentUser;
    const accessToken = currentUser?.token || currentUser?.accessToken;

    try {
      const response = await fetcher.post("/accounts/register/partner", data, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      console.log("Phản hồi từ server:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi API chi tiết:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
      });
      return rejectWithValue(error.response?.data || error.message);
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
    currentUser: userLocal, // Sử dụng giá trị đã kiểm tra
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      const userData = action.payload;
      console.log("Setting currentUser:", userData); // Debug
      if (userData && typeof userData === "object") {
        state.currentUser = userData;
        localStorage.setItem("currentUser", JSON.stringify(userData)); // Lưu chỉ khi hợp lệ
      } else {
        console.warn(
          "Dữ liệu currentUser không hợp lệ, không lưu vào localStorage"
        );
      }
    },
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
        localStorage.setItem(
          "accessToken",
          payload.accessToken || payload.token
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
      })
      .addCase(registerApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(loginApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload;
        if (payload?.accessToken || payload?.token) {
          localStorage.setItem(
            "accessToken",
            payload.accessToken || payload.token
          );
        }
      })
      .addCase(loginApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(registerParnerApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerParnerApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.currentUser = payload; // Lưu payload (data)
      })
      .addCase(registerParnerApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { logout, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;

// Selector for user role
export const selectUserRole = (state) => state.auth.currentUser?.role;