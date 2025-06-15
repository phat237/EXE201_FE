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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { registerApi } from "../../../store/slices/authSlice";
import { transactionDepositApi } from "../../../store/slices/transactionSlice";

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

export default function PartnerRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const packageId = searchParams.get("packageId") || 3;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await dispatch(registerApi(data)).unwrap();
      toast.success("Đăng ký thành công!");
      localStorage.setItem("currentUser", JSON.stringify(result));
      navigate("/auth/login");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      toast.error(error.message || "Đăng ký thất bại, vui lòng thử lại!");
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
                <Typography variant="h4" className="auth-card-title">
                  Đăng Ký Người Dùng
                </Typography>
              }
            />
            <CardContent>
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
                  <TextField
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    fullWidth
                    variant="outlined"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Box>
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
                  {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
                </Button>
                <Box mt={2} textAlign="center">
                  <Typography variant="body2">
                    Bạn là đối tác?{' '}
                    <Link to="/auth/register/partner" className="auth-link">
                      Đăng ký đối tác tại đây
                    </Link>
                  </Typography>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
        <Box className="auth-image-wrapper"></Box>
      </Box>
    </Box>
  );
}