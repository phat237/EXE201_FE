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
  Avatar,
  CircularProgress,
} from "@mui/material"
import {
  ArrowDownward,
  ArrowUpward,
  Business,
  AttachMoney,
  TrendingDown,
  TrendingUp,
  People,
} from "@mui/icons-material"
import { getTopPartner, getSummary, getRevenueGrowth } from "../../../store/slices/transactionDashboardSlice"

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { 
    transactionTopPartner, 
    transactionSummary, 
    transactionRevenueGrowth, 
    isLoading, 
    error 
  } = useSelector((state) => state.transactionDashboard)

  useEffect(() => {
    dispatch(getTopPartner())
    dispatch(getSummary())
    dispatch(getRevenueGrowth())
  }, [dispatch])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Tính toán tỷ lệ thành công và đang xử lý
  const successRate = transactionSummary?.totalTransactions 
    ? (transactionSummary.statusDistribution.SUCCESS / transactionSummary.totalTransactions) * 100 
    : 0
  const pendingRate = transactionSummary?.totalTransactions 
    ? (transactionSummary.statusDistribution.PENDING / transactionSummary.totalTransactions) * 100 
    : 0

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
                Dashboard Thống Kê
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                Hệ thống đánh giá ẩn danh
              </Typography>
            </Box>
            <Chip
              label="Hoạt động"
              variant="outlined"
              color="success"
              sx={{ bgcolor: "success.light", color: "success.dark" }}
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
                avatar={<People color="action" />}
                title={
                  <Typography variant="body2" color="text.secondary">
                    Tổng Giao Dịch
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" component="div" fontWeight="bold" color="text.primary">
                  {transactionSummary?.totalTransactions || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Tổng số giao dịch trong hệ thống
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{xs:12, sm:6, lg:3}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<TrendingUp sx={{ color: "success.main" }} />}
                title={
                  <Typography variant="body2" color="text.secondary">
                    Giao Dịch Thành Công
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                  {transactionSummary?.statusDistribution?.SUCCESS || 0}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ mt: 0.5 }}>
                  {successRate.toFixed(1)}% tổng giao dịch
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{xs:12, sm:6, lg:3}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<AttachMoney color="action" />}
                title={
                  <Typography variant="body2" color="text.secondary">
                    Doanh Thu Tuần Này
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" component="div" fontWeight="bold" color="text.primary">
                  {formatCurrency(transactionRevenueGrowth?.currentWeekRevenue || 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  So với tuần trước: {formatCurrency(transactionRevenueGrowth?.previousWeekRevenue || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{xs:12, sm:6, lg:3}}>
            <Card elevation={2}>
              <CardHeader
                avatar={
                  (transactionRevenueGrowth?.growthPercentage || 0) >= 0 ? (
                    <ArrowUpward sx={{ color: "success.main" }} />
                  ) : (
                    <ArrowDownward sx={{ color: "error.main" }} />
                  )
                }
                title={
                  <Typography variant="body2" color="text.secondary">
                    Tăng Trưởng
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography
                  variant="h4"
                  component="div"
                  fontWeight="bold"
                  color={(transactionRevenueGrowth?.growthPercentage || 0) >= 0 ? "success.main" : "error.main"}
                >
                  {transactionRevenueGrowth?.growthPercentage || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  So với tuần trước
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Top Partners */}
          <Grid item size={{ xs:12, lg:6}}>
            <Card elevation={2}>
              <CardHeader
                avatar={<Business color="action" />}
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Top 5 Partner Giao Dịch Nhiều Nhất
                  </Typography>
                }
                subheader="Danh sách các đối tác có số lượng giao dịch cao nhất"
              />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {transactionTopPartner?.map((partner, index) => (
                    <Paper
                      key={`${partner.partnerId}-${index}`}
                      elevation={1}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "grey.50",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "grey.300",
                            color: "text.primary",
                            fontSize: "0.875rem",
                            fontWeight: "medium",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium" color="text.primary">
                            {partner.companyName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {partner.partnerId}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                          {partner.transactionCount}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          giao dịch
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                  {(!transactionTopPartner || transactionTopPartner.length === 0) && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">Chưa có dữ liệu partner</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Transaction Status Distribution */}
          <Grid item size={{ xs:12, lg:6}}>
            <Card elevation={2}>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Phân Bố Trạng Thái Giao Dịch
                  </Typography>
                }
                subheader="Tỷ lệ các trạng thái giao dịch trong hệ thống"
              />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium" color="text.primary">
                          Thành công
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transactionSummary?.statusDistribution?.SUCCESS || 0} ({successRate.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={successRate}
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium" color="text.primary">
                          Đang xử lý
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transactionSummary?.statusDistribution?.PENDING || 0} ({pendingRate.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pendingRate}
                        color="warning"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" fontWeight="bold" color="success.main">
                            {transactionSummary?.statusDistribution?.SUCCESS || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Thành công
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" fontWeight="bold" color="warning.main">
                            {transactionSummary?.statusDistribution?.PENDING || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Đang xử lý
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Revenue Growth Details */}
        <Card elevation={2} sx={{ mt: 4 }}>
          <CardHeader
            avatar={<TrendingUp color="action" />}
            title={
              <Typography variant="h6" fontWeight="bold">
                Chi Tiết Doanh Thu & Tăng Trưởng
              </Typography>
            }
            subheader="So sánh doanh thu và số lượng giao dịch giữa các tuần"
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
                    Doanh thu tuần trước
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {formatCurrency(transactionRevenueGrowth?.previousWeekRevenue || 0)}
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
                    Doanh thu tuần này
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {formatCurrency(transactionRevenueGrowth?.currentWeekRevenue || 0)}
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
                    Giao dịch tuần trước
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {transactionRevenueGrowth?.previousWeekCount || 0}
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
                    Giao dịch tuần này
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {transactionRevenueGrowth?.currentWeekCount || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {(transactionRevenueGrowth?.growthPercentage || 0) < 0 && (
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
                  Cảnh báo tăng trưởng âm
                </Typography>
                <Typography variant="body2">
                  Doanh thu và số lượng giao dịch đã giảm {Math.abs(transactionRevenueGrowth?.growthPercentage || 0)}% so với tuần trước.
                  Cần xem xét các biện pháp cải thiện.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
