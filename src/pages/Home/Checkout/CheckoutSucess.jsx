import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkoutSuccessApi,
  checkoutFailApi,
} from "../../../store/slices/checkoutSlice";
import toast from "react-hot-toast";

export default function PaymentCallback() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy tham số từ URL
    const searchParams = new URLSearchParams(location.search);
    const orderCode = searchParams.get("orderCode");
    const partnerId = searchParams.get("partnerId");
    const code = searchParams.get("code");
    const cancel = searchParams.get("cancel");
    const status = searchParams.get("status");
    const transactionId = searchParams.get("id") || `TXN_${Date.now()}`;

    const handlePaymentResult = async () => {
      try {
        // Kiểm tra trạng thái thành công
        if (code === "00" && status === "PAID" && cancel === "false") {
          // Gọi checkoutSuccessApi
          await dispatch(checkoutSuccessApi({ orderCode, partnerId })).unwrap();
          toast.success("Thanh toán thành công!");
          // Chuyển hướng đến trang thành công
          navigate(
            `/checkout/success?orderId=${orderCode}&amount=499000&package=premium&method=credit_card&transactionId=${transactionId}`
          );
        } else {
          // Gọi checkoutFailApi
          await dispatch(checkoutFailApi({ orderCode })).unwrap();
          toast.error("Thanh toán thất bại!");
          // Chuyển hướng đến trang thất bại
          navigate(
            `/checkout/fail?orderId=${orderCode}&amount=499000&package=premium&method=credit_card&transactionId=${transactionId}`
          );
        }
      } catch (error) {
        console.error("Lỗi xử lý callback thanh toán:", error);
        toast.error("Có lỗi xảy ra khi xử lý thanh toán!");
        navigate("/");
      }
    };

    // Kiểm tra xem có đủ thông tin để xử lý không
    if (orderCode && code && status) {
      handlePaymentResult();
    } else {
      toast.error("Dữ liệu thanh toán không hợp lệ!");
      navigate("/");
    }
  }, [dispatch, location, navigate]);

  return (
    <div>
      <p>Đang xử lý kết quả thanh toán...</p>
    </div>
  );
}
