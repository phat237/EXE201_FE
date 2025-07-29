"use client"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  LinearProgress,
  Box,
  Container,
  Grid,
  Paper,
  Alert,
  Rating,
  CircularProgress,
} from "@mui/material"
import { VerifiedUser, Report, Star, TrendingDown, RateReview, Security, Analytics } from "@mui/icons-material"
import { getReviewVerification, getReviewSummary, getNewReviewGrowth } from "../../../store/slices/reviewDashboardSlice"

export default function ReviewAnalyticsDashboard() {
  const dispatch = useDispatch()
  const { 
    reviewVerificationStat, 
    reviewSummary, 
    reviewNewGrowth, 
    isLoading, 
    error 
  } = useSelector((state) => state.reviewDashboard)

  useEffect(() => {
    dispatch(getReviewVerification())
    dispatch(getReviewSummary())
    dispatch(getNewReviewGrowth())
  }, [dispatch])

  // Tính toán thống kê
  const totalVerified = (reviewVerificationStat?.verifiedByAI || 0) + (reviewVerificationStat?.spamReviews || 0)
  const verificationRate = totalVerified > 0 
    ? ((reviewVerificationStat?.verifiedByAI || 0) / totalVerified) * 100 
    : 0
  const spamRate = totalVerified > 0 
    ? ((reviewVerificationStat?.spamReviews || 0) / totalVerified) * 100 
    : 0

  // Tính điểm trung bình
  const calculateAverageRating = () => {
    if (!reviewSummary?.ratingDistribution) return 0
    
    let totalPoints = 0
    let totalReviews = 0

    Object.entries(reviewSummary.ratingDistribution).forEach(([rating, count]) => {
      totalPoints += Number.parseInt(rating) * count
      totalReviews += count
    })

    return totalReviews > 0 ? (totalPoints / totalReviews).toFixed(1) : 0
  }

  const averageRating = calculateAverageRating()

  // Tính phần trăm cho mỗi sao
  const getRatingPercentage = (rating) => {
    if (!reviewSummary?.ratingDistribution || !reviewSummary?.totalReviews) return 0
    const count = reviewSummary.ratingDistribution[rating] || 0
    return reviewSummary.totalReviews > 0 ? (count / reviewSummary.totalReviews) * 100 : 0
  }

  // Hiển thị loading nếu đang tải dữ liệu
  if (isLoading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh" 
      }}>
        <CircularProgress />
      </Box>
    )
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Lỗi khi tải dữ liệu</Typography>
          <Typography variant="body2">
            {typeof error === 'string' ? error : error?.error || error?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
          </Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Header */}
      <Paper elevation={1} sx={{ borderRadius: 0 }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                Thống Kê Đánh Giá
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                Hệ thống đánh giá ẩn danh - Phân tích AI & Spam
              </Typography>
            </Box>
            <Chip
              label="AI Monitoring"
              variant="outlined"
              color="primary"
              sx={{ bgcolor: "primary.light", color: "primary.dark" }}
            />
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item size={{xs:12, sm:6, lg:3}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<VerifiedUser sx={{ color: "success.main" }} />}
                title={
                  <Typography variant="body2" color="text.secondary">
                    Đánh Giá Xác Thực AI
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                  {reviewVerificationStat?.verifiedByAI || 0}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ mt: 0.5 }}>
                  {verificationRate.toFixed(1)}% tổng số được kiểm tra
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{xs:12, sm:6, lg:3}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<Report sx={{ color: "error.main" }} />}
                title={
                  <Typography variant="body2" color="text.secondary">
                    Đánh Giá Spam
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                  {reviewVerificationStat?.spamReviews || 0}
                </Typography>
                <Typography variant="caption" color="error.main" sx={{ mt: 0.5 }}>
                  {spamRate.toFixed(1)}% được phát hiện spam
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{xs:12, sm:6, lg:3}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<RateReview color="action" />}
                title={
                  <Typography variant="body2" color="text.secondary">
                    Tổng Số Đánh Giá
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" component="div" fontWeight="bold" color="text.primary">
                  {reviewSummary?.totalReviews || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Đánh giá trong hệ thống
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{xs:12, sm:6, lg:3}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<Star sx={{ color: "warning.main" }} />}
                title={
                  <Typography variant="body2" color="text.secondary">
                    Điểm Trung Bình
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h4" component="div" fontWeight="bold" color="text.primary">
                    {averageRating}
                  </Typography>
                  <Rating value={Number.parseFloat(averageRating)} readOnly precision={0.1} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Trên 5 sao
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* AI Verification Stats */}
        <Grid item size={{ xs:12, lg:6}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<Security color="action" />}
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Thống Kê Xác Thực AI
                  </Typography>
                }
                subheader="Phân tích tự động về chất lượng đánh giá"
              />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium" color="text.primary">
                          Đánh giá xác thực
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {reviewVerificationStat?.verifiedByAI || 0} ({verificationRate.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={verificationRate}
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium" color="text.primary">
                          Đánh giá spam
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {reviewVerificationStat?.spamReviews || 0} ({spamRate.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={spamRate}
                        color="error"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
                    <Grid container spacing={2}>
                      <Grid item size={{xs:6}}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" fontWeight="bold" color="success.main">
                            {reviewVerificationStat?.verifiedByAI || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Xác thực
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item size={{xs:6}}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" fontWeight="bold" color="error.main">
                            {reviewVerificationStat?.spamReviews || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Spam
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  <Alert severity="success" icon={<VerifiedUser />} sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      Tỷ lệ spam thấp ({spamRate.toFixed(1)}%) cho thấy hệ thống AI hoạt động hiệu quả
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Rating Distribution */}
        <Grid item size={{ xs:12, lg:6}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<Analytics color="action" />}
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Phân Bố Theo Sao
                  </Typography>
                }
                subheader="Tỷ lệ đánh giá theo từng mức sao"
              />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviewSummary?.ratingDistribution?.[rating] || 0
                    const percentage = getRatingPercentage(rating)

                    return (
                      <Box key={rating}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" fontWeight="medium" color="text.primary">
                              {rating}
                            </Typography>
                            <Star sx={{ fontSize: 16, color: "warning.main" }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {count} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          color={rating >= 4 ? "success" : rating >= 3 ? "warning" : "error"}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )
                  })}
                </Box>

                <Box sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
                  <Grid container spacing={2}>
                    <Grid item size={{xs:4}}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                          {averageRating}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Điểm TB
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item size={{xs:4}}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          {reviewSummary?.ratingDistribution?.["5"] || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          5 sao
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item size={{xs:4}}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                          {reviewSummary?.totalReviews || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tổng cộng
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Review Growth Details */}
        <Card elevation={2} sx={{ mt: 4 }}>
          <CardHeader
            avatar={<TrendingDown sx={{ color: "error.main" }} />}
            title={
              <Typography variant="h6" fontWeight="bold">
                Tăng Trưởng Đánh Giá Mới
              </Typography>
            }
            subheader="So sánh số lượng đánh giá mới giữa các tuần"
          />
          <CardContent>
            <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item size={{xs:12, sm:6, lg:3}}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Đánh giá tuần trước
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {reviewNewGrowth?.previousWeekCount || 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item size={{xs:12, sm:6, lg:3}}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Đánh giá tuần này
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {reviewNewGrowth?.currentWeekCount || 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item size={{xs:12, sm:6, lg:3}}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "error.light",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="white" sx={{ mb: 1 }}>
                    Tăng trưởng
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                    <TrendingDown sx={{ color: "white", fontSize: 20 }} />
                    <Typography variant="h5" fontWeight="bold" color="white">
                      {reviewNewGrowth?.growthPercentage || 0}%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item size={{xs:12, sm:6, lg:3}}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Chênh lệch
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    -{((reviewNewGrowth?.previousWeekCount || 0) - (reviewNewGrowth?.currentWeekCount || 0))}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {(reviewNewGrowth?.growthPercentage || 0) < 0 && (
              <Alert
                severity="error"
                icon={<TrendingDown />}
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    width: "100%",
                  },
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  Cảnh báo: Giảm mạnh đánh giá mới
                </Typography>
                <Typography variant="body2">
                  Số lượng đánh giá mới đã giảm {Math.abs(reviewNewGrowth?.growthPercentage || 0)}% so với tuần trước (từ{" "}
                  {reviewNewGrowth?.previousWeekCount || 0} xuống {reviewNewGrowth?.currentWeekCount || 0}). Cần xem xét các biện pháp
                  khuyến khích người dùng đánh giá.
                </Typography>
              </Alert>
            )}

            {/* Insights */}
            <Box sx={{ mt: 3, p: 2, bgcolor: "primary.light", borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary.dark" sx={{ mb: 1 }}>
                💡 Thông tin chi tiết
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="primary.dark">
                    • Tỷ lệ spam thấp ({spamRate.toFixed(1)}%) cho thấy chất lượng đánh giá tốt
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="primary.dark">
                    • Điểm trung bình {averageRating}/5 sao cho thấy sự hài lòng cao
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="primary.dark">
                    •{" "}
                    {reviewSummary?.totalReviews && reviewSummary?.ratingDistribution
                      ? (((reviewSummary.ratingDistribution["4"] || 0) + (reviewSummary.ratingDistribution["5"] || 0)) / reviewSummary.totalReviews * 100).toFixed(1)
                      : 0}% đánh giá 4-5 sao
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="primary.dark">
                    • Cần tăng cường marketing để thu hút đánh giá mới
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
