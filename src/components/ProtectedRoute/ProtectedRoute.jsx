import { Navigate } from "react-router-dom";
import { PATH } from "../../routes/path";

const ProtectedRoute = ({ children, allowedRoles, redirectTo }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Kiểm tra nếu đã đăng nhập và cố truy cập trang login
  if (redirectTo === PATH.LOGIN && currentUser?.token) {
    console.log(
      "User is logged in, redirecting based on role:",
      currentUser.role
    );
    if (currentUser.role === "USER") {
      return <Navigate to={PATH.HOME} replace />;
    } else if (currentUser.role === "ADMIN") {
      return <Navigate to={PATH.DASHBOARD} replace />;
    } else if (currentUser.role === "PARTNER") {
      return <Navigate to={PATH.PARTNER} replace />;
    }
  }

  // Kiểm tra quyền truy cập cho các route khác (như admin hoặc partner)
  if (allowedRoles && !allowedRoles.some(role => 
    currentUser?.role?.toUpperCase() === role.toUpperCase()
  )) {
    if (!currentUser || !currentUser.token) {
      console.log("No user or token, redirecting to login");
      return <Navigate to={PATH.LOGIN} replace />;
    }
    if (currentUser.role === "USER") {
      console.log("User role, redirecting to home");
      return <Navigate to={PATH.HOME} replace />;
    } else if (currentUser.role === "ADMIN") {
      console.log("Admin role, redirecting to admin");
      return <Navigate to={PATH.DASHBOARD} replace />;
    } else if (currentUser.role === "PARTNER") {
      console.log("Partner role, redirecting to partner dashboard");
      return <Navigate to={PATH.PARTNER} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;