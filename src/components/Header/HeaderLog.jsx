import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  CssBaseline,
  Badge,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ThemeContext } from "../../Context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "../../Context/NotificationContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import "../Header/Header.css";
import { logout } from "../../store/slices/authSlice";
import { PATH } from "../../routes/path";

export default function HeaderLog() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const location = useLocation();
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const user =
    useSelector((state) => state.auth.currentUser) ||
    JSON.parse(localStorage.getItem("currentUser"));
    
  const { notifications, unreadCount, markAllAsRead } = useNotification();

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationClick = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/san-pham", label: "Sản Phẩm" },
    { href: "/doanh-nghiep", label: "Doanh Nghiệp" },
    { href: "/gioi-thieu", label: "Giới Thiệu" },
  ];

  return (
    <>
      <CssBaseline />
      <header className="header">
        <div className="container">
          <div className="header-left">
            <Link to="/" className="logo">
              <span>TrustReview</span>
            </Link>

            <nav className="nav-desktop">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{ textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="header-right">
            <IconButton onClick={toggleSearch} aria-label="Search">
              <SearchIcon />
            </IconButton>

            <IconButton onClick={toggleTheme} aria-label="Toggle theme">
              {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Icon Thông báo */}
            <IconButton onClick={handleNotificationClick} aria-label="Notifications">
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={() => {
                handleNotificationClose();
                markAllAsRead();
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                style: { minWidth: 340, maxWidth: 400, padding: 0 },
              }}
            >
              <Box sx={{ padding: 2, borderBottom: '1px solid #eee', background: '#fafbfc' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#888">
                  Thông Báo Mới Nhận
                </Typography>
              </Box>
              {notifications.length === 0 ? (
                <MenuItem>Không có thông báo nào</MenuItem>
              ) : (
                notifications.map((noti, idx) => {
                  let icon = null;
                  if (noti.message.includes("hữu ích")) {
                    icon = <CheckCircleIcon sx={{ color: '#43a047', fontSize: 28, mt: 0.5 }} />;
                  } else if (noti.message.includes("báo cáo")) {
                    icon = <CancelIcon sx={{ color: '#e53935', fontSize: 28, mt: 0.5 }} />;
                  }
                  return (
                    <Box key={noti.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, px: 2, py: 1.5, background: noti.read ? '#fff' : '#f5f7fa' }}>
                      {icon && <Box sx={{ minWidth: 32 }}>{icon}</Box>}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="#222" sx={{ mb: 0.5 }}>
                          {noti.title || noti.message.split("!")[0] || "Thông báo"}
                        </Typography>
                        <Typography variant="body2" color="#555" sx={{ fontSize: 13, whiteSpace: 'pre-line' }}>
                          {noti.message}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="body2" color="#6517ce" sx={{ cursor: 'pointer', fontWeight: 500 }}>
                  Xem tất cả
                </Typography>
              </Box>
            </Menu>

            <div className="auth-buttons">
              <IconButton
                onClick={handleAvatarClick}
                aria-label="User menu"
                className="avatar-button"
              >
                <Avatar
                  alt={user?.username || "User"}
                  src={user?.avatar || undefined}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {user?.role === "PARTNER" ? (
                  <MenuItem onClick={handleMenuClose}>
                    <Link
                      to="/partner/upgrade-packages"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Dashboard Đối Tác
                    </Link>
                  </MenuItem>
                ) : (
                  <MenuItem onClick={handleMenuClose}>
                    <Link
                      to={PATH.PROFILEUSER}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Trang cá nhân
                    </Link>
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
