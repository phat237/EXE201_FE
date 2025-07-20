import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkoutSuccessApi } from "../../../store/slices/checkoutSlice";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { CheckCircle, CreditCard, CalendarToday, Inventory } from "@mui/icons-material";
import "./CheckoutPayment.css";

export default function CheckoutSuccess() {
  const location = useLocation();
  const dispatch = useDispatch();
  // Lấy tham số từ URL
  const searchParams = new URLSearchParams(location.search);
  const orderCode = searchParams.get("orderCode");
  const partnerId = searchParams.get("partnerId");
  const packageId = searchParams.get("packageId");
  const code = searchParams.get("code");
  const id = searchParams.get("id");
  const cancel = searchParams.get("cancel");
  const status = searchParams.get("status");

  useEffect(() => {
    // Gọi API xác nhận thanh toán nếu cần
    if (orderCode && partnerId) {
      dispatch(checkoutSuccessApi({ orderCode, partnerId }));
    }
  }, [orderCode, partnerId, dispatch]);

  const getPackageName = (packageType) => {
    const packageMap = {
      basic: "Gói Cơ Bản",
      premium: "Gói Cao Cấp",
      vip: "Gói VIP",
      unknown: "Không xác định",
    };
    return packageMap[packageType.toLowerCase()] || "Không xác định";
  };

  const getPaymentMethodName = (method) => {
    const methodMap = {
      credit_card: "Thẻ tín dụng",
      bank_transfer: "Chuyển khoản ngân hàng",
      momo: "Ví MoMo",
      zalopay: "ZaloPay",
      unknown: "Không xác định",
    };
    return methodMap[method.toLowerCase()] || "Không xác định";
  };

  return (
    <Box className="checkout-payment">
      <Box className="checkout-payment-container">
        {/* Header */}
        <Box className="checkout-payment-header">
          <CheckCircle className="checkout-payment-success-icon" />
          <Typography variant="h4" className="checkout-payment-title">
            Thanh Toán Thành Công!
          </Typography>
          <Typography variant="body1" className="checkout-payment-description">
            Cảm ơn bạn! Giao dịch của bạn đã được xử lý thành công.
          </Typography>
        </Box>

        {/* Card chi tiết */}
        <Card className="checkout-payment-card">
          <CardHeader
            title={
              <Box className="checkout-payment-flex">
                <CreditCard className="checkout-payment-icon" />
                <Typography variant="h6">Chi Tiết Giao Dịch</Typography>
              </Box>
            }
          />
          <CardContent sx={{padding:"10px"}}>
            <Grid container spacing={2}>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Mã đơn hàng
                </Typography>
                <Typography variant="body2" className="checkout-payment-value">
                  {orderCode}
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Mã giao dịch
                </Typography>
                <Typography variant="body2" className="checkout-payment-value checkout-payment-code">
                  {id}
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Gói dịch vụ
                </Typography>
                <Box className="checkout-payment-flex">
                  <Inventory className="checkout-payment-icon" />
                  <Typography variant="body2" className="checkout-payment-value">
                    {packageId}
                  </Typography>
                </Box>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Mã code
                </Typography>
                <Typography variant="body2" className="checkout-payment-value">
                  {code}
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Partner ID
                </Typography>
                <Typography variant="body2" className="checkout-payment-value">
                  {partnerId}
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Cancel
                </Typography>
                <Typography variant="body2" className="checkout-payment-value">
                  {cancel}
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Trạng thái
                </Typography>
                <Typography variant="body2" className="checkout-payment-value">
                  {status}
                </Typography>
              </Grid>
            </Grid>
            <Box className="checkout-payment-status">
              <Typography variant="body2" className="checkout-payment-label">
                Trạng thái
              </Typography>
              <Chip
                label="Thành công"
                icon={<CheckCircle />}
                className="checkout-payment-chip"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Nút hành động */}
        <Box className="checkout-payment-actions">
          <Button
            variant="contained"
            component={Link}
            to="/"
            className="checkout-payment-button checkout-payment-button-primary"
          >
            Về Trang Chủ
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/lien-he"
            className="checkout-payment-button checkout-payment-button-secondary"
          >
            Liên Hệ Hỗ trợ
          </Button>
        </Box>

        {/* Thông tin hỗ trợ */}
        <Typography variant="body2" className="checkout-payment-support">
          Cần hỗ trợ?{" "}
          <Link to="/lien-he" className="checkout-payment-support-link">
            Liên hệ chúng tôi
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}