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
import { loginApi, registerParnerApi } from "../../../store/slices/authSlice";
import { transactionDepositApi } from "../../../store/slices/transactionSlice";

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
    resolver: yupResolver(partnerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Đăng ký đối tác
      const registerResult = await dispatch(
        registerParnerApi({ ...data, role: "PARTNER" })
      ).unwrap();
      toast.success("Đăng ký partner thành công!");
      localStorage.setItem("currentUser", JSON.stringify(registerResult));

      // Đăng nhập để lấy token
      const loginResult = await dispatch(
        loginApi({ username: data.username, password: data.password })
      ).unwrap();
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...registerResult, token: loginResult.token })
      );

      // Gửi yêu cầu deposit để lấy URL thanh toán
      const packageId = searchParams.get("packageId") || 3;
      const depositData = { packageId };
      const transactionResult = await dispatch(
        transactionDepositApi(depositData)
      ).unwrap();

      // Kiểm tra và chuyển hướng đến URL của cổng thanh toán
      if (transactionResult && transactionResult.checkoutUrl) {
        window.location.href = transactionResult.checkoutUrl;
      } else {
        console.error("Checkout URL không tồn tại:", transactionResult);
        toast.error("Không thể lấy liên kết thanh toán, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký hoặc thanh toán:", error);
      toast.error(
        error.message || "Đăng ký hoặc thanh toán thất bại, vui lòng thử lại!"
      );
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
                  Đăng Ký Đối Tác
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
                  {isLoading ? "Đang đăng ký..." : "Đăng Ký Đối Tác"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
        <Box className="auth-image-wrapper"></Box>
      </Box>
    </Box>
  );
}
