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
import { searchCategory } from "../../../store/slices/searchSlice";

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
              ({product.reviewCount || 0} đánh giá)
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
  console.log("ProductPage component rendering");
  
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
    searchCategory: searchCategoryResult,
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

  // Fetch initial data when component mounts
  useEffect(() => {
    console.log("Component mounted, fetching initial data");
    dispatch(
      fetchAllProductsPaginated({
        page: 0,
        size: itemsPerPage,
        categories: [],
        ratings: [],
        sortBy: "popular",
      })
    );
  }, [dispatch, itemsPerPage]);

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
              categories: selectedCategories,
              ratings: selectedRatings,
              sortBy,
            })
          );
        }
      }, 300),
    [dispatch, itemsPerPage, selectedCategories, selectedRatings, sortBy]
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
          categories: selectedCategories,
          ratings: selectedRatings,
          sortBy,
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
    setSelectedCategories(newCategories);
    setPage(0);
    if (searchQuery.trim() === "") {
      if (newCategories.length === 1) {
        dispatch(
          searchCategory({
            category: newCategories[0],
            page: 0,
            size: itemsPerPage,
          })
        );
      } else if (newCategories.length > 1) {
        dispatch(
          searchCategory({
            category: newCategories[0],
            page: 0,
            size: itemsPerPage,
          })
        );
      }
    }
  };

  // Handle category checkbox change
  const handleCategoryChange = (categoryValue) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryValue)
        ? prev.filter((cat) => cat !== categoryValue)
        : [...prev, categoryValue];
      if (searchQuery.trim() === "") {
        if (newCategories.length === 1) {
          dispatch(
            searchCategory({
              category: newCategories[0],
              page: 0,
              size: itemsPerPage,
            })
          );
        } else if (newCategories.length > 1) {
          dispatch(
            searchCategory({
              category: newCategories[0],
              page: 0,
              size: itemsPerPage,
            })
          );
        }
      }
      return newCategories;
    });
  };

  // Handle rating checkbox change
  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  // Handle search input
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [selectedCategories, selectedRatings, sortBy, searchQuery]);

  // Handle page change for search
  useEffect(() => {
    if (searchQuery.trim() !== "" && page > 0) {
      dispatch(
        searchApi({
          keyword: searchQuery,
          page,
          size: itemsPerPage,
          categories: selectedCategories,
          ratings: selectedRatings,
          sortBy,
        })
      );
    }
  }, [page, searchQuery, dispatch, itemsPerPage, selectedCategories, selectedRatings, sortBy]);

  // Toggle category visibility
  const handleShowMoreCategories = () => {
    setShowAllCategories(true);
  };

  const handleShowLessCategories = () => {
    setShowAllCategories(false);
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  // Memoized filtered products with pagination
  const filteredProducts = useMemo(() => {
    let productsToShow;
    if (searchQuery.trim() !== "") {
      productsToShow = searchResults;
    } else if (selectedCategories.length > 0 && searchCategoryResult?.content) {
      productsToShow = searchCategoryResult.content;
    } else {
      productsToShow = products;
    }

    console.log("filteredProducts debug:", {
      searchQuery: searchQuery.trim(),
      selectedCategories,
      searchResultsLength: searchResults?.length,
      searchCategoryResultContent: searchCategoryResult?.content?.length,
      productsLength: products?.length,
      productsToShowLength: productsToShow?.length
    });

    // Nếu productsToShow đã có averageRating (từ searchApi hoặc searchCategory), sử dụng luôn
    // Nếu không, lấy từ products gốc
    return (productsToShow || []).map((p) => {
      // Nếu sản phẩm đã có averageRating từ API search, sử dụng luôn
      if (p.averageRating !== undefined) {
        return p;
      }
      
      // Nếu không, tìm trong products gốc
      const productFromMain = products.find((main) => main.id === p.id);
      return {
        ...p,
        averageRating: productFromMain?.averageRating ?? productFromMain?.rating ?? 0,
        reviewCount: productFromMain?.reviewCount ?? (Array.isArray(productFromMain?.reviews) ? productFromMain.reviews.length : 0),
      };
    });
  }, [products, searchResults, searchQuery, selectedCategories, searchCategoryResult]);

  // Memoized paginated products
  const paginatedProducts = useMemo(() => {
    // Nếu có search query và có client-side filtering, áp dụng pagination
    if (searchQuery.trim() !== "" && (selectedCategories.length > 0 || selectedRatings.length > 0)) {
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredProducts.slice(startIndex, endIndex);
    }
    // Nếu không có client-side filtering, sử dụng kết quả từ API
    return filteredProducts;
  }, [filteredProducts, page, itemsPerPage, searchQuery, selectedCategories, selectedRatings]);

  console.log("paginatedProducts debug:", {
    paginatedProductsLength: paginatedProducts?.length,
    filteredProductsLength: filteredProducts?.length,
    page,
    itemsPerPage
  });

  const totalPagesToShow = useMemo(() => {
    if (searchQuery.trim() !== "") {
      // Nếu có client-side filtering, tính toán lại số trang
      if (selectedCategories.length > 0 || selectedRatings.length > 0) {
        const filteredCount = filteredProducts.length;
        return Math.ceil(filteredCount / itemsPerPage);
      }
      // Nếu không có filter, sử dụng pagination từ API
      return searchPagination?.totalPages || 1;
    }
    if (selectedCategories.length > 0 && searchCategoryResult?.totalPages) {
      return searchCategoryResult.totalPages;
    }
    return pagination?.totalPages || 1;
  }, [searchQuery, selectedCategories, selectedRatings, filteredProducts, itemsPerPage, searchPagination, pagination, searchCategoryResult]);

  const loadingToShow = searchQuery.trim() !== "" ? isSearchLoading : 
                       selectedCategories.length > 0 ? isSearchLoading : isLoading;
  const errorToShow = searchQuery.trim() !== "" ? searchError : 
                     selectedCategories.length > 0 ? searchError : error;

  console.log("Loading state debug:", {
    searchQuery: searchQuery.trim(),
    selectedCategoriesLength: selectedCategories.length,
    isSearchLoading,
    isLoading,
    loadingToShow,
    errorToShow
  });

  // Thêm useEffect để phân trang cho searchCategory
  useEffect(() => {
    if (
      searchQuery.trim() === "" &&
      selectedCategories.length > 0 &&
      page >= 0
    ) {
      // Hiện tại chỉ lấy category đầu tiên, có thể sửa lại nếu API hỗ trợ nhiều category
      dispatch(
        searchCategory({
          category: selectedCategories[0],
          page: page,
          size: itemsPerPage,
        })
      );
    }
  }, [searchQuery, selectedCategories, page, itemsPerPage, dispatch]);

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
              ) : paginatedProducts.length === 0 ? (
                <Typography>Không tìm thấy sản phẩm nào.</Typography>
              ) : (
                <Box className="products-grid">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Box>
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
                  {/* Custom Pagination: chỉ hiển thị 3 số trang liên tiếp, style nhẹ nhàng */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        minWidth: 32,
                        height: 32,
                        borderRadius: "50%",
                        borderColor: "#e0e0e0",
                        color: "#888",
                        p: 0,
                        fontWeight: 600,
                        boxShadow: "none",
                        '&:hover': { borderColor: '#bdbdbd', background: '#f5f5f5' },
                      }}
                      disabled={page === 0}
                      onClick={() => handlePageChange(null, page)}
                    >
                      &lt;
                    </Button>
                    {(() => {
                      let start = Math.max(1, page + 1 - 1);
                      let end = Math.min(totalPagesToShow, start + 2);
                      if (end - start < 2) start = Math.max(1, end - 2);
                      const pages = [];
                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }
                      return pages.map((p) => (
                        <Button
                          key={p}
                          size="small"
                          variant={p === page + 1 ? "contained" : "outlined"}
                          color={p === page + 1 ? "primary" : "inherit"}
                          sx={{
                            minWidth: 32,
                            height: 32,
                            borderRadius: "50%",
                            p: 0,
                            fontWeight: p === page + 1 ? 700 : 500,
                            background: p === page + 1 ? undefined : "#fff",
                            color: p === page + 1 ? undefined : "#888",
                            borderColor: "#e0e0e0",
                            boxShadow: "none",
                            '&:hover': {
                              background: p === page + 1 ? undefined : "#f5f5f5",
                              borderColor: "#bdbdbd",
                            },
                          }}
                          onClick={() => handlePageChange(null, p)}
                        >
                          {p}
                        </Button>
                      ));
                    })()}
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        minWidth: 32,
                        height: 32,
                        borderRadius: "50%",
                        borderColor: "#e0e0e0",
                        color: "#888",
                        p: 0,
                        fontWeight: 600,
                        boxShadow: "none",
                        '&:hover': { borderColor: '#bdbdbd', background: '#f5f5f5' },
                      }}
                      disabled={page + 1 === totalPagesToShow}
                      onClick={() => handlePageChange(null, page + 2)}
                    >
                      &gt;
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}