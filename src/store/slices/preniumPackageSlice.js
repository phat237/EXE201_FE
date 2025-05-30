import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetcher } from '../../apis/fetcher';

// Đường link API
const API_URL = 'https://trustreviews.onrender.com/premium-packages';

// Async thunk để fetch dữ liệu
export const fetchPremiumPackages = createAsyncThunk(
  'premiumPackages/fetchPremiumPackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetcher.get(API_URL);
      console.log('API RESPONSE:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk để tạo mới gói premium
export const createPremiumPackage = createAsyncThunk(
  'premiumPackages/createPremiumPackage',
  async (newPackage, { rejectWithValue }) => {
    try {
      const response = await fetcher.post(API_URL, newPackage);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk để update gói premium
export const updatePremiumPackage = createAsyncThunk(
  'premiumPackages/updatePremiumPackage',
  async ({ id, updatedPackage }, { rejectWithValue }) => {
    try {
      const response = await fetcher.put(`${API_URL}/${id}`, updatedPackage);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Thunk để xóa gói premium
export const deletePremiumPackage = createAsyncThunk(
  'premiumPackages/deletePremiumPackage',
  async (id, { rejectWithValue }) => {
    try {
      await fetcher.delete(`${API_URL}/${id}`);
      return id; // Trả về id để xóa khỏi state
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const premiumPackagesSlice = createSlice({
  name: 'premiumPackages',
  initialState: {
    data: [],
    loading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false, // Thêm trạng thái cho delete
  },
  reducers: {
    resetCreateSuccess(state) {
      state.createSuccess = false;
    },
    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },
    resetDeleteSuccess(state) {
      state.deleteSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPremiumPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPremiumPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPremiumPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPremiumPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createPremiumPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.data = [...state.data, action.payload];
      })
      .addCase(createPremiumPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.createSuccess = false;
      })
      .addCase(updatePremiumPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updatePremiumPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        // Cập nhật lại package trong data
        const idx = state.data.findIndex(pkg => pkg.id === action.payload.id);
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
      })
      .addCase(updatePremiumPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateSuccess = false;
      })
      .addCase(deletePremiumPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deletePremiumPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        // Xóa package khỏi data
        state.data = state.data.filter(pkg => pkg.id !== action.payload);
      })
      .addCase(deletePremiumPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.deleteSuccess = false;
      });
  },
});

export const { resetCreateSuccess, resetUpdateSuccess, resetDeleteSuccess } = premiumPackagesSlice.actions;
export default premiumPackagesSlice.reducer;
