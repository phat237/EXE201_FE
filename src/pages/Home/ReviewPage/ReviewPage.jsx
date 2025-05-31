import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsPaginated, markReviewHelpful } from "../../../store/slices/reviewSlice";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Select,
  MenuItem, 
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Rating,
  Avatar,
  CircularProgress
} from "@mui/material";
import {
  Star as StarIcon,
  FilterList as FilterIcon,
  Verified as VerifiedIcon,
  ThumbUp as ThumbUpIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";
import "./ReviewPage.css";

function ReviewCard({ review, dispatch }) {
  const [isHelpfulLoading, setIsHelpfulLoading] = useState(false);

  const handleHelpfulClick = async () => {
    if (isHelpfulLoading) return;

    setIsHelpfulLoading(true);

    const statusToSend = review.likedByCurrentUser ? false : true;

    try {
      await dispatch(markReviewHelpful({ reviewId: review.id, status: statusToSend }));
      console.log(`Dispatched markReviewHelpful for review ID: ${review.id} with status: ${statusToSend}`);
    } catch (error) {
      console.error("Error marking review helpful:", error);
    } finally {
      setIsHelpfulLoading(false);
    }
  };

  return (
    <Card className="review-card">
      <CardContent className="review-card-content">
        <Box className="review-card-inner">
          {(review.productImage || review.product?.imageUrl) && (
            <Box className="review-product-image">
              <img
                src={review.productImage || review.product?.imageUrl || "/placeholder.svg"}
                alt={review.product?.name || "Product Image"}
                className="review-image"
              />
            </Box>
          )}
          <Box className="review-details">
            <Box className="review-header">
              <Box>
                <Typography variant="subtitle1" className="review-product-name">
                  {review.product?.name || "Sản phẩm không rõ"}
                </Typography>
                <Box className="review-meta">
                  <Rating
                    value={review.rating || 0}
                    readOnly
                    icon={<StarIcon className="review-star-icon" />}
                    emptyIcon={<StarIcon className="review-star-icon-empty" />}
                  />
                  <Typography variant="caption" className="review-date">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Ngày không rõ"}
                  </Typography>
                </Box>
              </Box>
              <Avatar className="review-avatar">
                <Typography variant="caption">{review.user?.initials || review.user?.name?.charAt(0) || '?'}</Typography>
              </Avatar>
            </Box>
            <Typography variant="body2" className="review-content-text">
              {review.content || "Không có nội dung đánh giá"}
            </Typography>
            <Box className="review-footer">
              <Box className="review-footer-left">
                {review.verified && (
                  <Box className="review-verified">
                    <VerifiedIcon className="review-icon" />
                    <Typography variant="caption">
                      Đã xác minh bởi AI
                    </Typography>
                  </Box>
                )}
                <Typography variant="caption" className="review-user">
                  {review.user?.name || "Người dùng ẩn danh"}
                </Typography>
              </Box>
              <Box className="review-footer-right">
                <Button
                  variant="text"
                  className="review-helpful-button"
                  style={{ color: review.likedByCurrentUser ? 'blue' : 'inherit' }}
                  startIcon={isHelpfulLoading ? <CircularProgress size={16} /> : <ThumbUpIcon className="review-icon" />}
                  onClick={handleHelpfulClick}
                  disabled={isHelpfulLoading}
                >
                  {review.helpful || 0} hữu ích
                </Button>
                <Button
                  variant="text"
                  className="review-report-button"
                  startIcon={<FlagIcon className="review-icon" />}
                >
                  Báo cáo
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ReviewsPage() {
  const [tabValue, setTabValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const dispatch = useDispatch();
  const { reviews, pagination, isLoading, error } = useSelector(
    (state) => state.review
  );

  useEffect(() => {
    dispatch(fetchReviewsPaginated({ reviewId: 1, page: currentPage, size: pageSize }));
  }, [dispatch, currentPage]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  if (isLoading && reviews.length === 0 && currentPage === 0) {
    return <Typography>Đang tải đánh giá...</Typography>;
  }

  if (error) {
    return <Typography color="error">Lỗi khi tải đánh giá: {error.message || JSON.stringify(error)}</Typography>;
  }

  let filteredAndSortedReviews = reviews;

  if (tabValue === 'verified') {
    filteredAndSortedReviews = filteredAndSortedReviews.filter(r => r.verified);
  } else if (tabValue === 'recent') {
    filteredAndSortedReviews = [...filteredAndSortedReviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (tabValue === 'helpful') {
    filteredAndSortedReviews = [...filteredAndSortedReviews].sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
  }

  return (
    <Box className="review-container">
      <Box className="review-header">
        <Box>
          <Typography variant="h4" className="review-title">
            Đánh Giá Sản Phẩm
          </Typography>
          <Typography variant="body2" className="review-subtitle">
            Khám phá đánh giá trung thực từ cộng đồng người dùng
          </Typography>
        </Box>
        <Button
          variant="contained"
          className="review-write-button"
          href={`/tao-danh-gia?product=${''}`}
          component="a"
        >
          Viết Đánh Giá
        </Button>
      </Box>

      <Box className="review-main">
        <Box className="review-filters">
          <Card className="review-filter-card">
            <CardHeader title={<Typography variant="h6">Bộ Lọc</Typography>} />
            <CardContent className="review-filter-content">
              <Box className="review-filter-section">
                <Typography variant="subtitle2">Danh Mục</Typography>
                <Select defaultValue="all" className="review-filter-select">
                  <MenuItem value="all">Tất cả danh mục</MenuItem>
                  <MenuItem value="electronics">Điện tử</MenuItem>
                  <MenuItem value="fashion">Thời trang</MenuItem>
                  <MenuItem value="home">Nhà cửa</MenuItem>
                  <MenuItem value="beauty">Làm đẹp</MenuItem>
                </Select>
              </Box>
              <Box className="review-filter-section">
                <Typography variant="subtitle2">Đánh Giá</Typography>
                <Box className="review-rating-filter">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <FormControlLabel
                      key={rating}
                      control={<Checkbox />}
                      label={
                        <Box className="review-rating-label">
                          <Rating
                            value={rating}
                            readOnly
                            icon={<StarIcon className="review-star-icon" />}
                            emptyIcon={<StarIcon className="review-star-icon-empty" />}
                          />
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </Box>
              <Box className="review-filter-section">
                <Typography variant="subtitle2">Xác Minh</Typography>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Box className="review-verified-label">
                      <VerifiedIcon className="review-icon" />
                      <Typography variant="caption">
                        Đã xác minh bởi AI
                      </Typography>
                    </Box>
                  }
                />
              </Box>
              <Button
                variant="outlined"
                className="review-apply-filter"
                startIcon={<FilterIcon />}
              >
                Áp Dụng Bộ Lọc
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Box className="review-content">
          <Box className="review-search-sort">
            <TextField
              placeholder="Tìm kiếm đánh giá..."
              className="review-search-input"
            />
            <Box className="review-sort">
              <Typography variant="caption" className="review-sort-label">
                Sắp xếp theo:
              </Typography>
              <Select defaultValue="recent" className="review-sort-select">
                <MenuItem value="recent">Mới nhất</MenuItem>
                <MenuItem value="helpful">Hữu ích nhất</MenuItem>
                <MenuItem value="highest">Đánh giá cao nhất</MenuItem>
                <MenuItem value="lowest">Đánh giá thấp nhất</MenuItem>
              </Select>
            </Box>
          </Box>
          <Tabs value={tabValue} onChange={handleTabChange} className="review-tabs">
            <Tab label="Tất Cả" value="all" />
            <Tab label="Đã Xác Minh" value="verified" />
            <Tab label="Mới Nhất" value="recent" />
            <Tab label="Hữu Ích Nhất" value="helpful" />
          </Tabs>
          <Box className="review-tabs-content">
            <Box className="review-tab-panel">
              {filteredAndSortedReviews.length > 0 ? (
                filteredAndSortedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} dispatch={dispatch} />
                ))
              ) : (
                !isLoading && <Typography>Không có đánh giá nào để hiển thị.</Typography>
              )}

              {isLoading && reviews.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 1 }}>Đang tải thêm...</Typography>
                </Box>
              )}

              {!isLoading && pagination && currentPage < pagination.totalPages - 1 && filteredAndSortedReviews.length > 0 && (
                <Box className="review-load-more" sx={{ mt: 2, textAlign: 'center' }}>
                  <Button variant="outlined" onClick={handleLoadMore}>Xem Thêm</Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}