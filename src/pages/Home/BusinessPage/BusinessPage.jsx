import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  Verified as VerifiedIcon,
  CheckCircle as CheckCircleIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import "./BusinessPage.css";
import { useDispatch, useSelector } from "react-redux";
import { selectUserRole } from "../../../store/slices/authSlice";
import { fetchPremiumPackages } from "../../../store/slices/preniumPackageSlice";

export default function BusinessPage() {
  const dispatch = useDispatch();
  const { data: premiumPackages, loading, error } = useSelector((state) => state.premiumPackages);
  const userRole = useSelector(selectUserRole);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPremiumPackages());
  }, [dispatch]);

  const handleOpenModal = (pkg) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser?.role === "USER") {
      if (window.confirm("Bạn muốn đăng ký trở thành partner sao?")) {
        navigate(`/auth/register/partner?packageId=${pkg?.id}`);
      }
    } else {
      setSelectedPackage(pkg);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPackage(null);
  };

  const handleConfirmUpgrade = () => {
    if (userRole !== "USER") {
      // Logic cho PARTNER hoặc ADMIN (nếu có)
      handleCloseModal();
      // Thêm logic nâng cấp gói nếu cần
    }
  };

  return (
    <Box className="business-container">
      <Box className="business-header">
        <Box>
          <Typography variant="h3" className="business-title">
            Giải Pháp Cho Doanh Nghiệp
          </Typography>
          <Typography variant="body1" className="business-subtitle">
            Nâng cao hiệu quả kinh doanh với các công cụ phân tích đánh giá
            chuyên sâu
          </Typography>
        </Box>
        <Button variant="contained" component={Link} to="/doanh-nghiep/dang-ky">
          Đăng Ký Ngay
        </Button>
      </Box>

      <Box className="business-why-section">
        <Box className="business-why-content">
          <Box>
            <Typography variant="h4" className="business-section-title">
              Tại Sao Chọn TrustReview?
            </Typography>
            <Typography variant="body1" className="business-section-text">
              TrustReview cung cấp nền tảng đánh giá ẩn danh với công nghệ AI
              tiên tiến, giúp doanh nghiệp hiểu rõ hơn về phản hồi của khách
              hàng và cải thiện sản phẩm, dịch vụ.
            </Typography>
            <Box className="business-features-list">
              {[
                {
                  icon: <VerifiedIcon className="business-icon" />,
                  text: "Đánh giá trung thực từ người dùng thực",
                },
                {
                  icon: <CheckCircleIcon className="business-icon" />,
                  text: "Phân tích AI chuyên sâu về đánh giá sản phẩm",
                },
                {
                  icon: <BarChartIcon className="business-icon" />,
                  text: "Báo cáo chi tiết và xu hướng thị trường",
                },
                {
                  icon: <PeopleIcon className="business-icon" />,
                  text: "Hiểu rõ nhu cầu và mong đợi của khách hàng",
                },
              ].map((item, index) => (
                <Box key={index} className="business-feature-item">
                  {item.icon}
                  <Typography variant="body1">{item.text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box className="business-image-container">
            <Box className="business-image-wrapper">
              <img
                src="https://taca.com.vn/wp-content/uploads/2022/12/bao-cao-thong-tin-doanh-nghiep-BIR.jpg"
                alt="Dashboard doanh nghiệp"
                className="business-image"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="business-pricing-section">
        <Box className="business-section-header">
          <Typography variant="h3" className="business-section-title">
            Các Gói Dịch Vụ
          </Typography>
          <Typography variant="body1" className="business-section-text">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu và quy mô doanh nghiệp của
            bạn
          </Typography>
        </Box>

        <Box className="business-tabs-content">
          {loading ? (
            <Typography>Đang tải...</Typography>
          ) : error ? (
            <Typography color="error">Lỗi: {error}</Typography>
          ) : premiumPackages && premiumPackages.length > 0 ? (
            <Box className="business-pricing-grid">
              {premiumPackages
                .slice()
                .sort((a, b) => a.id - b.id)
                .map((pkg) => (
                  <Box
                    key={pkg.id}
                    className={`business-pricing-card ${
                      pkg.id === 3 ? "business-pricing-highlighted" : ""
                    }`}
                  >
                    <Box className="business-pricing-header">
                      <Typography
                        variant="h6"
                        className="business-pricing-title"
                      >
                        {pkg.name}
                      </Typography>
                      <Typography
                        variant="h4"
                        className="business-pricing-price"
                      >
                        {`${pkg.price.toLocaleString()} VNĐ`}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        className="business-pricing-duration"
                      >
                        {`${pkg.duration} ngày`}
                      </Typography>
                    </Box>
                    <Box className="business-pricing-content">
                      <Typography
                        variant="body2"
                        className="business-pricing-description"
                      >
                        {pkg.description}
                      </Typography>
                    </Box>
                    <CardActions className="business-pricing-footer">
                      <Button
                        variant={pkg.id === 3 ? "contained" : "outlined"}
                        onClick={() => handleOpenModal(pkg)}
                        className="business-pricing-button"
                      >
                        Nâng Cấp Ngay
                      </Button>
                    </CardActions>
                  </Box>
                ))}
            </Box>
          ) : (
            <Typography>Không tìm thấy gói dịch vụ nào.</Typography>
          )}
        </Box>
      </Box>

      <Box className="business-features-section">
        <Box className="business-section-header">
          <Typography variant="h3" className="business-section-title">
            Tính Năng Nổi Bật
          </Typography>
          <Typography variant="body1" className="business-section-text">
            Khám phá các công cụ mạnh mẽ giúp doanh nghiệp của bạn phát triển
          </Typography>
        </Box>

        <Box className="business-features-grid">
          <FeatureCard
            icon={<BarChartIcon className="business-feature-icon" />}
            title="Phân Tích Đánh Giá"
            description="Phân tích chi tiết đánh giá của khách hàng với công nghệ AI tiên tiến"
          />
          <FeatureCard
            icon={<ShowChartIcon className="business-feature-icon" />}
            title="Xu Hướng Thị Trường"
            description="Theo dõi xu hướng thị trường và so sánh với đối thủ cạnh tranh"
          />
          <FeatureCard
            icon={<PieChartIcon className="business-feature-icon" />}
            title="Báo Cáo Chi Tiết"
            description="Báo cáo chi tiết về đánh giá sản phẩm, phân loại theo nhiều tiêu chí"
          />
          <FeatureCard
            icon={<VerifiedIcon className="business-feature-icon" />}
            title="Bảo Vệ Thương Hiệu"
            description="Phát hiện sớm các đánh giá tiêu cực để kịp thời xử lý"
          />
          <FeatureCard
            icon={<PeopleIcon className="business-feature-icon" />}
            title="Hiểu Khách Hàng"
            description="Phân tích hành vi và mong đợi của khách hàng từ đánh giá"
          />
          <FeatureCard
            icon={<CheckCircleIcon className="business-feature-icon" />}
            title="Xác Minh AI"
            description="Công nghệ AI tự động phát hiện đánh giá giả mạo và spam"
          />
        </Box>
      </Box>

      <Box className="business-process-section">
        <Box className="business-section-header">
          <Typography variant="h3" className="business-section-title">
            Quy Trình Đơn Giản
          </Typography>
          <Typography variant="body1" className="business-section-text">
            Chỉ với vài bước đơn giản, doanh nghiệp của bạn có thể bắt đầu sử
            dụng TrustReview
          </Typography>
        </Box>

        <Box className="business-process-grid">
          <Box className="business-process-item">
            <Box className="business-process-number">
              <Typography variant="h5">1</Typography>
            </Box>
            <Typography variant="h6" className="business-process-title">
              Đăng Ký Tài Khoản
            </Typography>
            <Typography variant="body2" className="business-process-text">
              Tạo tài khoản doanh nghiệp và xác minh thông tin của bạn
            </Typography>
          </Box>
          <Box className="business-process-item">
            <Box className="business-process-number">
              <Typography variant="h5">2</Typography>
            </Box>
            <Typography variant="h6" className="business-process-title">
              Chọn Gói Dịch Vụ
            </Typography>
            <Typography variant="body2" className="business-process-text">
              Lựa chọn gói dịch vụ phù hợp với nhu cầu của doanh nghiệp
            </Typography>
          </Box>
          <Box className="business-process-item">
            <Box className="business-process-number">
              <Typography variant="h5">3</Typography>
            </Box>
            <Typography variant="h6" className="business-process-title">
              Bắt Đầu Sử Dụng
            </Typography>
            <Typography variant="body2" className="business-process-text">
              Truy cập dashboard và bắt đầu phân tích đánh giá sản phẩm
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="business-contact-section">
        <Card className="business-contact-card">
          <CardContent className="business-contact-content">
            <Box className="business-contact-grid">
              <Box>
                <Typography variant="h4" className="business-section-title">
                  Bạn Còn Thắc Mắc?
                </Typography>
                <Typography variant="body1" className="business-section-text">
                  Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc
                  mắc của bạn về dịch vụ TrustReview dành cho doanh nghiệp.
                </Typography>
                <Button variant="contained" component={Link} to="/lien-he">
                  Liên Hệ Ngay
                </Button>
              </Box>
              <Box className="business-contact-features">
                {[
                  {
                    title: "Hỗ trợ 24/7",
                    text: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn",
                  },
                  {
                    title: "Tư vấn miễn phí",
                    text: "Nhận tư vấn miễn phí về giải pháp phù hợp",
                  },
                  {
                    title: "Dùng thử miễn phí",
                    text: "Dùng thử gói Cao Cấp miễn phí trong 14 ngày",
                  },
                ].map((item, index) => (
                  <Box key={index} className="business-contact-feature">
                    <CheckCircleIcon className="business-icon" />
                    <Box>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography
                        variant="body2"
                        className="business-contact-text"
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="confirm-upgrade-dialog-title"
        classes={{ paper: "business-modal" }}
      >
        <DialogTitle
          id="confirm-upgrade-dialog-title"
          className="business-modal-title"
        >
          Xác Nhận Nâng Cấp
        </DialogTitle>
        <DialogContent className="business-modal-content">
          <Typography variant="body1">
            Bạn có chắc chắn muốn nâng cấp lên gói{" "}
            <strong>{selectedPackage?.name}</strong> với giá{" "}
            <strong>{selectedPackage?.price.toLocaleString()} VNĐ</strong> cho{" "}
            <strong>{selectedPackage?.duration} ngày</strong>?
          </Typography>
        </DialogContent>
        <DialogActions className="business-modal-actions">
          <Button
            onClick={handleCloseModal}
            className="business-modal-button business-modal-button-cancel"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmUpgrade}
            variant="contained"
            className="business-modal-button business-modal-button-confirm"
          >
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="business-feature-card">
      <CardHeader className="business-feature-header">
        {icon}
        <Typography variant="h6" className="business-feature-title">
          {title}
        </Typography>
      </CardHeader>
      <CardContent>
        <Typography variant="body2" className="business-feature-text">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}