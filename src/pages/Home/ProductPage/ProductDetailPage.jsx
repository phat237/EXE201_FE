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
import { useParams } from "react-router-dom";

// Hardcode dữ liệu bổ sung cho các trường thiếu từ API
const hardcodedProductData = {
  rating: 4.5, // Thiếu trong API, hardcode giá trị
  reviewCount: 128, // Thiếu trong API, hardcode giá trị
  ratingDistribution: [80, 30, 10, 5, 3], // ThiẾu trong API, hardcode
  aiAnalysis: {
    strengths: [
      "Hương vị thơm ngon",
      "Giá cả hợp lý",
      "Nguyên liệu tươi sạch",
      "Đóng gói tiện lợi",
    ],
    weaknessesრ: "https://minhtuanmobile.com/uploads/products/241207031455-3.webp",
    weaknesses: [
      "Hạn sử dụng ngắn",
      "Không phù hợp với người dị ứng gluten",
    ],
    summary:
      "Bánh mì Hoa Mai là một sản phẩm chất lượng với   cao cấp với hương vị thơm ngon và giá cả hợp lý. Đa số người dùng hài lòng với chất lượng và độ tươi của bánh. Tuy nhiên, hạn sử dụng ngắn và không phù hợp với người dị ứng gluten là một số điểm cần lưu ý.",
    sentiment: {
      positive: 80,
      neutral: 15,
      negative: 5,
    },
  },
};

// Dữ liệu reviews và relatedProducts giữ nguyên như trong code gốc
const reviews = [
  {
    id: 1,
    rating: 5,
    title: "Sản phẩm tuyệt vời",
    content:
      "Bánh mì Hoa Mai rất ngon, vỏ giòn, ruột mềm. Tôi đã mua nhiều lần và rất hài lòng.",
    verified: true,
    helpful: 42,
    date: "15/04/2023",
    user: "Người dùng ẩn danh",
    userInitials: "ND",
  },
  {
    id: 2,
    rating: 4,
    title: "Tốt nhưng cần cải thiện",
    content:
      "Bánh mì ngon, nhưng hạn sử dụng hơi ngắn. Nếu để lâu sẽ không còn giòn nữa.",
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
      "Bánh mì ăn được, nhưng không có gì đặc biệt. Tôi mong có thêm nhiều loại nhân hơn.",
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
    name: "Bánh mì pate",
    image: "/placeholder.svg?height=300&width=300",
    price: "15.000đ",
    rating: 4.2,
    reviewCount: 95,
  },
  {
    id: 3,
    name: "Bánh mì trứng",
    image: "/placeholder.svg?height=300&width=300",
    price: "12.000đ",
    rating: 4.7,
    reviewCount: 112,
  },
  {
    id: 4,
    name: "Bánh mì chả lụa",
    image: "/placeholder.svg?height=300&width=300",
    price: "18.000đ",
    rating: 4.0,
    reviewCount: 78,
  },
  {
    id: 5,
    name: "Bánh mì thịt nướng",
    image: "/placeholder.svg?height=300&width=300",
    price: "20.000đ",
    rating: 3.8,
    reviewCount: 45,
  },
];

