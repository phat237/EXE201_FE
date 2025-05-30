import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import premiumPackagesReducer from "./slices/preniumPackageSlice";
import productReducer from "./slices/productSlice"
// tạo store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    premiumPackages: premiumPackagesReducer,
    product: productReducer,
  },
});
