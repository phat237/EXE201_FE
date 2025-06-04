import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductApiById } from "../../../store/slices/productSlice";
import { fetchReviewsByIdPaginated, createProductReview } from "../../../store/slices/reviewSlice";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
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

// Hardcode dữ liệu bổ sung
const hardcodedProductData = {
  ratingDistribution: [80, 30, 10, 5, 3],
  aiAnalysis: {
    strengths: [
      "Hương vị thơm ngon",
      "Giá cả hợp lý",
      "Nguyên liệu tươi sạch",
      "Đóng gói tiện lợi",
    ],
    weaknesses: [
      "Hạn sử dụng ngắn",
      "Không phù hợp với người dị ứng gluten",
    ],
    summary:
      "Bánh mì Hoa Mai là một sản phẩm chất lượng với cao cấp với hương vị thơm ngon và giá cả hợp lý. Đa số người dùng hài lòng với chất lượng và độ tươi của bánh. Tuy nhiên, hạn sử dụng ngắn và không phù hợp với người dị ứng gluten là một số điểm cần lưu ý.",
    sentiment: {
      positive: 80,
      neutral: 15,
      negative: 5,
    },
  },
};

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
  const { id: productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState("reviews");
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [page, setPage] = useState(0); // Trang hiện tại
  const [size, setSize] = useState(10); // Số review mỗi trang

  const dispatch = useDispatch();
  const { product, isLoading, error } = useSelector((state) => state.product);
  const { reviews, pagination, isLoading: reviewsLoading, error: reviewsError } = useSelector((state) => state.review);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductApiById({ id: productId }))
        .unwrap()
        .then((data) => {
          console.log("API response data:", data);
        })
        .catch((err) => {
          console.error("API error:", err);
        });

      dispatch(fetchReviewsByIdPaginated({ id: productId, page, size }))
        .unwrap()
        .then((data) => {
          console.log("Reviews API response:", data);
        })
        .catch((err) => {
          console.error("Reviews API error:", err);
        });
    }
  }, [dispatch, productId, page, size]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewRating(0);
    setReviewContent("");
  };

  const handleSubmitReview = () => {
    const reviewPayload = {
      rating: reviewRating,
      content: reviewContent,
    };
    dispatch(createProductReview({ productId, reviewData: reviewPayload }))
      .unwrap()
      .then((data) => {
        setSnackbarMessage("Đánh giá đã được gửi thành công!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleCloseReviewDialog();
        dispatch(fetchReviewsByIdPaginated({ id: productId, page: 0, size }));
      })
      .catch((err) => {
        setSnackbarMessage(`Lỗi khi gửi đánh giá: ${err.message || err}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleLoadMore = () => {
    if (pagination && page < pagination.totalPages - 1) {
      setPage(page + 1);
    }
  };

  if (isLoading || reviewsLoading) {
    return <Typography>Đang tải chi tiết sản phẩm...</Typography>;
  }

  if (error || reviewsError) {
    return (
      <Typography color="error">
        Lỗi khi tải chi tiết sản phẩm: {error?.message || error || reviewsError?.message || reviewsError}
      </Typography>
    );
  }

  if (!product) {
    return <Typography>Không tìm thấy sản phẩm.</Typography>;
  }

  const averageRating = reviews && reviews.length > 0
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
    : 0;
  const reviewCount = reviews ? reviews.length : 0;

  const enrichedProduct = {
    ...product,
    ...hardcodedProductData,
    rating: averageRating,
    reviewCount,
    category: product.category || "Thực phẩm",
    price: product.price || "10.000đ",
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
        <Tab label={`Đánh Giá (${reviewCount})`} value="reviews" />
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
                        <Typography variant="caption" className="product-review-count">
                          ({enrichedProduct.reviewCount} đánh giá)
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      className="product-write-review-button"
                      onClick={handleOpenReviewDialog}
                    >
                      Viết Đánh Giá
                    </Button>
                  </CardContent>
                </Card>
              </Box>
              <Box className="product-reviews-list">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
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
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="subtitle2" className="product-review-title">
                              {review.title}
                            </Typography>
                          </Box>
                          <Avatar className="product-review-avatar">
                            <Typography variant="caption">
                              {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                            </Typography>
                          </Avatar>
                        </Box>
                        <Typography variant="body2" className="product-review-text">
                          {review.content}
                        </Typography>
                        {review.aicomment && (
                          <Typography variant="caption" className="text-gray-600 italic mt-2">
                            Nhận xét AI: {review.aicomment}
                          </Typography>
                        )}
                        <Box className="product-review-footer">
                          <Box className="product-review-footer-left">
                            {review.verifiedByAI && (
                              <Box className="product-review-verified">
                                <VerifiedIcon className="product-icon" />
                                <Typography variant="caption">
                                  Đã xác minh bởi AI
                                </Typography>
                              </Box>
                            )}
                            <Typography variant="caption" className="product-review-user">
                              {review.userName || "Người dùng ẩn danh"}
                            </Typography>
                          </Box>
                          <Box className="product-review-footer-right">
                            <Button
                              variant="text"
                              className="product-review-helpful"
                              startIcon={<ThumbUpIcon className="product-icon" />}
                            >
                              {review.helpfulCount || 0} hữu ích
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
                  ))
                ) : (
                  <Typography variant="body1" className="no-reviews-message">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </Typography>
                )}
                {pagination && page < pagination.totalPages - 1 && (
                  <Box className="product-load-more">
                    <Button variant="outlined" onClick={handleLoadMore}>
                      Xem Thêm Đánh Giá
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Dialog
              open={openReviewDialog}
              onClose={handleCloseReviewDialog}
              maxWidth="md"
              fullWidth
              classes={{ paper: 'bg-white rounded-lg shadow-xl' }}
            >
              <DialogTitle className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">
                Đánh Giá Sản Phẩm: {enrichedProduct.name}
              </DialogTitle>
              <DialogContent className="p-6">
                <Box className="flex flex-col gap-6">
                  <Box>
                    <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                      Đánh giá sao
                    </Typography>
                    <Rating
                      value={reviewRating}
                      onChange={(event, newValue) => setReviewRating(newValue)}
                      precision={1}
                      icon={<StarIcon className="text-yellow-400" />}
                      emptyIcon={<StarIcon className="text-gray-300" />}
                      className="text-4xl"
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="text-lg font-semibold text-gray-700 mb-2">
                      Nội dung đánh giá
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label="Viết cảm nhận của bạn"
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      variant="outlined"
                      className="bg-gray-50 rounded-lg"
                      InputProps={{
                        className: 'text-gray-800',
                      }}
                      InputLabelProps={{
                        className: 'text-gray-600',
                      }}
                    />
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions className="p-6 flex justify-end gap-4 border-t border-gray-200">
                <Button
                  onClick={handleCloseReviewDialog}
                  variant="outlined"
                  className="text-gray-600 border-gray-300 hover:bg-gray-100"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  variant="contained"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  disabled={!reviewRating || !reviewContent}
                >
                  Gửi Đánh Giá
                </Button>
              </DialogActions>
            </Dialog>
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

                <Box className="product-analysis-aicomments">
                  <Typography
                    variant="subtitle1"
                    className="product-analysis-subtitle"
                  >
                    Nhận xét AI
                  </Typography>
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      review.aicomment && (
                        <Box key={index} className="product-analysis-item">
                          <Typography variant="body2" className="text-gray-600 italic">
                            - {review.aicomment}
                          </Typography>
                        </Box>
                      )
                    ))
                  ) : (
                    <Typography variant="body2" className="text-gray-600">
                      Chưa có nhận xét AI nào.
                    </Typography>
                  )}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}