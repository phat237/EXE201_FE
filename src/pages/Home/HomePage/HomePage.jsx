import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ReportIcon from "@mui/icons-material/Report";
import "./HomePage.css";
import { Link } from "react-router-dom";
import image1 from "../../../assets/Lovepik_com-450122121-Person giving online reviews .png";
import { useEffect } from "react";

export default function HomePage() {
  const featuresData = [
    {
      icon: <VisibilityIcon className="feature-icon2" />,
      title: "Đánh giá ẩn danh",
      description:
        "Người dùng có thể đánh giá sản phẩm một cách ẩn danh, giúp đảm bảo tính khách quan và trung thực.",
    },
    {
      icon: <AnalyticsIcon className="feature-icon2" />,
      title: "Phân tích AI",
      description:
        "Hệ thống AI phân tích nội dung đánh giá để xác định tính xác thực và lọc ra các đánh giá spam.",
    },
    {
      icon: <ReportIcon className="feature-icon2" />,
      title: "Phản hồi và báo cáo",
      description:
        "Người dùng có thể phản hồi và báo cáo các đánh giá không phù hợp để duy trì chất lượng nội dung.",
    },
  ];

  const productsData = [
    {
      title: "iPhone 15 Pro",
      description:
        "Điện thoại thông minh cao cấp với camera chuyên nghiệp, hiệu suất mạnh mẽ.",
      image: "https://phukiencasu.com/wp-content/uploads/2022/08/tai-nghe-bluetooth-tai-tho-de-thuong-3.jpg",
      rating: 0,
    },
    {
      title: "Samsung Galaxy S23",
      description:
        "Điện thoại Android hàng đầu với màn hình AMOLED và camera đẳng cấp.",
      image: "https://via.placeholder.com/300x200?text=Samsung+Galaxy+S23",
      rating: 0,
    },
    {
      title: "MacBook Air M2",
      description:
        "Laptop mỏng nhẹ với hiệu suất vượt trội, lý tưởng cho công việc di động.",
      image: "https://via.placeholder.com/300x200?text=MacBook+Air+M2",
      rating: 0,
    },
    {
      title: "Sony WH-1000XM5",
      description:
        "Tai nghe chống ồn cao cấp với chất lượng âm thanh vượt trội.",
      image: "https://via.placeholder.com/300x200?text=Sony+WH-1000XM5",
      rating: 4,
    },
  ];

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    const emptyStars = totalStars - filledStars;

    return (
      <Box className="star-rating">
        <span className="filled-stars">{"★".repeat(filledStars)}</span>
        <span className="empty-stars">{"☆".repeat(emptyStars)}</span>
        <Typography component="span" className="rating-count">
          ({rating})
        </Typography>
      </Box>
    );
  };

  const newestProducts = productsData.slice(0, 4);
  const highlyRatedProducts = [...productsData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <section className="banner-container hidden">
        <div className="content-wrapper">
          <Box className="banner-left">
            <Typography variant="h1" className="banner-title">
              Đánh giá sản phẩm một cách minh bạch
            </Typography>
            <Typography className="banner-description">
              Nền tảng cho phép người dùng đánh giá sản phẩm một cách ẩn danh
              hoặc công khai, với sự hỗ trợ của AI để đảm bảo tính chính xác và
              hữu ích.
            </Typography>
            <Button variant="contained" className="banner-button">
              Khám phá sản phẩm
            </Button>
            <Button variant="contained" className="banner-button-more">
              Tìm Hiểu Thêm
            </Button>
          </Box>
          <Box className="banner-right">
            <div className="image-placeholder">
              <img src={image1} alt="Person giving online reviews" />
            </div>
          </Box>
        </div>
      </section>
      <Box className="homePage">
        <section className="features-container hidden">
          <Box className="features-header">
            <Typography variant="h2" className="features-title">
              Tính năng nổi bật
            </Typography>
            <Typography className="features-description">
              Reviewon cung cấp nhiều tính năng giúp người dùng đánh giá và tìm
              kiếm sản phẩm một cách đáng và tin cậy.
            </Typography>
          </Box>
          <Box className="features-cards">
            {featuresData.map((feature, index) => (
              <Card className="feature-card" key={index}>
                <CardContent>
                  <Box className="feature-icon1">{feature.icon}</Box>
                  <Typography variant="h6" className="feature-card-title">
                    {feature.title}
                  </Typography>
                  <Typography className="feature-card-description">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </section>

        <section className="latest-products-container hidden">
          <Box className="latest-products-header">
            <Typography variant="h2" className="latest-products-title">
              Sản phẩm mới nhất
            </Typography>
            <Button variant="outlined" className="view-all-button">
              Xem tất cả
            </Button>
          </Box>
          <Box className="latest-products-cards">
            {newestProducts.map((product, index) => (
              <Card className="product-card" key={index}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                />
                <CardContent>
                  <Box>
                    <Typography variant="h6" className="product-card-title">
                      {product.title}
                    </Typography>
                    <Typography className="product-card-description">
                      {product.description}
                    </Typography>
                  </Box>
                  <Box className="product-card-rating">
                    {renderStars(product.rating)}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </section>

        <section className="highly-rated-products-container hidden">
          <Box className="highly-rated-products-header">
            <Typography variant="h2" className="highly-rated-products-title">
              Sản phẩm được đánh giá cao nhất
            </Typography>
            <Button variant="outlined" className="view-all-button">
              Xem tất cả
            </Button>
          </Box>
          <Box className="highly-rated-products-cards">
            {highlyRatedProducts.map((product, index) => (
              <Card className="product-card" key={index}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                />
                <CardContent>
                  <Box>
                    <Typography variant="h6" className="product-card-title">
                      {product.title}
                    </Typography>
                    <Typography className="product-card-description">
                      {product.description}
                    </Typography>
                  </Box>
                  <Box className="product-card-rating">
                    {renderStars(product.rating)}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </section>
      </Box>
      <section className="footer-home hidden">
        <div className="footer-box">
          <h2 className="footer-title">Bắt đầu đánh giá ngay</h2>
          <p className="footer-text">
            Tham gia cộng đồng TrustReview  để chia sẻ trải nghiệm của bạn và giúp
            người khác đưa ra quyết định mua sắm tốt hơn.
          </p>
          <Button className="footer-button">
            <Link to="">Đăng ký ngay</Link>
          </Button>
        </div>
      </section>
    </>
  );
}