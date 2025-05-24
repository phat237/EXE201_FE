import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  IconButton,
  Drawer,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { themeMode, toggleTheme } = useContext(ThemeContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/san-pham", label: "Sản Phẩm" },
    { href: "/danh-gia", label: "Đánh Giá" },
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
              <span>ReviewAnon </span>
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
              <Button variant="outlined" className="header-login">
                <Link to="/auth/login" className="no-underline">
                  Đăng Nhập
                </Link>
              </Button>
              <Button variant="contained" className="header-register">
                <Link to="/dang-ky" className="no-underline">
                  Đăng Ký
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
