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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../../Context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";

import "../Header/Header.css";
import { logout } from "../../store/slices/authSlice";
import { PATH } from "../../routes/path";

export default function HeaderLog() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const user =
    useSelector((state) => state.auth.currentUser) ||
    JSON.parse(localStorage.getItem("currentUser"));

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
              <span>TrustReview </span>
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
                <MenuItem onClick={handleMenuClose}>
                  <Link
                    to={PATH.PROFILEUSER}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Trang cá nhân
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
