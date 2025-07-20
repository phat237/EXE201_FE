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
    const status = searchParams.get("status")?.toUpperCase(); // Chuyển thành chữ hoa để tránh lỗi
    const code = searchParams.get("code");
    const cancel = searchParams.get("cancel");
    const partnerId = searchParams.get("partnerId") || "unknown"; // Mặc định nếu thiếu
    const transactionId = searchParams.get("id") || `TXN_${Date.now()}`; // Mặc định nếu thiếu

    // Ghi log để kiểm tra tham số
    console.log("Tham số callback thanh toán:", {
      orderCode,
      status,
      code,
      cancel,
      partnerId,
      transactionId,
      rawQuery: location.search, // URL gốc
    });

    const handlePaymentResult = async () => {
      try {
        // Kiểm tra giao dịch thành công: status là PAID, code (nếu có) là 00, và cancel không phải true
        const isSuccess = status === "PAID" && (!code || code === "00") && cancel !== "true";

        if (isSuccess) {
          // Gọi API xác nhận thanh toán thành công
          await dispatch(checkoutSuccessApi({ orderCode, partnerId })).unwrap();
          toast.success("Thanh toán thành công!");
          // Chuyển hướng tới trang thành công với đủ tham số từ URL
          navigate(
            `/checkout/success?orderCode=${orderCode}` +
            `&partnerId=${partnerId}` +
            `&packageId=${searchParams.get("packageId") || ''}` +
            `&code=${code || ''}` +
            `&id=${transactionId}` +
            `&cancel=${cancel || ''}` +
            `&status=${status}`
          );
        } else {
          // Gọi API xác nhận thanh toán thất bại
          await dispatch(checkoutFailApi({ orderCode })).unwrap();
          toast.error("Thanh toán thất bại!");
          // Chuyển hướng tới trang thất bại
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

    // Kiểm tra xem có đủ tham số để xử lý
    if (orderCode && status) {
      handlePaymentResult();
    } else {
      console.error("Thiếu tham số thanh toán:", { orderCode, status });
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