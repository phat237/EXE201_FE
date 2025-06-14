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
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: "",
    amount: "",
    package: "",
    paymentMethod: "",
    transactionId: "",
    date: "",
  });

  useEffect(() => {
    // Lấy tham số từ URL
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("orderId");
    const urlAmount = searchParams.get("amount");
    const urlPackage = searchParams.get("package");
    const urlPaymentMethod = searchParams.get("method");
    const urlTransactionId = searchParams.get("transactionId") || searchParams.get("id");

    // Lấy dữ liệu từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const partnerId = currentUser.id || "unknown";
    const savedTransaction = JSON.parse(localStorage.getItem("lastTransaction")) || {};

    // Ưu tiên dữ liệu từ localStorage, fallback sang URL
    const orderCode = savedTransaction.orderCode || orderId;
    const amount = savedTransaction.amount || urlAmount || "0";
    const packageType = savedTransaction.package || urlPackage || "unknown";
    const paymentMethod = savedTransaction.method || urlPaymentMethod || "unknown";
    const transactionId = savedTransaction.transactionId || urlTransactionId || `TXN_${Date.now()}`;

    // Ghi log để debug
    console.log("Tham số checkout/success:", {
      orderId,
      orderCode,
      amount,
      package: packageType,
      paymentMethod,
      transactionId,
      partnerId,
      rawQuery: location.search,
      savedTransaction,
    });

    // Gọi API xác nhận thanh toán
    const confirmPayment = async () => {
      if (!orderCode || !partnerId || partnerId === "unknown") {
        console.warn("Thiếu orderCode hoặc partnerId, không gọi API checkoutSuccessApi");
        toast.error("Dữ liệu giao dịch không đầy đủ, vui lòng liên hệ hỗ trợ!");
        return;
      }

      try {
        await dispatch(checkoutSuccessApi({ orderCode, partnerId })).unwrap();
        toast.success("Thanh toán đã được xác nhận!");
      } catch (error) {
        console.error("Lỗi xác nhận thanh toán:", error);
        toast.error(`Xác nhận thanh toán thất bại: ${error.message || "Vui lòng liên hệ hỗ trợ!"}`);
      }
    };

    confirmPayment();

    setPaymentInfo({
      orderId: orderCode || "N/A",
      amount,
      package: packageType,
      paymentMethod,
      transactionId,
      date: new Date().toLocaleDateString("vi-VN"),
    });
  }, [location.search, dispatch]);

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
                  {paymentInfo.orderId}
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Mã giao dịch
                </Typography>
                <Typography variant="body2" className="checkout-payment-value checkout-payment-code">
                  {paymentInfo.transactionId}
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Gói dịch vụ
                </Typography>
                <Box className="checkout-payment-flex">
                  <Inventory className="checkout-payment-icon" />
                  <Typography variant="body2" className="checkout-payment-value">
                    {getPackageName(paymentInfo.package)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Số tiền
                </Typography>
                <Typography variant="h6" className="checkout-payment-amount">
                  {Number(paymentInfo.amount).toLocaleString()} VNĐ
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body2" className="checkout-payment-value">
                  {getPaymentMethodName(paymentInfo.paymentMethod)}
                </Typography>
              </Grid>
              <Grid item size={6} sm={6}>
                <Typography variant="caption" className="checkout-payment-label">
                  Ngày thanh toán
                </Typography>
                <Box className="checkout-payment-flex">
                  <CalendarToday className="checkout-payment-icon" />
                  <Typography variant="body2" className="checkout-payment-value">
                    {paymentInfo.date}
                  </Typography>
                </Box>
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