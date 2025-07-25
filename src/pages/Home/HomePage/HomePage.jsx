import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchAllProductsPaginated, fetchSortedRating } from "../../../store/slices/productSlice";
import { averageRating } from "../../../store/slices/reviewSlice";
import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import image1 from "../../../assets/Lovepik_com-450122121-Person giving online reviews .png";
import Loading from "../../../components/Loading/Loading";

const ScrollToTop = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  return null;
};

export default function HomePage() {
  const dispatch = useDispatch();

  const {
    allProducts,
    isLoading: productsLoading,
    error: productsError,
    topRatedProducts,
    isLoadingTopRated,
    errorTopRated
  } = useSelector((state) => ({
    allProducts: state.product.allProducts,
    isLoading: state.product.isLoading,
    error: state.product.error,
    topRatedProducts: state.product.topRatedProducts,
    isLoadingTopRated: state.product.isLoadingTopRated,
    errorTopRated: state.product.errorTopRated
  }));
  const {
    averageRating: ratings,
    isLoading: ratingsLoading,
    error: ratingsError,
  } = useSelector((state) => state.review);

  // Gọi fetchAllProductsPaginated khi mount để lấy sản phẩm mới nhất
  useEffect(() => {
    dispatch(
      fetchAllProductsPaginated({
        page: 0,
        size: 8,
        sortBy: "createdAt",
        sortDir: "desc",
      })
    );
  }, [dispatch]);

  // Gọi averageRating cho từng sản phẩm topRatedProducts khi có dữ liệu
  useEffect(() => {
    if (topRatedProducts && topRatedProducts.length > 0) {
      topRatedProducts.forEach((product) => {
        dispatch(averageRating(product.id));
      });
    }
  }, [topRatedProducts, dispatch]);

  // Gọi fetchSortedRating khi mount để lấy sản phẩm được đánh giá cao nhất
  useEffect(() => {
    dispatch(fetchSortedRating({ page: 0, size: 4 }));
  }, [dispatch]);

  console.log("Current ratings:", ratings);

  // Latest products: first 4 products (already sorted by createdAt)
  const newestProducts = allProducts ? allProducts.slice(0, 4) : [];

  // Highly rated products: lấy từ topRatedProducts (đã bị ghi đè bởi fetchSortedRating)
  const highlyRatedProducts = topRatedProducts ? topRatedProducts.slice(0, 4) : [];

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

  const renderStars = (rating) => {
    const totalStars = 5;
    const displayRating = rating !== undefined ? Math.round(rating) : 0;
    const filledStars = displayRating;
    const emptyStars = totalStars - filledStars;

    return (
      <Box className="star-rating">
        <span className="filled-stars">{"★".repeat(filledStars)}</span>
        <span className="empty-stars">{"☆".repeat(emptyStars)}</span>
        <Typography component="span" className="rating-count" sx={{ marginLeft: "8px" }}>
          {rating || 0}
        </Typography>
        {/* <Typography component="span" sx={{ ml: 1, fontSize: "1rem" }}>
          {rating.toFixed(1)}
        </Typography> */}
      </Box>
    );
  };

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
            <Button
              variant="outlined"
              className="view-all-button"
              component={Link}
              to="/san-pham"
              onClick={() => window.scrollTo(0, 0)}
            >
              Xem tất cả
            </Button>
          </Box>
          {productsLoading || ratingsLoading ? (
            <Typography sx={{ marginLeft: "50%" }}>
              <Loading />
            </Typography>
          ) : productsError || ratingsError ? (
            <Typography color="error">
              Lỗi khi tải dữ liệu:{" "}
              {productsError?.message ||
                productsError ||
                ratingsError?.message ||
                ratingsError}
            </Typography>
          ) : newestProducts.length > 0 ? (
            <Box className="latest-products-cards">
              {newestProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/san-pham/${product.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card className="product-card">
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        product.sourceUrl ||
                        "https://via.placeholder.com/300x200"
                      }
                      alt={product.name}
                    />
                    <CardContent>
                      <Box>
                        <Typography variant="h6" className="product-card-title">
                          {product.name}
                        </Typography>
                        <Typography className="product-card-description">
                          {product.category || "Không có mô tả."}
                        </Typography>
                      </Box>
                      <Box className="product-card-rating">
                        {renderStars(ratings[product.id])}
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Box>
          ) : (
            <Typography>Không có sản phẩm mới nào.</Typography>
          )}
        </section>

        <section className="highly-rated-products-container hidden">
          <Box className="highly-rated-products-header">
            <Typography variant="h2" className="highly-rated-products-title">
              Sản phẩm được đánh giá cao nhất
            </Typography>
            <Button
              variant="outlined"
              className="view-all-button"
              component={Link}
              to="/san-pham"
              onClick={() => window.scrollTo(0, 0)}
            >
              Xem tất cả
            </Button>
          </Box>
          {isLoadingTopRated ? (
            <Typography sx={{ marginLeft: "50%" }}>
              <Loading />
            </Typography>
          ) : errorTopRated ? (
            <Typography color="error">
              Lỗi khi tải dữ liệu: {errorTopRated?.message || errorTopRated}
            </Typography>
          ) : highlyRatedProducts.length > 0 ? (
            <Box className="highly-rated-products-cards">
              {highlyRatedProducts.map((product) => {
                const productRating = ratings[product.id];
                const avg = typeof productRating === 'object' ? productRating.averageRating : productRating;
                const reviewers = typeof productRating === 'object' ? productRating.totalReviewers : 0;
                return (
                  <Link
                    key={product.id}
                    to={`/san-pham/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card className="product-card">
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.sourceUrl || "https://via.placeholder.com/300x200"}
                        alt={product.name}
                      />
                      <CardContent>
                        <Box>
                          <Typography variant="h6" className="product-card-title">
                            {product.name}
                          </Typography>
                          <Typography className="product-card-description">
                            {product.category || "Không có mô tả."}
                          </Typography>
                        </Box>
                        <Box className="product-card-rating">
                          {renderStars(avg || 0)}
                         
                        </Box>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </Box>
          ) : (
            <Typography>Không có sản phẩm được đánh giá cao.</Typography>
          )}
        </section>
      </Box>
      <section className="footer-home hidden">
        <div className="footer-box">
          <h2 className="footer-title">Bắt đầu đánh giá ngay</h2>
          <p className="footer-text">
            Tham gia cộng đồng TrustReview để chia sẻ trải nghiệm của bạn và
            giúp người khác đưa ra quyết định mua sắm tốt hơn.
          </p>
          <Button className="footer-button">
            <Link to="">Đăng ký ngay</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

