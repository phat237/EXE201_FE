import React from 'react';
import { Link } from '@mui/material';
import { Facebook, Instagram, Twitter, Mail, Phone } from '@mui/icons-material';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>TrustReview </h3>
            <p>
              Nền tảng đánh giá ẩn danh với công nghệ AI tiên tiến, giúp người tiêu dùng và doanh nghiệp kết nối hiệu quả.
            </p>
            <div className="footer-social-links">
              <Link href="#" color="inherit" className="footer-social-link">
                <Facebook fontSize="small" />
                <span className="footer-sr-only">Facebook</span>
              </Link>
              <Link href="#" color="inherit" className="footer-social-link">
                <Instagram fontSize="small" />
                <span className="footer-sr-only">Instagram</span>
              </Link>
              <Link href="#" color="inherit" className="footer-social-link">
                <Twitter fontSize="small" />
                <span className="footer-sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h3>Liên Kết</h3>
            <ul>
              <li>
                <Link href="/" color="inherit" className="footer-nav-link">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/san-pham" color="inherit" className="footer-nav-link">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link href="/danh-gia" color="inherit" className="footer-nav-link">
                  Đánh Giá
                </Link>
              </li>
              <li>
                <Link href="/doanh-nghiep" color="inherit" className="footer-nav-link">
                  Doanh Nghiệp
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" color="inherit" className="footer-nav-link">
                  Giới Thiệu
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Hỗ Trợ</h3>
            <ul>
              <li>
                <Link href="/faq" color="inherit" className="footer-nav-link">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
              <li>
                <Link href="/huong-dan" color="inherit" className="footer-nav-link">
                  Hướng Dẫn Sử Dụng
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach" color="inherit" className="footer-nav-link">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan" color="inherit" className="footer-nav-link">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link href="/lien-he" color="inherit" className="footer-nav-link">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Liên Hệ</h3>
            <ul>
              <li className="footer-contact-item">
                <Mail fontSize="small" className="footer-contact-icon" />
                <span>@TrustReview .vn</span>
              </li>
              <li className="footer-contact-item">
                <Phone fontSize="small" className="footer-contact-icon" />
                <span>0123 456 789</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TrustReview . Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;