import React, { useState, useEffect, useMemo } from "react";
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
  Pagination,
} from "@mui/material";
import {
  Star as StarIcon,
  Search as SearchIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import "./ProductPage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProductsPaginated } from "../../../store/slices/productSlice";
import LoadingProduct from "../../../components/Loading/LoadingProduct";
import { Link } from "react-router-dom";
import { searchApi } from "../../../store/slices/searchSlice";
import { debounce } from "lodash";

// Categories
const categories = [
  { id: 1, name: "Điện Thoại", value: "DIEN_THOAI" },
  { id: 2, name: "Laptop", value: "LAPTOP" },
  { id: 3, name: "Máy Tính", value: "MAY_TINH" },
  { id: 4, name: "Điện Tử Gia Dụng", value: "DIEN_TU_GIA_DUNG" },
  { id: 5, name: "Phụ Kiện Công Nghệ", value: "PHU_KIEN_CONG_NGHE" },
  { id: 6, name: "Thời Trang", value: "THOI_TRANG" },
  { id: 7, name: "Mỹ Phẩm Làm Đẹp", value: "MY_PHAM_LAM_DEP" },
  { id: 8, name: "Mẹ và Bé", value: "ME_VA_BE" },
  { id: 9, name: "Thực Phẩm Đồ Uống", value: "THUC_PHAM_DO_UONG" },
  { id: 10, name: "Sách Vở", value: "SACH_VO" },
  { id: 11, name: "Văn Phòng Phẩm", value: "VAN_PHONG_PHAM" },
  { id: 12, name: "Nội Thất Trang Trí", value: "NOI_THAT_TRANG_TRI" },
  { id: 13, name: "Xe Cơ Phụ Tùng", value: "XE_CO_PHU_TUNG" },
  { id: 14, name: "Dịch Vụ", value: "DICH_VU" },
  { id: 15, name: "Khác", value: "KHAC" },
];

function ProductCard({ product }) {
  const categoryName =
    categories.find((cat) => cat.value === product.category)?.name ||
    "Không rõ";

  return (
    <Card className="products-card">
      <Link to={`/san-pham/${product.id}`} className="products-card-link">
        <Box className="products-card-image">
          <img
            src={product.sourceUrl || "/placeholder.svg"}
            alt={product.name}
            className="products-image"
          />
        </Box>
      </Link>
      <CardContent className="products-card-content">
        <a href={`/san-pham/${product.id}`} className="products-card-link">
          <Typography variant="subtitle2" className="products-card-name">
            {product.name}
          </Typography>
        </a>
        <Box className="products-card-header">
          <Box className="products-card-rating">
            <Rating
              value={product.averageRating || 0}
              readOnly
              precision={0.5}
              icon={<StarIcon className="products-star-icon" />}
              emptyIcon={<StarIcon className="products-star-icon-empty" />}
            />
            <Typography variant="caption" className="products-review-count">
              {product.averageRating || 0}
            </Typography>
            <Typography variant="caption" className="products-review-count">
              ({product.reviewCount || 0})
            </Typography>
          </Box>
          {product.isVerified && (
            <Box className="products-verified">
              <VerifiedIcon className="products-icon" />
            </Box>
          )}
        </Box>
        <Box className="products-card-footer">
          <Typography variant="caption" className="products-card-category">
            {categoryName}
          </Typography>
        </Box>
        <Button
          variant="contained"
          className="products-card-button"
          component="a"
        >
          <Link to={`/san-pham/${product.id}`} className="products-card-link">
            Xem Chi Tiết
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [tabValue, setTabValue] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [itemsPerPage] = useState(18);
  const [sortBy, setSortBy] = useState("popular");

  const dispatch = useDispatch();
  const {
    allProducts: products,
    allProductsPagination: pagination,
    isLoading,
    error,
  } = useSelector((state) => state.product);
  const {
    searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    pagination: searchPagination,
  } = useSelector((state) => state.search);

  // Fetch products for the current page
  useEffect(() => {
    console.log("Fetching products with filters:", {
      page,
      size: itemsPerPage,
      categories: selectedCategories,
      ratings: selectedRatings,
      sortBy,
      searchQuery
    });
    
    if (searchQuery.trim() === "") {
      dispatch(
        fetchAllProductsPaginated({
          page,
          size: itemsPerPage,
          categories: selectedCategories,
          ratings: selectedRatings,
          sortBy,
        })
      );
    }
  }, [dispatch, page, itemsPerPage, selectedCategories, selectedRatings, sortBy]);

  // Debounced search handler chỉ cho việc thay đổi search query
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (value.trim() !== "") {
          dispatch(
            searchApi({
              keyword: value,
              page: 0,
              size: itemsPerPage,
            })
          );
        }
      }, 300),
    [dispatch, itemsPerPage]
  );

  // Handle search input change
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  // Khi thay đổi filter và có search query, gọi lại search API với filter mới
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      dispatch(
        searchApi({
          keyword: searchQuery,
          page: 0,
          size: itemsPerPage,
        })
      );
    }
  }, [selectedCategories, selectedRatings, sortBy, searchQuery, dispatch, itemsPerPage]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Debug: Log tất cả categories có sẵn
  useEffect(() => {
    if (products.length > 0) {
      const allCategories = [...new Set(products.map(p => p.category))];
      console.log("All available categories in database:", allCategories);
      console.log("Categories count:", allCategories.map(cat => ({
        category: cat,
        count: products.filter(p => p.category === cat).length
      })));
    }
  }, [products]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    console.log("Tab changed to:", newValue);
    setTabValue(newValue);
    setPage(0);
    setSearchQuery(""); // Clear search query when changing tabs
    const categoryMap = {
      dien_thoai_laptop: ["DIEN_THOAI", "LAPTOP", "MAY_TINH"],
      dien_tu_phu_kien: ["DIEN_TU_GIA_DUNG", "PHU_KIEN_CONG_NGHE"],
      thoi_trang_lam_dep: ["THOI_TRANG", "MY_PHAM_LAM_DEP"],
      me_va_be: ["ME_VA_BE"],
      thuc_pham_do_uong: ["THUC_PHAM_DO_UONG"],
      sach_van_phong: ["SACH_VO", "VAN_PHONG_PHAM"],
      noi_that_trang_tri: ["NOI_THAT_TRANG_TRI"],
      xe_co_phu_tung: ["XE_CO_PHU_TUNG"],
      dich_vu_khac: ["DICH_VU", "KHAC"],
    };
    const newCategories = newValue === "all" ? [] : categoryMap[newValue] || [];
    console.log("Setting categories to:", newCategories);
    setSelectedCategories(newCategories);
  };

  // Handle category checkbox change
  const handleCategoryChange = (categoryValue) => {
    console.log("Category checkbox changed:", categoryValue);
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryValue)
        ? prev.filter((cat) => cat !== categoryValue)
        : [...prev, categoryValue];
      console.log("New categories:", newCategories);
      return newCategories;
    });
    setPage(0);
    setSearchQuery(""); // Clear search query when changing category filter
  };

  // Handle rating checkbox change
  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
    setPage(0);
    setSearchQuery(""); // Clear search query when changing rating filter
  };

  // Handle search input
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(0);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(0);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  // Toggle category visibility
  const handleShowMoreCategories = () => {
    setShowAllCategories(true);
  };

  const handleShowLessCategories = () => {
    setShowAllCategories(false);
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    let productsToShow = searchQuery.trim() !== "" ? searchResults : products;
    
    // Client-side filtering nếu backend không hỗ trợ
    if (selectedCategories.length > 0) {
      productsToShow = productsToShow.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    if (selectedRatings.length > 0) {
      productsToShow = productsToShow.filter(product => {
        const rating = Math.round(product.averageRating || 0);
        return selectedRatings.includes(rating.toString());
      });
    }
    
    return productsToShow;
  }, [products, searchResults, searchQuery, selectedCategories, selectedRatings]);

  const totalPagesToShow = searchQuery.trim() !== ""
    ? (searchPagination?.totalPages || 1)
    : (pagination?.totalPages || 1);

  const loadingToShow = searchQuery.trim() !== "" ? isSearchLoading : isLoading;
  const errorToShow = searchQuery.trim() !== "" ? searchError : error;

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
                  {visibleCategories.map((category) => (
                    <FormControlLabel
                      key={category.id}
                      control={
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.value)}
                          onChange={() => handleCategoryChange(category.value)}
                        />
                      }
                      label={category.name}
                      className="products-filter-checkbox"
                    />
                  ))}
                  {!showAllCategories && categories.length > 5 && (
                    <Button
                      variant="text"
                      className="products-show-more"
                      onClick={handleShowMoreCategories}
                    >
                      Xem Thêm
                    </Button>
                  )}
                  {showAllCategories && (
                    <Button
                      variant="text"
                      className="products-show-more"
                      onClick={handleShowLessCategories}
                    >
                      Thu Gọn
                    </Button>
                  )}
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
                      control={
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={selectedRatings.includes(rating.toString())}
                          onChange={() => handleRatingChange(rating.toString())}
                        />
                      }
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
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>
            <Box className="products-sort">
              <Typography variant="caption" className="products-sort-label">
                Sắp xếp theo:
              </Typography>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                className="products-sort-select"
              >
                <MenuItem value="popular">Phổ biến nhất</MenuItem>
                <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
                <MenuItem value="newest">Mới nhất</MenuItem>
              </Select>
            </Box>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            className="products-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Tất Cả" value="all" />
            <Tab label="Điện Thoại & Laptop" value="dien_thoai_laptop" />
            <Tab label="Điện Tử & Phụ Kiện" value="dien_tu_phu_kien" />
            <Tab label="Thời Trang & Làm Đẹp" value="thoi_trang_lam_dep" />
            <Tab label="Mẹ & Bé" value="me_va_be" />
            <Tab label="Thực Phẩm & Đồ Uống" value="thuc_pham_do_uong" />
            <Tab label="Sách & Văn Phòng Phẩm" value="sach_van_phong" />
            <Tab label="Nội Thất & Trang Trí" value="noi_that_trang_tri" />
            <Tab label="Xe & Phụ Tùng" value="xe_co_phu_tung" />
            <Tab label="Dịch Vụ & Khác" value="dich_vu_khac" />
          </Tabs>

          <Box className="products-tabs-content">
            <Box className="products-tab-panel">
              {loadingToShow ? (
                <Typography>
                  <LoadingProduct />
                </Typography>
              ) : errorToShow ? (
                <Typography color="error">
                  Lỗi khi tải sản phẩm: {errorToShow}
                </Typography>
              ) : filteredProducts.length > 0 ? (
                <Box className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Box>
              ) : (
                <Typography>Không tìm thấy sản phẩm nào.</Typography>
              )}
              {!loadingToShow && totalPagesToShow > 1 && (
                <Box
                  className="products-pagination"
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pagination
                    count={totalPagesToShow}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{
                      "& .MuiPagination-ul": {
                        flexDirection: "row",
                        display: "flex",
                        gap: "8px",
                      },
                      "& .MuiPaginationItem-root": {
                        display: "inline-flex",
                        margin: "0 4px",
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}