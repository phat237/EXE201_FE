import React, { useState } from "react";
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
} from "@mui/material";
import {
  Star as StarIcon,
  FilterList as FilterIcon,
  Verified as VerifiedIcon,
  ThumbUp as ThumbUpIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";
import "./ReviewPage.css";

// Dữ liệu mẫu
const reviews = [
  {
    id: 1,
    product: "Điện thoại XYZ Pro",
    rating: 5,
    content:
      "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu. Tôi đã sử dụng được 2 tháng và rất hài lòng với hiệu năng của máy. Màn hình hiển thị sắc nét, độ phân giải cao. Chơi game không bị giật lag.",
    verified: true,
    helpful: 42,
    date: "15/04/2023",
    user: "Người dùng ẩn danh",
    initials: "ND",
    productImage: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    product: "Laptop ABC Ultra",
    rating: 4,
    content:
      "Máy mỏng nhẹ, hiệu năng tốt cho công việc văn phòng và lập trình nhẹ. Tuy nhiên, pin hơi yếu, chỉ dùng được khoảng 4-5 tiếng. Bàn phím gõ êm, touchpad nhạy. Màn hình đẹp nhưng hơi bóng.",
    verified: true,
    helpful: 28,
    date: "03/05/2023",
    user: "Người dùng ẩn danh",
    initials: "ND",
    productImage: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    product: "Tai nghe không dây EarPods",
    rating: 3,
    content:
      "Âm thanh tạm ổn, kết nối bluetooth ổn định. Tuy nhiên, chất lượng build hơi kém, dễ bị trầy xước sau một thời gian sử dụng. Pin dùng được khoảng 4 tiếng liên tục.",
    verified: true,
    helpful: 15,
    date: "22/05/2023",
    user: "Người dùng ẩn danh",
    initials: "ND",
    productImage: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    product: "Máy ảnh Canon EOS 200D",
    rating: 5,
    content:
      "Máy ảnh tuyệt vời cho người mới bắt đầu. Chất lượng ảnh sắc nét, màu sắc trung thực. Dễ sử dụng với nhiều chế độ tự động. Pin dùng được cả ngày khi đi chụp.",
    verified: false,
    helpful: 32,
    date: "10/06/2023",
    user: "Người dùng ẩn danh",
    initials: "ND",
    productImage: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    product: "Nồi cơm điện Sunhouse",
    rating: 2,
    content:
      "Sản phẩm không như quảng cáo. Nấu cơm không chín đều, đôi khi bị cháy đáy. Chức năng giữ ấm chỉ hoạt động tốt trong khoảng 2 giờ. Không đáng tiền.",
    verified: true,
    helpful: 45,
    date: "05/07/2023",
    user: "Người dùng ẩn danh",
    initials: "ND",
    productImage: "/placeholder.svg?height=100&width=100",
  },
];

function ReviewCard({ review }) {
  return (
    <Card className="review-card">
      <CardContent className="review-card-content">
        <Box className="review-card-inner">
          {review.productImage && (
            <Box className="review-product-image">
              <img
                src={review.productImage}
                alt={review.product}
                className="review-image"
              />
            </Box>
          )}
          <Box className="review-details">
            <Box className="review-header">
              <Box>
                <Typography variant="subtitle1" className="review-product-name">
                  {review.product}
                </Typography>
                <Box className="review-meta">
                  <Rating
                    value={review.rating}
                    readOnly
                    icon={<StarIcon className="review-star-icon" />}
                    emptyIcon={<StarIcon className="review-star-icon-empty" />}
                  />
                  <Typography variant="caption" className="review-date">
                    {review.date}
                  </Typography>
                </Box>
              </Box>
              <Avatar className="review-avatar">
                <Typography variant="caption">{review.initials}</Typography>
              </Avatar>
            </Box>
            <Typography variant="body2" className="review-content-text">
              {review.content}
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
                  {review.user}
                </Typography>
              </Box>
              <Box className="review-footer-right">
                <Button
                  variant="text"
                  className="review-helpful-button"
                  startIcon={<ThumbUpIcon className="review-icon" />}
                >
                  {review.helpful} hữu ích
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
          href="/tao-danh-gia"
          component="a"
        >
          Viết Đánh Giá
        </Button>
      </Box>

      <Box className="review-main">
        <Box className="review-filters">
          <Card className="review-filter-card">
            <CardHeader>
              <Typography variant="h6">Bộ Lọc</Typography>
            </CardHeader>
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
            {tabValue === "all" && (
              <Box className="review-tab-panel">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                <Box className="review-load-more">
                  <Button variant="outlined">Xem Thêm</Button>
                </Box>
              </Box>
            )}
            {tabValue === "verified" && (
              <Box className="review-tab-panel">
                {reviews
                  .filter((r) => r.verified)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </Box>
            )}
            {tabValue === "recent" && (
              <Box className="review-tab-panel">
                {reviews
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </Box>
            )}
            {tabValue === "helpful" && (
              <Box className="review-tab-panel">
                {reviews
                  .sort((a, b) => b.helpful - a.helpful)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}