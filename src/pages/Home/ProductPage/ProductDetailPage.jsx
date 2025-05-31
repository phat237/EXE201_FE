import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductApiById } from "../../../store/slices/productSlice";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Rating,
  Avatar,
} from "@mui/material";
import {
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  Flag as FlagIcon,
  Verified as VerifiedIcon,
  Share as ShareIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as HeartIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import "./ProductDetailPage.css";
import { useParams } from 'react-router-dom'; // Import hook

// Mock data (same as provided)
const products = [
  {
    id: 1,
    name: "Điện thoại XYZ Pro",
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500&text=Ảnh 2",
      "/placeholder.svg?height=500&width=500&text=Ảnh 3",
      "/placeholder.svg?height=500&width=500&text=Ảnh 4",
    ],
    price: "12.990.000đ",
    rating: 4.5,
    reviewCount: 128,
    category: "Điện tử",
    verified: true,
    description:
      "Điện thoại XYZ Pro với màn hình AMOLED 6.7 inch, chip xử lý mạnh mẽ, camera 108MP và pin 5000mAh. Thiết kế sang trọng, mỏng nhẹ và hiệu năng vượt trội.",
    specifications: [
      { name: "Màn hình", value: "AMOLED 6.7 inch" },
      { name: "Chip", value: "Snapdragon 8 Gen 2" },
      { name: "RAM", value: "12GB" },
      { name: "Bộ nhớ", value: "256GB" },
      { name: "Camera", value: "108MP + 12MP + 8MP" },
      { name: "Pin", value: "5000mAh" },
    ],
    ratingDistribution: [80, 30, 10, 5, 3],
    aiAnalysis: {
      strengths: [
        "Màn hình sắc nét, màu sắc chân thực",
        "Hiệu năng mạnh mẽ, không giật lag",
        "Camera chụp ảnh đẹp, đặc biệt trong điều kiện thiếu sáng",
        "Pin trâu, sử dụng được cả ngày",
      ],
      weaknesses: [
        "Giá thành cao",
        "Hơi nóng khi chơi game nặng",
        "Không có jack cắm tai nghe 3.5mm",
      ],
      summary:
        "Điện thoại XYZ Pro là một sản phẩm cao cấp với nhiều tính năng nổi bật. Đa số người dùng hài lòng với hiệu năng, camera và thời lượng pin. Tuy nhiên, một số người dùng phàn nàn về giá thành cao và việc thiếu jack cắm tai nghe 3.5mm.",
      sentiment: {
        positive: 75,
        neutral: 15,
        negative: 10,
      },
    },
  },
];

const reviews = [
  {
    id: 1,
    rating: 5,
    title: "Sản phẩm tuyệt vời",
    content:
      "Điện thoại XYZ Pro là một sản phẩm tuyệt vời. Màn hình đẹp, camera chụp rất đẹp và pin trâu. Tôi đã sử dụng được 2 tháng và rất hài lòng với hiệu năng của máy.",
    verified: true,
    helpful: 42,
    date: "15/04/2023",
    user: "Người dùng ẩn danh",
    userInitials: "ND",
  },
  {
    id: 2,
    rating: 4,
    title: "Tốt nhưng còn một số hạn chế",
    content:
      "Máy chạy rất mượt, camera chụp đẹp. Tuy nhiên, pin hơi nóng khi chơi game và sạc không được nhanh như quảng cáo. Nhìn chung vẫn là một sản phẩm tốt trong tầm giá.",
    verified: true,
    helpful: 28,
    date: "03/05/2023",
    user: "Người dùng ẩn danh",
    userInitials: "ND",
  },
  {
    id: 3,
    rating: 3,
    title: "Tạm ổn",
    content:
      "Máy hoạt động ổn định, nhưng không có gì đặc biệt so với các sản phẩm cùng phân khúc. Camera chụp trong điều kiện thiếu sáng không tốt như quảng cáo. Pin chỉ dùng được khoảng 1 ngày với nhu cầu sử dụng bình thường.",
    verified: false,
    helpful: 15,
    date: "22/05/2023",
    user: "Người dùng ẩn danh",
    userInitials: "ND",
  },
];

