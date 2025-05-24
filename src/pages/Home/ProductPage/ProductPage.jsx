import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
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
} from "@mui/material";
import {
  Star as StarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import "./ProductPage.css";

// Mock data (same as provided)
const categories = [
  { id: 1, name: "Điện tử" },
  { id: 2, name: "Thời trang" },
  { id: 3, name: "Nhà cửa" },
  { id: 4, name: "Làm đẹp" },
  { id: 5, name: "Thực phẩm" },
];

const products = [
  {
    id: 1,
    name: "Điện thoại XYZ Pro",
    image: "/placeholder.svg?height=300&width=300",
    price: "12.990.000đ",
    rating: 4.5,
    reviewCount: 128,
    category: "Điện tử",
    verified: true,
  },
  {
    id: 2,
    name: "Laptop ABC Ultra",
    image: "/placeholder.svg?height=300&width=300",
    price: "22.490.000đ",
    rating: 4.2,
    reviewCount: 85,
    category: "Điện tử",
    verified: true,
  },
  {
    id: 3,
    name: "Tai nghe không dây EarPods",
    image: "/placeholder.svg?height=300&width=300",
    price: "2.990.000đ",
    rating: 3.8,
    reviewCount: 210,
    category: "Điện tử",
    verified: false,
  },
  {
    id: 4,
    name: "Áo thun nam cao cấp",
    image: "/placeholder.svg?height=300&width=300",
    price: "350.000đ",
    rating: 4.0,
    reviewCount: 56,
    category: "Thời trang",
    verified: true,
  },
  {
    id: 5,
    name: "Quần jeans nữ dáng suông",
    image: "/placeholder.svg?height=300&width=300",
    price: "550.000đ",
    rating: 4.3,
    reviewCount: 42,
    category: "Thời trang",
    verified: false,
  },
  {
    id: 6,
    name: "Nồi cơm điện thông minh",
    image: "/placeholder.svg?height=300&width=300",
    price: "1.290.000đ",
    rating: 3.5,
    reviewCount: 98,
    category: "Nhà cửa",
    verified: true,
  },
];

function ProductCard({ product }) {
  return (
    <Card className="products-card">
      <a href={`/san-pham/${product.id}`} className="products-card-link">
        <Box className="products-card-image">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="products-image"
          />
        </Box>
      </a>
      <CardContent className="products-card-content">
        <Box className="products-card-header">
          <Box className="products-card-rating">
            <Rating
              value={product.rating}
              readOnly
              precision={0.5}
              icon={<StarIcon className="products-star-icon" />}
              emptyIcon={<StarIcon className="products-star-icon-empty" />}
            />
            <Typography variant="caption" className="products-review-count">
              ({product.reviewCount})
            </Typography>
          </Box>
          {product.verified && (
            <Box className="products-verified">
              <VerifiedIcon className="products-icon" />
            </Box>
          )}
        </Box>
        <a href={`/san-pham/${product.id}`} className="products-card-link">
          <Typography variant="subtitle2" className="products-card-name">
            {product.name}
          </Typography>
        </a>
        <Box className="products-card-footer">
          <Typography variant="body2" className="products-card-price">
            {product.price}
          </Typography>
          <Typography variant="caption" className="products-card-category">
            {product.category}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          className="products-card-button"
          href={`/san-pham/${product.id}`}
          component="a"
        >
          Xem Chi Tiết
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [tabValue, setTabValue] = useState("all");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="products-container">
      <Box className="products-header">
        <Box>
          <Typography variant="h4" className="products-title">
            Sản Phẩm
          </Typography>
          <Typography variant="body2" className="products-subtitle">
            Khám phá và đánh giá các sản phẩm từ cộng đồng người dùng
          </Typography>
        </Box>
      </Box>

      <Box className="products-main">
        <Box className="products-filters">
          <Card className="products-filter-card">
            <CardContent className="products-filter-content">
              <Box className="products-filter-section">
                <Typography variant="subtitle1" className="products-filter-title">
                  Danh Mục
                </Typography>
                <Box className="products-filter-categories">
                  {categories.map((category) => (
                    <FormControlLabel
                      key={category.id}
                      control={<Checkbox id={`category-${category.id}`} />}
                      label={category.name}
                      className="products-filter-checkbox"
                    />
                  ))}
                </Box>
              </Box>

              <Box className="products-filter-section">
                <Typography variant="subtitle1" className="products-filter-title">
                  Đánh Giá
                </Typography>
                <Box className="products-filter-ratings">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <FormControlLabel
                      key={rating}
                      control={<Checkbox id={`rating-${rating}`} />}
                      label={
                        <Rating
                          value={rating}
                          readOnly
                          icon={<StarIcon className="products-star-icon" />}
                          emptyIcon={<StarIcon className="products-star-icon-empty" />}
                        />
                      }
                      className="products-filter-checkbox"
                    />
                  ))}
                </Box>
              </Box>

              <Box className="products-filter-section">
                <Typography variant="subtitle1" className="products-filter-title">
                  Giá
                </Typography>
                <Box className="products-filter-price">
                  <TextField
                    type="number"
                    placeholder="Từ"
                    className="products-filter-input"
                  />
                  <TextField
                    type="number"
                    placeholder="Đến"
                    className="products-filter-input"
                  />
                </Box>
              </Box>

              <Button
                variant="outlined"
                className="products-filter-button"
                startIcon={<FilterIcon />}
              >
                Lọc Sản Phẩm
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box className="products-content">
          <Box className="products-search-sort">
            <Box className="products-search">
              <SearchIcon className="products-search-icon" />
              <TextField
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="products-search-input"
              />
            </Box>
            <Box className="products-sort">
              <Typography variant="caption" className="products-sort-label">
                Sắp xếp theo:
              </Typography>
              <Select
                defaultValue="popular"
                className="products-sort-select"
              >
                <MenuItem value="popular">Phổ biến nhất</MenuItem>
                <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="price-low">Giá: Thấp đến cao</MenuItem>
                <MenuItem value="price-high">Giá: Cao đến thấp</MenuItem>
              </Select>
            </Box>
          </Box>

          <Tabs value={tabValue} onChange={handleTabChange} className="products-tabs">
            <Tab label="Tất Cả" value="all" />
            <Tab label="Điện Tử" value="electronics" />
            <Tab label="Thời Trang" value="fashion" />
            <Tab label="Nhà Cửa" value="home" />
          </Tabs>

          <Box className="products-tabs-content">
            {tabValue === "all" && (
              <Box className="products-tab-panel">
                <Box className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Box>
                <Box className="products-load-more">
                  <Button variant="outlined">Xem Thêm</Button>
                </Box>
              </Box>
            )}

            {tabValue === "electronics" && (
              <Box className="products-tab-panel">
                <Box className="products-grid">
                  {products
                    .filter((p) => p.category === "Điện tử")
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </Box>
              </Box>
            )}

            {tabValue === "fashion" && (
              <Box className="products-tab-panel">
                <Box className="products-grid">
                  {products
                    .filter((p) => p.category === "Thời trang")
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </Box>
              </Box>
            )}

            {tabValue === "home" && (
              <Box className="products-tab-panel">
                <Box className="products-grid">
                  {products
                    .filter((p) => p.category === "Nhà cửa")
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}