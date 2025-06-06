import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
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
import { Link } from "react-router-dom";
import "./BusinessPage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPremiumPackages } from "../../../store/slices/preniumPackageSlice";


export default function BusinessPage() {
  const dispatch = useDispatch();
  const { data: packages, loading, error } = useSelector((state) => state.premiumPackages);

  useEffect(() => {
    dispatch(fetchPremiumPackages());
  }, [dispatch]);

  useEffect(() => {
    console.log("Packages state:", packages);
    console.log("Is Loading:", loading);
    console.log("Error:", error);
  }, [packages, loading, error]);

  return (
    <Box className="business-container">
      <Box className="business-header">
        <Box>
          <Typography variant="h3" className="business-title">
            Giải Pháp Cho Doanh Nghiệp
          </Typography>
          <Typography variant="body1" className="business-subtitle">
            Nâng cao hiệu quả kinh doanh với các công cụ phân tích đánh giá chuyên sâu
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
              TrustReview cung cấp nền tảng đánh giá ẩn danh với công nghệ AI tiên tiến, giúp doanh nghiệp hiểu rõ hơn về phản hồi của khách hàng và cải thiện sản phẩm, dịch vụ.
            </Typography>
            <Box className="business-features-list">
              {[
                { icon: <VerifiedIcon className="business-icon" />, text: "Đánh giá trung thực từ người dùng thực" },
                { icon: <CheckCircleIcon className="business-icon" />, text: "Phân tích AI chuyên sâu về đánh giá sản phẩm" },
                { icon: <BarChartIcon className="business-icon" />, text: "Báo cáo chi tiết và xu hướng thị trường" },
                { icon: <PeopleIcon className="business-icon" />, text: "Hiểu rõ nhu cầu và mong đợi của khách hàng" },
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
                src="/placeholder.svg?height=500&width=700"
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
            Lựa chọn gói dịch vụ phù hợp với nhu cầu và quy mô doanh nghiệp của bạn
          </Typography>
        </Box>

        <Box className="business-tabs-content">
          {loading ? (
            <Typography>Đang tải...</Typography>
          ) : error ? (
            <Typography color="error">Lỗi: {error}</Typography>
          ) : (
            packages && packages.length > 0 ? (
                <Box className="business-pricing-grid">
                  {(packages || []).slice().sort((a, b) => a.id - b.id).map((pkg) => (
                    <PricingCard
                      key={pkg.id}
                      title={pkg.name}
                      price={pkg.price === 0 ? "Miễn phí" : `${pkg.price.toLocaleString()}đ/${pkg.duration} ngày`}
                      description={pkg.description}
                      features={[
                        "Tính năng 1", "Tính năng 2"
                      ]}
                      buttonText="Nâng Cấp Ngay"
                      buttonLink="/doanh-nghiep/dang-ky"
                      highlighted
                    />
                  ))}
                </Box>
            ) : (
                <Typography>Không tìm thấy gói dịch vụ nào.</Typography>
            )
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
            Chỉ với vài bước đơn giản, doanh nghiệp của bạn có thể bắt đầu sử dụng TrustReview
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

        <Box className="business-process-cta">
          <Button variant="contained" component={Link} to="/doanh-nghiep/dang-ky">
            Bắt Đầu Ngay
            <ArrowForwardIcon className="business-icon" />
          </Button>
        </Box>
      </Box>

      <Box className="business-clients-section">
        <Box className="business-section-header">
          <Typography variant="h3" className="business-section-title">
            Khách Hàng Tin Tưởng
          </Typography>
          <Typography variant="body1" className="business-section-text">
            Hàng nghìn doanh nghiệp đã tin tưởng và sử dụng TrustReview
          </Typography>
        </Box>

        <Box className="business-clients-grid">
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} className="business-client-logo">
              <img
                src={`/placeholder.svg?height=80&width=160&text=Logo ${i}`}
                alt={`Khách hàng ${i}`}
                className="business-logo-image"
              />
            </Box>
          ))}
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
                  Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn về dịch vụ TrustReview dành cho doanh nghiệp.
                </Typography>
                <Button variant="contained" component={Link} to="/lien-he">
                  Liên Hệ Ngay
                </Button>
              </Box>
              <Box className="business-contact-features">
                {[
                  { title: "Hỗ trợ 24/7", text: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn" },
                  { title: "Tư vấn miễn phí", text: "Nhận tư vấn miễn phí về giải pháp phù hợp" },
                  { title: "Dùng thử miễn phí", text: "Dùng thử gói Cao Cấp miễn phí trong 14 ngày" },
                ].map((item, index) => (
                  <Box key={index} className="business-contact-feature">
                    <CheckCircleIcon className="business-icon" />
                    <Box>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" className="business-contact-text">
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

function PricingCard({ title, price, description, features, buttonText, buttonLink, highlighted = false }) {
  return (
    <Card className={`business-pricing-card ${highlighted ? "business-pricing-highlighted" : ""}`}>
      <CardHeader className="business-pricing-header">
        <Typography variant="h6" className="business-pricing-title">
          {title}
        </Typography>
        <Typography variant="h4" className="business-pricing-price">
          {price}
        </Typography>
      </CardHeader>
      <CardContent className="business-pricing-content">
        <Box className="business-pricing-features">
          <Box className="business-pricing-feature">
            <CheckCircleIcon className="business-icon" />
            <Typography variant="body2">{description}</Typography>
          </Box>
        </Box>
      </CardContent>
      <Box className="business-pricing-footer">
        <Button
          variant={highlighted ? "contained" : "outlined"}
          component={Link}
          to={buttonLink}
          className="business-pricing-button"
        >
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
}