const relatedProducts = [
  {
    id: 2,
    name: "Điện thoại XYZ Lite",
    image: "/placeholder.svg?height=300&width=300",
    price: "8.990.000đ",
    rating: 4.2,
    reviewCount: 95,
  },
  {
    id: 3,
    name: "Điện thoại ABC Ultra",
    image: "/placeholder.svg?height=300&width=300",
    price: "14.990.000đ",
    rating: 4.7,
    reviewCount: 112,
  },
  {
    id: 4,
    name: "Tai nghe XYZ Buds",
    image: "/placeholder.svg?height=300&width=300",
    price: "2.490.000đ",
    rating: 4.0,
    reviewCount: 78,
  },
  {
    id: 5,
    name: "Sạc không dây XYZ",
    image: "/placeholder.svg?height=300&width=300",
    price: "890.000đ",
    rating: 3.8,
    reviewCount: 45,
  },
];

export default function ProductDetailPage() {
  const { productId } = useParams(); // Lấy productId từ URL
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState("reviews");

  const dispatch = useDispatch();
  const { product, isLoading, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductApiById({ id: productId }));
    }
  }, [dispatch, productId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return <Typography>Đang tải chi tiết sản phẩm...</Typography>;
  }

  if (error) {
    return <Typography color="error">Lỗi khi tải chi tiết sản phẩm: {error}</Typography>;
  }

  if (!product) {
    return <Typography>Không tìm thấy sản phẩm.</Typography>;
  }

  return (
    <Box className="product-container">
      <Box className="product-main">
        <Box className="product-image-section">
          <Box className="product-main-image">
            <img
              src={product.sourceUrl || "/placeholder.svg"}
              alt={product.name}
              className="product-image"
            />
          </Box>
        </Box>

        <Box className="product-details">
          <Box className="product-header">
            <Box className="product-meta">
              <Typography variant="caption" className="product-category">
                {product.category || "Không rõ"}
              </Typography>
            </Box>
            <Typography variant="h4" className="product-name">
              {product.name}
            </Typography>
            <Typography variant="body2" className="product-brand-name">
              Thương hiệu: {product.brandName || "Không rõ"}
            </Typography>
            <Typography variant="caption" className="product-created-at">
              Ngày tạo: {new Date(product.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box className="product-actions">
            <Button variant="contained" className="product-buy-button">
              <ShoppingCartIcon className="product-icon" />
              Mua Ngay
            </Button>
            <Button variant="outlined" className="product-favorite-button">
              <HeartIcon className="product-icon" />
              Yêu Thích
            </Button>
            <Button variant="outlined" className="product-share-button">
              <ShareIcon className="product-icon" />
            </Button>
          </Box>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} className="product-tabs">
        <Tab label={`Đánh Giá`} value="reviews" />
        <Tab label="Phân Tích AI" value="analysis" />
        <Tab label="Sản Phẩm Liên Quan" value="related" />
      </Tabs>

      <Box className="product-tabs-content">
        {tabValue === "reviews" && (
          <Box className="product-tab-panel">
            <Box className="product-reviews-section">
              <Box className="product-rating-summary">
                <Card className="product-rating-card">
                  <CardContent className="product-rating-content">
                    <Box className="product-rating-overview">
                      <Typography variant="h3" className="product-rating-score">
                        {product.rating || 0}
                      </Typography>
                      <Box className="product-rating-stars">
                        <Rating
                          value={product.rating || 0}
                          readOnly
                          precision={0.5}
                          icon={<StarIcon className="product-star-icon" />}
                          emptyIcon={<StarIcon className="product-star-icon-empty" />}
                        />
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      className="product-write-review-button"
                      href={`/danh-gia/tao-moi?product=${product.id}`}
                      component="a"
                    >
                      Viết Đánh Giá
                    </Button>
                  </CardContent>
                </Card>
              </Box>
              <Box className="product-reviews-list">
                {reviews.map((review) => (
                  <Card key={review.id} className="product-review-card">
                    <CardContent className="product-review-content">
                      <Box className="product-review-header">
                        <Box>
                          <Box className="product-review-rating">
                            <Rating
                              value={review.rating}
                              readOnly
                              icon={<StarIcon className="product-star-icon" />}
                              emptyIcon={<StarIcon className="product-star-icon-empty" />}
                            />
                            <Typography variant="caption" className="product-review-date">
                              {review.date}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle2" className="product-review-title">
                            {review.title}
                          </Typography>
                        </Box>
                        <Avatar className="product-review-avatar">
                          <Typography variant="caption">{review.userInitials}</Typography>
                        </Avatar>
                      </Box>
                      <Typography variant="body2" className="product-review-text">
                        {review.content}
                      </Typography>
                      <Box className="product-review-footer">
                        <Box className="product-review-footer-left">
                          {review.verified && (
                            <Box className="product-review-verified">
                              <VerifiedIcon className="product-icon" />
                              <Typography variant="caption">Đã xác minh bởi AI</Typography>
                            </Box>
                          )}
                          <Typography variant="caption" className="product-review-user">
                            {review.user}
                          </Typography>
                        </Box>
                        <Box className="product-review-footer-right">
                          <Button
                            variant="text"
                            className="product-review-helpful"
                            startIcon={<ThumbUpIcon className="product-icon" />}
                          >
                            {review.helpful} hữu ích
                          </Button>
                          <Button
                            variant="text"
                            className="product-review-report"
                            startIcon={<FlagIcon className="product-icon" />}
                          >
                            Báo cáo
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <Box className="product-load-more">
                  <Button variant="outlined">Xem Thêm Đánh Giá</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {tabValue === "analysis" && (
          <Box className="product-tab-panel">
            <Card className="product-analysis-card">
              <CardContent className="product-analysis-content">
                <Box className="product-analysis-header">
                  <BarChartIcon className="product-icon" />
                  <Typography variant="h6" className="product-analysis-title">
                    Phân Tích AI
                  </Typography>
                </Box>
                <Box className="product-analysis-grid">
                  <Box className="product-analysis-strengths">
                    <Typography variant="subtitle1" className="product-analysis-subtitle">
                      Điểm Mạnh
                    </Typography>
                    <Box className="product-analysis-list">
                      {(product.aiAnalysis?.strengths || []).map((strength, index) => (
                        <Box key={index} className="product-analysis-item">
                          <VerifiedIcon className="product-icon" />
                          <Typography variant="body2">{strength}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box className="product-analysis-weaknesses">
                    <Typography variant="subtitle1" className="product-analysis-subtitle">
                      Điểm Yếu
                    </Typography>
                    <Box className="product-analysis-list">
                      {(product.aiAnalysis?.weaknesses || []).map((weakness, index) => (
                        <Box key={index} className="product-analysis-item">
                          <FlagIcon className="product-icon" />
                          <Typography variant="body2">{weakness}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Box className="product-analysis-summary">
                  <Typography variant="subtitle1" className="product-analysis-subtitle">
                    Tóm Tắt Đánh Giá
                  </Typography>
                  <Typography variant="body2" className="product-analysis-text">
                    {product.aiAnalysis?.summary}
                  </Typography>
                </Box>
                <Box className="product-analysis-sentiment">
                  <Typography variant="subtitle1" className="product-analysis-subtitle">
                    Phân Tích Cảm Xúc
                  </Typography>
                  {product.aiAnalysis?.sentiment && (
                    <Box>
                      <Box className="product-sentiment-bar">
                        <Box
                          className="product-sentiment-positive"
                          style={{ width: `${product.aiAnalysis.sentiment.positive || 0}%` }}
                        ></Box>
                        <Box
                          className="product-sentiment-neutral"
                          style={{ width: `${product.aiAnalysis.sentiment.neutral || 0}%` }}
                        ></Box>
                        <Box
                          className="product-sentiment-negative"
                          style={{ width: `${product.aiAnalysis.sentiment.negative || 0}%` }}
                        ></Box>
                      </Box>
                      <Box className="product-sentiment-labels">
                        <Typography variant="caption">
                          Tích cực ({product.aiAnalysis.sentiment.positive || 0}%)
                        </Typography>
                        <Typography variant="caption">
                          Trung lập ({product.aiAnalysis.sentiment.neutral || 0}%)
                        </Typography>
                        <Typography variant="caption">
                          Tiêu cực ({product.aiAnalysis.sentiment.negative || 0}%)
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {tabValue === "related" && (
          <Box className="product-tab-panel">
            <Box className="product-related-grid">
              {relatedProducts.map((related) => (
                <Card key={related.id} className="product-related-card">
                  <a href={`/san-pham/${related.id}`} className="product-related-link">
                    <Box className="product-related-image">
                      <img
                        src={related.image || "/placeholder.svg"}
                        alt={related.name}
                        className="product-image"
                      />
                    </Box>
                  </a>
                  <CardContent className="product-related-content">
                    <Box className="product-related-rating">
                      <Rating
                        value={related.rating}
                        readOnly
                        precision={0.5}
                        icon={<StarIcon className="product-star-icon" />}
                        emptyIcon={<StarIcon className="product-star-icon-empty" />}
                      />
                      <Typography variant="caption" className="product-related-review-count">
                        ({related.reviewCount})
                      </Typography>
                    </Box>
                    <a href={`/san-pham/${related.id}`} className="product-related-link">
                      <Typography variant="subtitle2" className="product-related-name">
                        {related.name}
                      </Typography>
                    </a>
                    <Typography variant="body2" className="product-related-price">
                      {related.price}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}