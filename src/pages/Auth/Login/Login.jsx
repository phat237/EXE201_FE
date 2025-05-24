import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
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
import "./AuthPage.css";

export default function AuthPage() {
  const [tabValue, setTabValue] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <Box className="auth-container">
      <Box className="auth-form-wrapper">
        <Tabs value={tabValue} onChange={handleTabChange} className="auth-tabs">
          <Tab label="Đăng Nhập" value="login" />
          <Tab label="Đăng Ký" value="register" />
        </Tabs>

        {tabValue === "login" && (
          <Card className="auth-card">
            <CardHeader>
              <Typography variant="h5" className="auth-card-title">
                Đăng Nhập
              </Typography>
              <Typography variant="body2" className="auth-card-description">
                Đăng nhập vào tài khoản của bạn để tiếp tục
              </Typography>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="auth-form">
                <Box className="auth-form-field">
                  <Typography variant="body2" component="label" htmlFor="login-email">
                    Email
                  </Typography>
                  <TextField
                    id="login-email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    fullWidth
                    variant="outlined"
                  />
                </Box>
                <Box className="auth-form-field">
                  <Box className="auth-password-header">
                    <Typography variant="body2" component="label" htmlFor="login-password">
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
                      required
                      fullWidth
                      variant="outlined"
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
                <Link to="/dang-ky" className="auth-link">
                  Đăng ký ngay
                </Link>
              </Typography>
            </Box>
          </Card>
        )}

        {tabValue === "register" && (
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
              <form onSubmit={handleRegister} className="auth-form">
                <Box className="auth-name-fields">
                  <Box className="auth-form-field">
                    <Typography variant="body2" component="label" htmlFor="firstName">
                      Họ
                    </Typography>
                    <TextField
                      id="firstName"
                      placeholder="Nguyễn"
                      required
                      fullWidth
                      variant="outlined"
                    />
                  </Box>
                  <Box className="auth-form-field">
                    <Typography variant="body2" component="label" htmlFor="lastName">
                      Tên
                    </Typography>
                    <TextField
                      id="lastName"
                      placeholder="Văn A"
                      required
                      fullWidth
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Box className="auth-form-field">
                  <Typography variant="body2" component="label" htmlFor="register-email">
                    Email
                  </Typography>
                  <TextField
                    id="register-email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    fullWidth
                    variant="outlined"
                  />
                </Box>
                <Box className="auth-form-field">
                  <Typography variant="body2" component="label" htmlFor="register-password">
                    Mật khẩu
                  </Typography>
                  <Box className="auth-password-wrapper">
                    <TextField
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      fullWidth
                      variant="outlined"
                    />
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-password-toggle"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Box>
                  <Typography variant="caption" className="auth-password-hint">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                  </Typography>
                </Box>
                <FormControlLabel
                  control={<Checkbox id="terms" required />}
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
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  className="auth-submit-button"
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
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
        )}
      </Box>
    </Box>
  );
}