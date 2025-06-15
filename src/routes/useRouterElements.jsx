import { PATH } from "./path";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import PartnerLayout from "../layouts/PartnerLayout/PartnerLayout";
import HomePage from "../pages/Home/HomePage/HomePage";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import PartnerDashboard from "../pages/Partner/Dashboard/PartnerDashboard";
import Products from "../pages/Admin/Products/Products";
import Orders from "../pages/Admin/Orders/Orders";
import Settings from "../pages/Admin/Settings/Settings";
import UpgradePackages from "../pages/Admin/UpgradePackages/UpgradePackages";
import PartnerUpgradePackages from "../pages/Partner/UpgradePackages/UpgradePackages";
import AvailablePackages from "../pages/Partner/UpgradePackages/AvailablePackages";
import { useRoutes } from "react-router-dom"; 
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import ReviewPage from "../pages/Home/ReviewPage/ReviewPage";
import FormReview from "../pages/Home/ReviewPage/FormReview";
import ProductPaege from "../pages/Home/ProductPage/ProductPage";
import ProductDetailPage from "../pages/Home/ProductPage/ProductDetailPage";
import BusinessPage from "../pages/Home/BusinessPage/BusinessPage";
import ProfileUser from "../components/ProfileUser/ProfileUser";
import Reviews from "../pages/Partner/Reviews/Reviews"; 
import PartnerRegister from "../pages/Auth/Register/PartnerRegister"; 
import CheckoutSucess from "../pages/Home/Checkout/CheckoutSucess";
import CheckoutFail from "../pages/Home/Checkout/CheckoutFail";
import Voucher from '../pages/Admin/Voucher/Voucher';         
import PaymentCallback from "../pages/Home/Checkout/PaymentCallback";

export default function useRouterElements() {
  const element = useRoutes([ 
    {
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: (
            <ProtectedRoute redirectTo={PATH.LOGIN}>
              <Login />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.REGISTER,
          element: <Register />,
        },
        {
          path: PATH.REGISTERPARTNER,
          element: <PartnerRegister />,
        },
      ],
    },
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
       
        {
          path: PATH.CREATERVIEW,
          element: <FormReview />,
        },
        {
          path: PATH.PRODUCT,
          element: <ProductPaege />,
        },
        {
          path: PATH.PRODUCT_DETAIL,
          element: <ProductDetailPage />,
        },
        {
          path: PATH.BUSINESS,
          element: <BusinessPage />,
        },
        {
          path: PATH.BUSINESS,
          element: <BusinessPage />,
        },
        {
          path: PATH.PROFILEUSER,
          element: <ProfileUser />,
        },
        {
          path: PATH.CHECKOUTSUCCESS,
          element: <CheckoutSucess />,
        },
        {
          path: PATH.CHECKOUTFAIL,
          element: <CheckoutFail />,
        },
        {
          path: PATH.PAYMENTCALLBACL,
          element: <PaymentCallback />,
        },
      ],
    },
    {
      path: PATH.ADMIN,
      element: (
         <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: PATH.VOUCHER,
          element: <Voucher />,
        },
      
        {
          path: "products",
          element: <Products />,
        },
        {
          path: "orders",
          element: <Orders />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "upgrade-packages",
          element: <UpgradePackages />,
        },
      ],
    },
    {
      path: PATH.PARTNER,
      element: (
         <ProtectedRoute allowedRoles={["PARTNER"]}>
        <PartnerLayout />
        </ProtectedRoute> 
      ),
      children: [
        {
          index: true,
          element: <PartnerDashboard />,
        },
        {
          path: "dashboard",
          element: <PartnerDashboard />,
        },
        {
          path: "upgrade-packages",
          element: <PartnerUpgradePackages />,
        },
      ,
        {
          path: PATH.PARTNER_AVAILABLE_PACKAGES,
          element: <AvailablePackages />,
        },
        ],
    },
  ]);
  return element;
}
