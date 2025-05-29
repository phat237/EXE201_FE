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
  Tabs,
  Tab,
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

import "../Login/AuthPage.css";
import { registerApi } from "../../../store/slices/authSlice";

// Validation schemas
const userSchema = yup.object().shape({
  username: yup
    .string()
    .required("Tên đăng nhập là bắt buộc")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  displayName: yup
    .string()
    .required("Tên hiển thị là bắt buộc")
    .min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải chứa chữ hoa, chữ thường và số"
    ),
  terms: yup.boolean().oneOf([true], "Bạn phải đồng ý với điều khoản sử dụng"),
});

const partnerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Tên đăng nhập là bắt buộc")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  displayName: yup
    .string()
    .required("Tên hiển thị là bắt buộc")
    .min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải chứa chữ hoa, chữ thường và số"
    ),
  companyName: yup
    .string()
    .required("Tên công ty là bắt buộc")
    .min(2, "Tên công ty phải có ít nhất 2 ký tự"),
  businessRegistrationNumber: yup
    .string()
    .required("Mã số đăng ký kinh doanh là bắt buộc"),
  website: yup
    .string()
    .url("Website không hợp lệ")
    .required("Website là bắt buộc"),
  contactPhone: yup
    .string()
    .required("Số điện thoại liên hệ là bắt buộc")
    .matches(/^\+?\d{10,15}$/, "Số điện thoại không hợp lệ"),
  terms: yup.boolean().oneOf([true], "Bạn phải đồng ý với điều khoản sử dụng"),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(tabValue === 0 ? userSchema : partnerSchema),
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    reset(); // Reset form when switching tabs
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await dispatch(registerApi(data)).unwrap();
      toast.success("Đăng ký thành công!");
      localStorage.setItem("currentUser", JSON.stringify(result));
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="auth-container">
      <Box className="auth-form-wrapper">
        <Card className="auth-card">
          <CardHeader>
            <Typography variant="h5" className="auth-card-title">
              Đăng Ký
            </Typography>
            <Typography variant="body2" className="auth-card-description">
              Tạo tài khoản mới để sử dụng dịch vụ
            </Typography>
          </CardHeader>
          <CardContent>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Người dùng" />
              <Tab label="Đối tác" />
            </Tabs>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <Box className="auth-form-field">
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="username"
                >
                  Tên đăng nhập
                </Typography>
                <TextField
                  id="username"
                  placeholder="congduy"
                  fullWidth
                  variant="outlined"
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              </Box>
              <Box className="auth-form-field">
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="displayName"
                >
                  Tên hiển thị
                </Typography>
                <TextField
                  id="displayName"
                  placeholder="congduy"
                  fullWidth
                  variant="outlined"
                  {...register("displayName")}
                  error={!!errors.displayName}
                  helperText={errors.displayName?.message}
                />
              </Box>
              <Box className="auth-form-field">
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="register-email"
                >
                  Email
                </Typography>
                <TextField
                  id="register-email"
                  type="email"
                  placeholder="cduy527@gmail.com"
                  fullWidth
                  variant="outlined"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Box>
              <Box className="auth-form-field">
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="register-password"
                >
                  Mật khẩu
                </Typography>
                <Box className="auth-password-wrapper">
                  <TextField
                    id="register-password"
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
                <Typography variant="caption" className="auth-password-hint">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường
                  và số
                </Typography>
              </Box>
              {tabValue === 1 && (
                <>
                  <Box className="auth-form-field">
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="companyName"
                    >
                      Tên công ty
                    </Typography>
                    <TextField
                      id="companyName"
                      placeholder="Công ty ABC"
                      fullWidth
                      variant="outlined"
                      {...register("companyName")}
                      error={!!errors.companyName}
                      helperText={errors.companyName?.message}
                    />
                  </Box>
                  <Box className="auth-form-field">
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="businessRegistrationNumber"
                    >
                      Mã số đăng ký kinh doanh
                    </Typography>
                    <TextField
                      id="businessRegistrationNumber"
                      placeholder="123456789"
                      fullWidth
                      variant="outlined"
                      {...register("businessRegistrationNumber")}
                      error={!!errors.businessRegistrationNumber}
                      helperText={errors.businessRegistrationNumber?.message}
                    />
                  </Box>
                  <Box className="auth-form-field">
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="website"
                    >
                      Website
                    </Typography>
                    <TextField
                      id="website"
                      placeholder="https://example.com"
                      fullWidth
                      variant="outlined"
                      {...register("website")}
                      error={!!errors.website}
                      helperText={errors.website?.message}
                    />
                  </Box>
                  <Box className="auth-form-field">
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="contactPhone"
                    >
                      Số điện thoại liên hệ
                    </Typography>
                    <TextField
                      id="contactPhone"
                      placeholder="+84912345678"
                      fullWidth
                      variant="outlined"
                      {...register("contactPhone")}
                      error={!!errors.contactPhone}
                      helperText={errors.contactPhone?.message}
                    />
                  </Box>
                </>
              )}
              <FormControlLabel
                control={<Checkbox id="terms" {...register("terms")} />}
                label={
                  <Typography variant="caption">
                    Tôi đồng ý với{" "}
                    <Link to="/dieu-khoan" className="auth-link">
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link to="/chinh-sach" className="auth-link">
                      Chính sách bảo mật
                    </Link>
                  </Typography>
                }
                className="auth-checkbox"
              />
              {errors.terms && (
                <Typography variant="caption" color="error">
                  {errors.terms.message}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                className="auth-submit-button"
              >
                {isLoading
                  ? "Đang đăng ký..."
                  : tabValue === 0
                  ? "Đăng Ký"
                  : "Đăng Ký Đối Tác"}
              </Button>
            </form>

            <Box className="auth-divider">
              <Typography variant="caption" className="auth-divider-text">
                Hoặc đăng ký với
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
              Đã có tài khoản?{" "}
              <Link to="/dang-nhap" className="auth-link">
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
