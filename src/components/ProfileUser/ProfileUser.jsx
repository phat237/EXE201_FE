import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  TextField,
  Tabs,
  Tab,
  Box,
  Switch,
  Badge,
  IconButton,
  Rating,
} from "@mui/material";
import {
  Person,
  Star,
  Comment,
  ThumbUp,
  Settings,
  Notifications,
  Security,
  Edit,
  CameraAlt,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
} from "@mui/icons-material";
import "./ProfileUser.css";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchReviewStats } from '../../store/slices/reviewSlice';

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reviews: true,
    marketing: false,
  });
  const [tabValue, setTabValue] = useState("overview");
  const dispatch = useDispatch();
  const reviewStats = useSelector(state => state.review.reviewStats);
  useEffect(() => {
    if (tabValue === 'overview') {
      dispatch(fetchReviewStats());
    }
  }, [dispatch, tabValue]);

  // Sample user data
  const user = {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "15/03/2023",
    location: "Hà Nội, Việt Nam",
    bio: "Tôi thích chia sẻ những trải nghiệm thực tế về các sản phẩm để giúp mọi người đưa ra quyết định mua sắm tốt hơn.",
    stats: {
      totalReviews: 24,
      helpfulVotes: 156,
      averageRating: 4.2,
      verifiedReviews: 18,
    },
  };

  // Sample reviews data
  const recentReviews = [
    {
      id: 1,
      product: "Điện thoại XYZ Pro",
      rating: 5,
      content: "Sản phẩm tuyệt vời, camera chụp rất đẹp và pin trâu...",
      date: "15/11/2023",
      helpful: 12,
      verified: true,
    },
    {
      id: 2,
      product: "Laptop ABC Ultra",
      rating: 4,
      content: "Máy mỏng nhẹ, hiệu năng tốt cho công việc văn phòng...",
      date: "10/11/2023",
      helpful: 8,
      verified: true,
    },
    {
      id: 3,
      product: "Tai nghe không dây EarPods",
      rating: 3,
      content: "Âm thanh tạm ổn, kết nối bluetooth ổn định...",
      date: "05/11/2023",
      helpful: 5,
      verified: false,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="profile-user-container">
      <div className="profile-user-header">
        <div>
          <Typography variant="h4" component="h1">
            Hồ Sơ Cá Nhân
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý thông tin và hoạt động của bạn
          </Typography>
        </div>
        <Button
          variant={isEditing ? "outlined" : "contained"}
          startIcon={<Edit />}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Hủy" : "Chỉnh Sửa"}
        </Button>
      </div>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Tổng Quan" value="overview" />
        <Tab label="Đánh Giá" value="reviews" />
        <Tab label="Cài Đặt" value="settings" />
        <Tab label="Bảo Mật" value="security" />
      </Tabs>

      {/* Overview Tab */}
      {tabValue === "overview" && (
        <div className="profile-user-tab-content">
          <div className="profile-user-overview-grid">
            {/* Personal Information */}
            <Card className="profile-user-personal-info">
              <CardHeader title="Thông Tin Cá Nhân" />
              <CardContent>
                <div className="profile-user-avatar-section">
                  <div className="profile-user-avatar-container">
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      className="profile-user-avatar"
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    {isEditing && (
                      <IconButton className="profile-user-avatar-edit">
                        <CameraAlt />
                      </IconButton>
                    )}
                  </div>
                  <div className="profile-user-info">
                    {isEditing ? (
                      <div className="profile-user-edit-fields">
                        <TextField
                          defaultValue={user.name}
                          label="Họ và tên"
                          fullWidth
                          margin="normal"
                        />
                        <TextField
                          defaultValue={user.bio}
                          label="Giới thiệu về bạn"
                          multiline
                          rows={3}
                          fullWidth
                          margin="normal"
                        />
                      </div>
                    ) : (
                      <div>
                        <Typography variant="h6">{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.bio}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-user-info-grid">
                  <div className="profile-user-info-item">
                    <Typography variant="subtitle2">Email</Typography>
                    {isEditing ? (
                      <TextField
                        defaultValue={user.email}
                        type="email"
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      <div className="profile-user-info-display">
                        <Email className="profile-user-info-icon" />
                        <Typography variant="body2">{user.email}</Typography>
                      </div>
                    )}
                  </div>
                  <div className="profile-user-info-item">
                    <Typography variant="subtitle2">Số điện thoại</Typography>
                    {isEditing ? (
                      <TextField
                        defaultValue={user.phone}
                        type="tel"
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      <div className="profile-user-info-display">
                        <Phone className="profile-user-info-icon" />
                        <Typography variant="body2">{user.phone}</Typography>
                      </div>
                    )}
                  </div>
                  <div className="profile-user-info-item">
                    <Typography variant="subtitle2">Ngày tham gia</Typography>
                    <div className="profile-user-info-display">
                      <CalendarToday className="profile-user-info-icon" />
                      <Typography variant="body2">{user.joinDate}</Typography>
                    </div>
                  </div>
                  <div className="profile-user-info-item">
                    <Typography variant="subtitle2">Địa điểm</Typography>
                    {isEditing ? (
                      <TextField
                        defaultValue={user.location}
                        label="Thành phố, Quốc gia"
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      <div className="profile-user-info-display">
                        <LocationOn className="profile-user-info-icon" />
                        <Typography variant="body2">{user.location}</Typography>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="profile-user-edit-actions">
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setIsEditing(false)}
                    >
                      Lưu Thay Đổi
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="profile-user-stats-card">
              <CardHeader title="Thống Kê Hoạt Động" />
              <CardContent>
                <div className="profile-user-stats-item">
                  <div className="profile-user-stats-label">
                    <Comment className="profile-user-stats-icon" />
                    <Typography variant="body2">Tổng đánh giá</Typography>
                  </div>
                  <Typography variant="body1">
                    {reviewStats?.totalReviews ?? 0}
                  </Typography>
                </div>
                <div className="profile-user-stats-item">
                  <div className="profile-user-stats-label">
                    <ThumbUp className="profile-user-stats-icon" />
                    <Typography variant="body2">Lượt hữu ích</Typography>
                  </div>
                  <Typography variant="body1">
                    {reviewStats?.helpfulCount ?? 0}
                  </Typography>
                </div>
                <div className="profile-user-stats-item">
                  <div className="profile-user-stats-label">
                    <Star className="profile-user-stats-icon" />
                    <Typography variant="body2">Đánh giá TB</Typography>
                  </div>
                  <Typography variant="body1">
                    {reviewStats?.averageRating ?? 0}/5
                  </Typography>
                </div>
                <div className="profile-user-stats-item">
                  <div className="profile-user-stats-label">
                    <Security className="profile-user-stats-icon" />
                    <Typography variant="body2">Đã xác minh</Typography>
                  </div>
                  <Typography variant="body1">
                    {reviewStats?.verifiedCount ?? 0}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {tabValue === "reviews" && (
        <div className="profile-user-tab-content">
          <Card>
            <CardHeader
              title="Đánh Giá Của Tôi"
              subheader="Quản lý tất cả đánh giá bạn đã viết"
            />
            <CardContent>
              <div className="profile-user-reviews-list">
                {recentReviews.map((review) => (
                  <div key={review.id} className="profile-user-review-item">
                    <div className="profile-user-review-header">
                      <div>
                        <Typography variant="subtitle1">
                          {review.product}
                        </Typography>
                        <div className="profile-user-review-meta">
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            {review.date}
                          </Typography>
                        </div>
                      </div>
                      <div className="profile-user-review-actions">
                        {review.verified && (
                          <Badge color="success" badgeContent="Đã xác minh" />
                        )}
                        <IconButton>
                          <Edit />
                        </IconButton>
                      </div>
                    </div>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="profile-user-review-content"
                    >
                      {review.content}
                    </Typography>
                    <div className="profile-user-review-helpful">
                      <ThumbUp className="profile-user-helpful-icon" />
                      <Typography variant="caption">
                        {review.helpful} người thấy hữu ích
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {tabValue === "settings" && (
        <div className="profile-user-tab-content">
          <Card>
            <CardHeader
              title="Cài Đặt Thông Báo"
              subheader="Quản lý cách bạn nhận thông báo"
            />
            <CardContent>
              <div className="profile-user-settings-item">
                <div>
                  <Typography variant="subtitle2">
                    Thông báo qua Email
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Nhận thông báo qua email
                  </Typography>
                </div>
                <Switch
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      email: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="profile-user-settings-item">
                <div>
                  <Typography variant="subtitle2">Thông báo Push</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Nhận thông báo trên trình duyệt
                  </Typography>
                </div>
                <Switch
                  checked={notifications.push}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      push: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="profile-user-settings-item">
                <div>
                  <Typography variant="subtitle2">
                    Thông báo đánh giá
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Thông báo khi có phản hồi đánh giá
                  </Typography>
                </div>
                <Switch
                  checked={notifications.reviews}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      reviews: e.target.checked,
                    })
                  }
                />
              </div>
              <div className="profile-user-settings-item">
                <div>
                  <Typography variant="subtitle2">
                    Thông báo marketing
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Nhận thông tin khuyến mãi và tin tức
                  </Typography>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      marketing: e.target.checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {tabValue === "security" && (
        <div className="profile-user-tab-content">
          <Card>
            <CardHeader
              title="Bảo Mật Tài Khoản"
              subheader="Quản lý bảo mật và quyền riêng tư"
            />
            <CardContent>
              <div className="profile-user-security-section">
                <Typography variant="subtitle2">Đổi mật khẩu</Typography>
                <TextField
                  type="password"
                  label="Mật khẩu hiện tại"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  type="password"
                  label="Mật khẩu mới"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  type="password"
                  label="Xác nhận mật khẩu mới"
                  fullWidth
                  margin="normal"
                />
                <Button variant="contained" color="primary">
                  Cập Nhật Mật Khẩu
                </Button>
              </div>
              <div className="profile-user-security-section">
                <Typography variant="subtitle2">Xóa tài khoản</Typography>
                <Typography variant="caption" color="text.secondary">
                  Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn
                </Typography>
                <Button variant="contained" color="error">
                  Xóa Tài Khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
