import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import premiumPackagesReducer from "./slices/preniumPackageSlice";
import productReducer from "./slices/productSlice";
import reviewReducer from "./slices/reviewSlice";
import transactionReducer from "./slices/transactionSlice";
import checkoutReducer from "./slices/checkoutSlice";
import partnerPackageReducer from "./slices/partnerPackageSlice"
import voucherReducer from "./slices/voucherSlice"
import searchReducer from "./slices/searchSlice";
// tạo store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    premiumPackages: premiumPackagesReducer,
    product: productReducer,
    review: reviewReducer,
    transaction: transactionReducer,
    checkout: checkoutReducer,
    review: reviewReducer,  
    partnerPackage: partnerPackageReducer,
    vouchers: voucherReducer,
    search: searchReducer,
  },
});

export default store;
