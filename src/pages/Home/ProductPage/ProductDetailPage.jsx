import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductApiById,
  fetchAllProductsPaginated,
} from "../../../store/slices/productSlice";
import {
  fetchReviewsByIdPaginated,
  createProductReview,
  markReviewHelpful,
} from "../../../store/slices/reviewSlice";
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
  Pagination,
} from "@mui/material";
import {
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  Flag as FlagIcon,
  Verified as VerifiedIcon,
  Share as ShareIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import "./ProductDetailPage.css";
import { useParams } from "react-router-dom";
import { useNotification } from "../../../Context/NotificationContext";
import { toast } from "react-hot-toast";
import LoadingDetail from "../../../components/Loading/LoadingDetail";

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
    weaknesses: ["Hạn sử dụng ngắn", "Không phù hợp với người dị ứng gluten"],
    summary:
      "Sản phẩm chất lượng cao với hương vị thơm ngon và giá cả hợp lý. Đa số người dùng hài lòng với chất lượng và độ tươi. Tuy nhiên, hạn sử dụng ngắn và không phù hợp với người dị ứng gluten là một số điểm cần lưu ý.",
  },
};

export default function ProductDetailPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState("reviews");
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [helpfulStatus, setHelpfulStatus] = useState({});
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const reviewsSectionRef = useRef(null);

  const dispatch = useDispatch();
  const { addNotification } = useNotification();
  const { currentUser } = useSelector((state) => state.auth);

  const {
    product,
    allProducts,
    isLoading: productLoading,
    error: productError,
  } = useSelector((state) => state.product);
  const {
    reviews,
    pagination,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state) => state.review);

  useEffect(() => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để xem chi tiết sản phẩm!");
      navigate("/auth/login");
      return;
    }

    if (productId) {
      dispatch(fetchProductApiById({ id: productId }))
        .unwrap()
        .then((data) => {
          console.log("Product API response data:", data);
        })
        .catch((err) => {
          console.error("Product API error:", err);
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
  }, [dispatch, productId, page, size, currentUser, navigate]);

  useEffect(() => {
    if (product?.category) {
      dispatch(
        fetchAllProductsPaginated({
          page: 0,
          size: 4,
          categories: product.category,
        })
      )
        .unwrap()
        .then((data) => {
          console.log("Related products API response:", data);
        })
        .catch((err) => {
          console.error("Related products API error:", err);
        });
    }
  }, [dispatch, product?.category]);

  const relatedProducts =
    allProducts
      ?.filter(
        (p) => p.id !== Number(productId) && p.category === product?.category
      )
      ?.slice(0, 4) || [];

  const analyzeSentiment = (reviews) => {
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    const totalReviews = reviews?.length || 0;

    console.log("Input reviews for sentiment analysis:", reviews);

    if (!reviews || totalReviews === 0) {
      console.log("No reviews to analyze, returning default sentiment");
      return { positive: 0, neutral: 0, negative: 0 };
    }

    reviews.forEach((review, index) => {
      const comment = review.aicomment ? review.aicomment.toLowerCase() : "";
      const content = review.content ? review.content.toLowerCase() : "";
      const rating = review.rating || 0;

      console.log(`Processing Review ${index + 1}:`, {
        id: review.id,
        comment,
        content,
        rating,
      });

      if (comment) {
        console.log(`Analyzing aicomment: "${comment}"`);
        if (
          comment.includes("không hài lòng") ||
          comment.includes("số sao thấp") ||
          comment.includes("tệ") ||
          comment.includes("kém")
        ) {
          negative += 1;
          console.log(`Classified as NEGATIVE based on aicomment`);
        } else if (
          comment.includes("hài lòng") ||
          comment.includes("tốt") ||
          comment.includes("đỉnh") ||
          comment.includes("tuyệt vời") ||
          comment.includes("số sao cao")
        ) {
          positive += 1;
          console.log(`Classified as POSITIVE based on aicomment`);
        } else if (
          comment.includes("bình thường") ||
          comment.includes("khá ổn")
        ) {
          neutral += 1;
          console.log(`Classified as NEUTRAL based on aicomment`);
        } else {
          console.log(
            `No clear sentiment in aicomment, falling back to rating/content`
          );
          if (rating >= 4) {
            positive += 1;
            console.log(`Classified as POSITIVE based on rating >= 4`);
          } else if (rating === 3) {
            neutral += 1;
            console.log(`Classified as NEUTRAL based on rating = 3`);
          } else if (
            rating <= 2 ||
            content.includes("tệ") ||
            content.includes("kém") ||
            content.includes("không tốt")
          ) {
            negative += 1;
            console.log(
              `Classified as NEGATIVE based on rating <= 2 or negative content`
            );
          } else {
            neutral += 1;
            console.log(`Classified as NEUTRAL by default`);
          }
        }
      } else {
        console.log(
          `No aicomment, analyzing rating: ${rating}, content: "${content}"`
        );
        if (rating >= 4) {
          positive += 1;
          console.log(`Classified as POSITIVE based on rating >= 4`);
        } else if (rating === 3) {
          neutral += 1;
          console.log(`Classified as NEUTRAL based on rating = 3`);
        } else if (
          rating <= 2 ||
          content.includes("tệ") ||
          content.includes("kém") ||
          content.includes("không tốt")
        ) {
          negative += 1;
        } else {
          neutral += 1;
        }
      }
    });

    const positivePercentage = totalReviews
      ? (positive / totalReviews) * 100
      : 0;
    const neutralPercentage = totalReviews ? (neutral / totalReviews) * 100 : 0;
    const negativePercentage = totalReviews
      ? (negative / totalReviews) * 100
      : 0;

    const sentimentResult = {
      positive: positivePercentage,
      neutral: neutralPercentage,
      negative: negativePercentage,
    };
    return sentimentResult;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleViewReview = () => {
    setTabValue("reviews");
    if (reviewsSectionRef.current) {
      reviewsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
        setSnackbarMessage("Đánh giá được gửi thành công!");
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

  const handleMarkHelpful = (reviewId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle trạng thái
    dispatch(markReviewHelpful({ reviewId, status: newStatus }))
      .unwrap()
      .then(() => {
        setHelpfulStatus((prev) => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], helpful: newStatus },
        }));
        addNotification(
          newStatus
            ? "Bạn vừa đánh dấu một đánh giá là hữu ích!"
            : "Bạn vừa hủy đánh dấu hữu ích cho một đánh giá."
        );
      })
      .catch((err) => {
        addNotification(`Lỗi khi đánh dấu hữu ích: ${err.message || err}`);
      });
  };

  const handleReport = (reviewId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle trạng thái
    dispatch(markReviewHelpful({ reviewId, status: !newStatus })) // Báo cáo là status: false
      .unwrap()
      .then(() => {
        setHelpfulStatus((prev) => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], reported: newStatus },
        }));
        setSnackbarMessage(
          newStatus ? "Đã báo cáo đánh giá!" : "Đã hủy báo cáo!"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setSnackbarMessage(`Lỗi: ${err.message || err}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleLoadMore = () => {
    if (pagination && page < pagination.totalPages - 1) {
      setPage(page + 1);
    }
  };

  // Thêm hàm xử lý phân trang
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  // Tính toán reviews cần hiển thị cho trang hiện tại
  const indexOfLastReview = (currentPage + 1) * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  if (productLoading || reviewsLoading) {
    return (
      <Typography>
        {" "}
        <LoadingDetail />
      </Typography>
    );
  }

  if (productError || reviewsError) {
    return (
      <Typography color="error">
        Lỗi khi tải sản phẩm:
        {productError?.message ||
          productError ||
          reviewsError?.message ||
          reviewsError}
      </Typography>
    );
  }

  if (!product) {
    return <Typography>Không tìm thấy sản phẩm.</Typography>;
  }

  const averageRating =
    reviews && reviews.length > 0
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;
  const reviewCount = reviews ? reviews.length : 0;

  const enrichedProduct = {
    ...product,
    ...hardcodedProductData,
    rating: averageRating,
    reviewCount,
    category: product.category || "DIEN_THOAI",
    price: product.price,
  };

  const sentimentAnalysis = analyzeSentiment(reviews);

  // Sắp xếp và lấy 3 nhận xét AI mới nhất
  const latestAIComments = reviews
    ? [...reviews]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter((review) => review.aicomment)
        .slice(0, 3)
    : [];

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
              Ngày tạo:{" "}
              {new Date(enrichedProduct.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box className="product-actions">
            <Button
              variant="contained"
              className="product-review-button"
              onClick={handleViewReview}
              style={{ backgroundColor: "#6517ce", color: "white" }}
            >
              Xem Đánh Giá
            </Button>
            <Button
              variant="outlined"
              className="product-share-button"
              style={{ borderColor: "#6517ce", color: "#6517ce" }}
            >
              <ShareIcon className="product-icon" />
            </Button>
          </Box>
        </Box>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        className="product-tabs"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#6517ce",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#6517ce",
          },
        }}
      >
        <Tab label={`Đánh Giá (${reviewCount})`} value="reviews" />
        <Tab label="Phân Tích AI" value="analysis" />
        <Tab label="Sản Phẩm Liên Quan" value="related" />
      </Tabs>

      <Box className="product-tabs-content" ref={reviewsSectionRef}>
        {tabValue === "reviews" && (
          <Box className="product-tab-panel">
            <Box className="product-reviews-section">
              <Box className="product-rating-summary">
                <Card className="product-rating-card">
                  <CardContent className="product-rating-content">
                    <Box className="product-rating-overview">
                      <Typography variant="h3" className="product-rating-score">
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
                        <Typography
                          variant="caption"
                          className="product-review-count"
                        >
                          ({enrichedProduct.reviewCount} đánh giá)
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      className="product-write-review-button"
                      onClick={handleOpenReviewDialog}
                      style={{ backgroundColor: "#6517ce", color: "white" }}
                    >
                      Viết Đánh Giá
                    </Button>
                  </CardContent>
                </Card>
              </Box>
              <Box className="product-reviews-list">
                {currentReviews && currentReviews.length > 0 ? (
                  <>
                    {currentReviews.map((review) => (
                      <Card key={review.id} className="product-review-card">
                        <CardContent className="product-review-content">
                          <Box className="product-review-header">
                            <Box>
                              <Box className="product-review-rating">
                                <Rating
                                  value={review.rating}
                                  readOnly
                                  icon={
                                    <StarIcon className="product-star-icon" />
                                  }
                                  emptyIcon={
                                    <StarIcon className="product-star-icon-empty" />
                                  }
                                />
                                <Typography
                                  variant="caption"
                                  className="product-review-date"
                                >
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Avatar className="product-review-avatar">
                              <Typography variant="caption">
                                {review.userName
                                  ? review.userName.charAt(0).toUpperCase()
                                  : "U"}
                              </Typography>
                            </Avatar>
                          </Box>
                          <Typography
                            variant="body2"
                            className="product-review-text"
                            sx={{
                              color: "#222",
                              fontWeight: 500,
                              fontSize: 15,
                            }}
                          >
                            {review.content}
                          </Typography>
                          {review.aicomment && (
                            <Typography
                              variant="caption"
                              className="text-gray-600 italic mt-2"
                              sx={{
                                color: "#777",
                                fontSize: 13,
                                fontStyle: "italic",
                              }}
                            >
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
                              <Typography
                                variant="caption"
                                className="product-review-user"
                              >
                                {review.userName || "Người dùng ẩn danh"}
                              </Typography>
                            </Box>
                            <Box className="product-review-footer-right">
                              <Button
                                variant="text"
                                className="product-review-helpful"
                                startIcon={
                                  <ThumbUpIcon className="product-icon" />
                                }
                                onClick={() =>
                                  handleMarkHelpful(
                                    review.id,
                                    helpfulStatus[review.id]?.helpful || false
                                  )
                                }
                                style={{
                                  color: helpfulStatus[review.id]?.helpful
                                    ? "#6517ce"
                                    : "inherit",
                                }}
                              >
                                {review.helpfulCount || 0} hữu ích
                              </Button>
                              <Button
                                variant="text"
                                className="product-review-report"
                                startIcon={
                                  <FlagIcon className="product-icon" />
                                }
                                onClick={() =>
                                  handleReport(
                                    review.id,
                                    helpfulStatus[review.id]?.reported || false
                                  )
                                }
                                style={{
                                  color: helpfulStatus[review.id]?.reported
                                    ? "#6517ce"
                                    : "inherit",
                                }}
                              >
                                Báo cáo
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                    <Box
                      className="product-pagination"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        flexDirection: "row",
                      }}
                    >
                      <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{
                          "& .MuiPaginationItem-root": {
                            color: "#6517ce",
                          },
                          "& .Mui-selected": {
                            backgroundColor: "#6517ce !important",
                            color: "white !important",
                          },
                          "& .MuiPagination-ul": {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "8px",
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                          },
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <Typography variant="body1" className="no-reviews-message">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </Typography>
                )}
                {pagination && page < pagination.totalPages - 1 && (
                  <Box className="product-load-more">
                    <Button
                      variant="outlined"
                      onClick={handleLoadMore}
                      style={{ borderColor: "#6517ce", color: "#6517ce" }}
                    >
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
              classes={{ paper: "bg-white rounded-lg shadow-xl" }}
            >
              <DialogTitle className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">
                Đánh Giá Sản Phẩm: {enrichedProduct.name}
              </DialogTitle>
              <DialogContent className="p-6">
                <Box className="flex flex-col gap-6">
                  <Box>
                    <Typography
                      variant="h6"
                      className="text-lg font-semibold text-gray-700 mb-2"
                    >
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
                    <Typography
                      variant="h6"
                      className="text-lg font-semibold text-gray-700 mb-2"
                    >
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
                        className: "text-gray-800",
                      }}
                      InputLabelProps={{
                        className: "text-gray-600",
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
                  style={{ backgroundColor: "#6517ce" }}
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
                  <Typography variant="h6" className="product-analysis-title">
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
                  {latestAIComments.length > 0 ? (
                    latestAIComments.map((review) => (
                      <Box key={review.id} className="product-analysis-item">
                        <Typography
                          variant="body2"
                          className="text-gray-600 italic"
                        >
                          - {review.aicomment}
                        </Typography>
                      </Box>
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
                  {reviews && reviews.length > 0 ? (
                    <Box>
                      <Box className="product-sentiment-bar">
                        <Box
                          className="product-sentiment-positive"
                          style={{
                            width: `${sentimentAnalysis.positive}%`,
                            backgroundColor: "#6517ce",
                          }}
                        ></Box>
                        <Box
                          className="product-sentiment-neutral"
                          style={{
                            width: `${sentimentAnalysis.neutral}%`,
                          }}
                        ></Box>
                        <Box
                          className="product-sentiment-negative"
                          style={{
                            width: `${sentimentAnalysis.negative}%`,
                          }}
                        ></Box>
                      </Box>
                      <Box className="product-sentiment-labels">
                        <Typography variant="caption">
                          Tích cực ({sentimentAnalysis.positive.toFixed(1)}%)
                        </Typography>
                        <Typography variant="caption">
                          Trung lập ({sentimentAnalysis.neutral.toFixed(1)}%)
                        </Typography>
                        <Typography variant="caption">
                          Tiêu cực ({sentimentAnalysis.negative.toFixed(1)}%)
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" className="text-gray-600">
                      Chưa có dữ liệu phân tích cảm xúc.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {tabValue === "related" && (
          <Box className="product-tab-panel">
            {productLoading ? (
              <Typography>Đang tải sản phẩm liên quan...</Typography>
            ) : productError ? (
              <Typography color="error">
                Lỗi khi tải sản phẩm liên quan:{" "}
                {productError?.message || productError}
              </Typography>
            ) : relatedProducts.length > 0 ? (
              <Box className="product-related-grid">
                {relatedProducts.map((related) => (
                  <Card key={related.id} className="product-related-card">
                    <a
                      href={`/san-pham/${related.id}`}
                      className="product-related-link"
                    >
                      <Box className="product-related-image">
                        <img
                          src={related.sourceUrl || "/placeholder.svg"}
                          alt={related.name}
                          className="product-image"
                        />
                      </Box>
                    </a>
                    <CardContent className="product-related-content">
                      <Box className="product-related-rating">
                        <Rating
                          value={related.averageRating || 0}
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
                          ({related.reviewCount || 0})
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
                        {related.price || "10.000đ"}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography>Không có sản phẩm liên quan.</Typography>
            )}
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
          sx={{
            width: "100%",
            backgroundColor:
              snackbarSeverity === "success" ? "#6517ce" : undefined,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
