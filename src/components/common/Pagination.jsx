import React from "react";
import { Pagination, Box, Select, MenuItem, Typography } from "@mui/material";

/**
 * Reusable Pagination component
 * @param {number} page - current page (1-based)
 * @param {number} count - total number of pages
 * @param {function} onChange - callback (event, newPage) => void
 * @param {number} [pageSize] - current page size (optional)
 * @param {function} [onPageSizeChange] - callback (newPageSize) => void (optional)
 * @param {number[]} [pageSizeOptions] - array of page size options (optional)
 * @param {boolean} [showPageSize] - show page size selector (optional)
 */
export default function CustomPagination({
  page,
  count,
  onChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSize = false,
  sx,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        mt: 2,
        flexWrap: 'nowrap',
        ...sx,
      }}
    >
      <Pagination
        color="primary"
        page={page}
        count={count}
        onChange={onChange}
        shape="rounded"
        showFirstButton
        showLastButton
        boundaryCount={1}
        siblingCount={1}
        sx={{
          '& .MuiPagination-ul': {
            flexDirection: 'row',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiPaginationItem-root': {
            color: '#888',
            fontWeight: 400,
            borderRadius: '6px',
            border: 'none',
            minWidth: 40,
            height: 40,
            fontSize: 24,
            transition: 'all 0.2s',
          },
          '& .Mui-selected': {
            backgroundColor: '#d0021b',
            color: '#fff',
            fontWeight: 500,
            borderRadius: '6px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(208,2,27,0.08)',
            '&:hover': {
              backgroundColor: '#b80018',
              color: '#fff',
              border: 'none',
            },
          },
          '& .MuiPaginationItem-root:not(.Mui-selected):hover': {
            border: '1px solid #d0021b',
            backgroundColor: '#fff',
            color: '#d0021b',
          },
        }}
      />
      {showPageSize && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Typography variant="body2">Hiển thị:</Typography>
          <Select
            size="small"
            value={pageSize}
            onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2">/trang</Typography>
        </Box>
      )}
    </Box>
  );
} 