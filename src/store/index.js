import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";

// tạo store
export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});
