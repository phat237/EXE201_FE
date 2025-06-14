import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { CreditCard, CalendarToday, Inventory } from "@mui/icons-material";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import "./CheckoutPayment.css";

function CheckoutFail() {
  const location = useLocation();
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: "",
    amount: "",
    package: "",
    paymentMethod: "",
    transactionId: "",
    date: "",
  });

  useEffect(() => {
    // Get query parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId") || `ORDER_${Date.now()}`;
    const amount = searchParams.get("amount") || "499.000đ";
    const packageType = searchParams.get("package") || "premium";
    const paymentMethod = searchParams.get("method") || "credit_card";
    const transactionId =
      searchParams.get("transactionId") || `TXN_${Date.now()}`;

    setPaymentInfo({
      orderId,
      amount,
      package: packageType,
      paymentMethod,
      transactionId,
      date: new Date().toLocaleDateString("vi-VN"),
    });
  }, [location.search]);

  const getPackageName = (packageType) => {
    switch (packageType) {
      case "basic":
        return "Gói Cơ Bản";
      case "premium":
        return "Gói Cao Cấp";
      case "vip":
        return "Gói VIP";
      default:
        return "Gói Cao Cấp";
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case "credit_card":
        return "Thẻ tín dụng";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      case "momo":
        return "Ví MoMo";
      case "zalopay":
        return "ZaloPay";
      default:
        return "Thẻ tín dụng";
    }
  };

  return (
    <div className="checkoutPayment">
      <div className="checkoutPayment-container">
        {/* Success Header */}
        <div className="checkoutPayment-successHeader">
          <div
            className="checkoutPayment-successIconContainer"
            style={{ backgroundColor: "#ffe1df" }}
          >
            <DisabledByDefaultIcon
              className="checkoutPayment-successIcon"
              sx={{ color: "#d72b1c" }}
            />
          </div>
          <Typography
            variant="h4"
            className="checkoutPayment-successTitle"
            sx={{ color: "#d72b1c" }}
          >
            Thanh Toán Thất Bại!
          </Typography>
          <Typography
            variant="body2"
            className="checkoutPayment-successDescription"
          >
            Giao dịch không thành công
            <span> đã xảy ra lỗi trong quá trình thanh toán.</span>
          </Typography>
        </div>

        {/* Payment Details */}
        <Card className="checkoutPayment-card">
          <CardHeader
            title={
              <Box className="checkoutPayment-flex">
                <CreditCard className="checkoutPayment-icon" />
                <Typography variant="h6">Chi Tiết Thanh Toán</Typography>
              </Box>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                Thông tin chi tiết về giao dịch của bạn
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item size={6} md={6}>
                <Typography variant="caption" className="checkoutPayment-label">
                  Mã đơn hàng
                </Typography>
                <Typography variant="body2" className="checkoutPayment-code">
                  {paymentInfo.orderId}
                </Typography>
              </Grid>
              <Grid item size={6} md={6}>
                <Typography variant="caption" className="checkoutPayment-label">
                  Mã giao dịch
                </Typography>
                <Typography
                  variant="body2"
                  className="checkoutPayment-code"
                  sx={{ backgroundColor: "#ffe1df" }}
                >
                  {paymentInfo.transactionId}
                </Typography>
              </Grid>
              <Grid item size={6} md={6}>
                <Typography variant="caption" className="checkoutPayment-label">
                  Gói dịch vụ
                </Typography>
                <Box className="checkoutPayment-flex">
                  <Inventory className="checkoutPayment-icon" />
                  <Typography variant="body1">
                    {getPackageName(paymentInfo.package)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item size={6} md={6}>
                <Typography variant="caption" className="checkoutPayment-label">
                  Số tiền
                </Typography>
                <Typography variant="h5" className="checkoutPayment-amount">
                  {paymentInfo.amount}
                </Typography>
              </Grid>
              <Grid item size={6} md={6}>
                <Typography variant="caption" className="checkoutPayment-label">
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1">
                  {getPaymentMethodName(paymentInfo.paymentMethod)}
                </Typography>
              </Grid>
              <Grid item size={6} md={6}>
                <Typography variant="caption" className="checkoutPayment-label">
                  Ngày thanh toán
                </Typography>
                <Box className="checkoutPayment-flex">
                  <CalendarToday className="checkoutPayment-calendarIcon" />
                  <Typography variant="body1">{paymentInfo.date}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider className="checkoutPayment-divider" />
            <Box className="checkoutPayment-status">
              <Typography
                variant="body1"
                className="checkoutPayment-fontMedium"
              >
                Trạng thái
              </Typography>
              <Chip
                label="Thất bại"
                icon={<DisabledByDefaultIcon />}
                className="checkoutPayment-statusChip"
              />
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CheckoutFail;