export default function ProductDetailPage() {
  const { id: productId } = useParams(); // Lấy productId từ URL
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState("reviews");

  const dispatch = useDispatch();
  const { product, isLoading, error } = useSelector((state) => state.product);

  useEffect(() => {
    if (productId) {
      console.log("Dispatching fetchProductApiById with ID:", productId); // Kiểm tra productId
      dispatch(fetchProductApiById({ id: productId }))
        .unwrap()
        .then((data) => {
          console.log("API response data:", data); // Kiểm tra dữ liệu trả về từ API
        })
        .catch((err) => {
          console.error("API error:", err); // Kiểm tra lỗi nếu có
        });
    }
  }, [dispatch, productId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return <Typography>Đang tải chi tiết sản phẩm...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        Lỗi khi tải chi tiết sản phẩm: {error.message || error}
      </Typography>
    );
  }

  if (!product) {
    return <Typography>Không tìm thấy sản phẩm.</Typography>;
  }

  // Kết hợp dữ liệu từ API và dữ liệu hardcode
  const enrichedProduct = {
    ...product,
    ...hardcodedProductData,
    category: product.category || "Thực phẩm", // Nếu API không trả về category, hardcode
    price: product.price || "10.000đ", // Nếu API không trả về price, hardcode
  };

  return (
    <Box className="product-container">
      <Box className="product-main">
        <Box className="product-image-section">
          <Box className="product-main-image">
            <img
              src={enrichedProduct.sourceUrl || "/placeholder.svg"}
              alt={enrichedProduct.name}
              className="product-image"
            />
          </Box>
        </Box>

        <Box className="product-details">
          <Box className="product-header">
            <Box className="product-meta">
              <Typography variant="caption" className="product-category">
                {enrichedProduct.category}
              </Typography>
            </Box>
            <Typography variant="h4" className="product-name">
              {enrichedProduct.name}
            </Typography>
            <Typography variant="body2" className="product-brand-name">
              Thương hiệu: {enrichedProduct.brandName || "Không rõ"}
            </Typography>
            <Typography variant="caption" className="product-created-at">
              Ngày tạo: {new Date(enrichedProduct.createdAt).toLocaleDateString()}
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

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        className="product-tabs"
      >
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
                      <Typography
                        variant="h3"
                        className="product-rating-score"
                      >
                        {enrichedProduct.rating || 0}
                      </Typography>
                      <Box className="product-rating-stars">
                        <Rating
                          value={enrichedProduct.rating || 0}
                          readOnly
                          precision={0.5}
                          icon={<StarIcon className="product-star-icon" />}
                          emptyIcon={
                            <StarIcon className="product-star-icon-empty" />
                          }
                        />
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      className="product-write-review-button"
                      href={`/danh-gia/tao-moi?product=${enrichedProduct.id}`}
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
                              emptyIcon={
                                <StarIcon className="product-star-icon-empty" />
                              }
                            />
                            <Typography
                              variant="caption"
                              className="product-review-date"
                            >
                              {review.date}
                            </Typography>
                          </Box>
                          <Typography
                            variant="subtitle2"
                            className="product-review-title"
                          >
                            {review.title}
                          </Typography>
                        </Box>
                        <Avatar className="product-review-avatar">
                          <Typography variant="caption">
                            {review.userInitials}
                          </Typography>
                        </Avatar>
                      </Box>
                      <Typography
                        variant="body2"
                        className="product-review-text"
                      >
                        {review.content}
                      </Typography>
                      <Box className="product-review-footer">
                        <Box className="product-review-footer-left">
                          {review.verified && (
                            <Box className="product-review-verified">
                              <VerifiedIcon className="product-icon" />
                              <Typography variant="caption">
                                Đã xác minh bởi AI
                              </Typography>
                            </Box>
                          )}
                          <Typography
                            variant="caption"
                            className="product-review-user"
                          >
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
                  <Typography
                    variant="h6"
                    className="product-analysis-title"
                  >
                    Phân Tích AI
                  </Typography>
                </Box>
                <Box className="product-analysis-grid">
                  <Box className="product-analysis-strengths">
                    <Typography
                      variant="subtitle1"
                      className="product-analysis-subtitle"
                    >
                      Điểm Mạnh
                    </Typography>
                    <Box className="product-analysis-list">
                      {(enrichedProduct.aiAnalysis?.strengths || []).map(
                        (strength, index) => (
                          <Box
                            key={index}
                            className="product-analysis-item"
                          >
                            <VerifiedIcon className="product-icon" />
                            <Typography variant="body2">
                              {strength}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  </Box>
                  <Box className="product-analysis-weaknesses">
                    <Typography
                      variant="subtitle1"
                      className="product-analysis-subtitle"
                    >
                      Điểm Yếu
                    </Typography>
                    <Box className="product-analysis-list">
                      {(enrichedProduct.aiAnalysis?.weaknesses || []).map(
                        (weakness, index) => (
                          <Box
                            key={index}
                            className="product-analysis-item"
                          >
                            <FlagIcon className="product-icon" />
                            <Typography variant="body2">
                              {weakness}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box className="product-analysis-summary">
                  <Typography
                    variant="subtitle1"
                    className="product-analysis-subtitle"
                  >
                    Tóm Tắt Đánh Giá
                  </Typography>
                  <Typography
                    variant="body2"
                    className="product-analysis-text"
                  >
                    {enrichedProduct.aiAnalysis?.summary}
                  </Typography>
                </Box>
                <Box className="product-analysis-sentiment">
                  <Typography
                    variant="subtitle1"
                    className="product-analysis-subtitle"
                  >
                    Phân Tích Cảm Xúc
                  </Typography>
                  {enrichedProduct.aiAnalysis?.sentiment && (
                    <Box>
                      <Box className="product-sentiment-bar">
                        <Box
                          className="product-sentiment-positive"
                          style={{
                            width: `${enrichedProduct.aiAnalysis.sentiment.positive || 0}%`,
                          }}
                        ></Box>
                        <Box
                          className="product-sentiment-neutral"
                          style={{
                            width: `${enrichedProduct.aiAnalysis.sentiment.neutral || 0}%`,
                          }}
                        ></Box>
                        <Box
                          className="product-sentiment-negative"
                          style={{
                            width: `${enrichedProduct.aiAnalysis.sentiment.negative || 0}%`,
                          }}
                        ></Box>
                      </Box>
                      <Box className="product-sentiment-labels">
                        <Typography variant="caption">
                          Tích cực (
                          {enrichedProduct.aiAnalysis.sentiment.positive || 0}
                          %)
                        </Typography>
                        <Typography variant="caption">
                          Trung lập (
                          {enrichedProduct.aiAnalysis.sentiment.neutral || 0}
                          %)
                        </Typography>
                        <Typography variant="caption">
                          Tiêu cực (
                          {enrichedProduct.aiAnalysis.sentiment.negative || 0}
                          %)
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
                  <a
                    href={`/san-pham/${related.id}`}
                    className="product-related-link"
                  >
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
                        emptyIcon={
                          <StarIcon className="product-star-icon-empty" />
                        }
                      />
                      <Typography
                        variant="caption"
                        className="product-related-review-count"
                      >
                        ({related.reviewCount})
                      </Typography>
                    </Box>
                    <a
                      href={`/san-pham/${related.id}`}
                      className="product-related-link"
                    >
                      <Typography
                        variant="subtitle2"
                        className="product-related-name"
                      >
                        {related.name}
                      </Typography>
                    </a>
                    <Typography
                      variant="body2"
                      className="product-related-price"
                    >
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