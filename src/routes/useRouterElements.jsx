import { PATH } from "./path";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import HomePage from "../pages/Home/HomePage/HomePage";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import ReviewPage from "../pages/Home/ReviewPage/ReviewPage";
import FormReview from "../pages/Home/ReviewPage/FormReview";


export default function useRouterElements() {
  const element = useRoutes([
    {
      // auth
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: <Login />,
        },
        {
          path: PATH.REGISTER,
          element: <Register />,
        },
      ],
    },
    {
      // Home
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: PATH.REVIEW,
          element: <ReviewPage />,
        },
          {
          path: PATH.CREATERVIEW,
          element: <FormReview />,
        },

      ],
    },

    {
      // Admin
      path: PATH.ADMIN,
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <Dashboard /> }],
    },
  ]);
  return element;
}
