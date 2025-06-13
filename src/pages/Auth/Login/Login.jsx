import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Mail as MailIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import "./AuthPage.css";
import { loginApi } from "../../../store/slices/authSlice";
import { PATH } from "../../../routes/path";

// Validation schema
const schema = yup.object().shape({
  username: yup
    .string()
    .required("Tên đăng nhập là bắt buộc")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải chứa chữ hoa, chữ thường và số"
    ),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await dispatch(loginApi(data)).unwrap();
      // Xử lý dữ liệu người dùng từ API
      const userData = {
        ...result,
        token: result.token || result.accessToken,
        role: result.role || (result.authorities && result.authorities[0]?.authority) || "USER",
      };
      toast.success("Đăng nhập thành công!");
      localStorage.setItem("currentUser", JSON.stringify(userData));
      
      // Chuyển hướng dựa trên vai trò
      if (userData.role === "USER") {
        navigate(PATH.HOME);
      } else if (userData.role === "ADMIN") {
        navigate(PATH.DASHBOARD);
      } else if (userData.role === "PARTNER") {
        navigate(PATH.PARTNER);
      } else {
        navigate(PATH.HOME); // Dự phòng cho các vai trò không xác định
      }
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="auth-container">
      <Box className="auth-grid">
        <Box className="auth-form-wrapper">
          <Card className="auth-card">
            <CardHeader
              title={
                <Typography variant="h5" className="auth-card-title">
                  Đăng Nhập
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="body2" className="auth-card-description">
                Đăng nhập vào tài khoản của bạn để tiếp tục
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <Box className="auth-form-field">
                  <Typography
                    variant="body2"
                    component="label"
                    htmlFor="login-username"
                  >
                    Tên đăng nhập
                  </Typography>
                  <TextField
                    id="login-username"
                    placeholder="Tên đăng nhập"
                    fullWidth
                    variant="outlined"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                </Box>
                <Box className="auth-form-field">
                  <Box className="auth-password-header">
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="login-password"
                    >
                      Mật khẩu
                    </Typography>
                    <Link to="/quen-mat-khau" className="auth-link">
                      Quên mật khẩu?
                    </Link>
                  </Box>
                  <Box className="auth-password-wrapper">
                    <TextField
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      fullWidth
                      variant="outlined"
                      {...register("password")}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-password-toggle"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Box>
                </Box>
                <FormControlLabel
                  control={<Checkbox id="remember" />}
                  label="Ghi nhớ đăng nhập"
                  className="auth-checkbox"
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  className="auth-submit-button"
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
              </form>

              <Box className="auth-divider">
                <Typography variant="caption" className="auth-divider-text">
                  Hoặc đăng nhập với
                </Typography>
              </Box>

              <Box className="auth-social-buttons">
                <Button variant="outlined" className="auth-social-button">
                  <span className="auth-social-icon">F</span>
                  Facebook
                </Button>
                <Button variant="outlined" className="auth-social-button">
                  <MailIcon className="auth-social-icon" />
                  Google
                </Button>
                <Button variant="outlined" className="auth-social-button">
                  <span className="auth-social-icon">G</span>
                  Github
                </Button>
              </Box>
            </CardContent>
            <Box className="auth-footer">
              <Typography variant="caption" className="auth-footer-text">
                Chưa có tài khoản?{" "}
                <Link to="/auth/register" className="auth-link">
                  Đăng ký ngay
                </Link>
              </Typography>
            </Box>
          </Card>
        </Box>
        <Box className="auth-image-wrapper"></Box>
      </Box>
    </Box>
  );
}