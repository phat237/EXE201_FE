import React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

/**
 * Reusable Admin Search and Sort component
 * @param {object} props
 * @param {string} props.searchTerm - Current search term
 * @param {function} props.onSearchChange - Callback for search term change
 * @param {string} props.sortBy - Current sort by field
 * @param {function} props.onSortByChange - Callback for sort by field change
 * @param {string} props.sortOrder - Current sort order ('asc' or 'desc')
 * @param {function} props.onSortOrderChange - Callback for sort order change
 * @param {Array<object>} props.sortOptions - Array of { value: string, label: string } for sort by field
 * @param {function} [props.onApply] - Optional callback to apply search/sort (e.g., for a search button)
 */
export default function AdminSearchSort({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  sortOptions,
  onApply,
}) {
  return (
    <Box sx={{
      display: 'flex',
      gap: 2,
      mb: 3,
      flexWrap: 'wrap',
      alignItems: 'center',
    }}>
      <TextField
        label="Tìm kiếm..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          ),
        }}
        sx={{ flexGrow: 1, minWidth: 200 }}
      />

      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel>Sắp xếp theo</InputLabel>
        <Select
          value={sortBy}
          label="Sắp xếp theo"
          onChange={(e) => onSortByChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel>Thứ tự</InputLabel>
        <Select
          value={sortOrder}
          label="Thứ tự"
          onChange={(e) => onSortOrderChange(e.target.value)}
        >
          <MenuItem value="asc">Tăng dần</MenuItem>
          <MenuItem value="desc">Giảm dần</MenuItem>
        </Select>
      </FormControl>

      {onApply && (
        <Button
          variant="contained"
          startIcon={<SortIcon />}
          onClick={onApply}
          sx={{ backgroundColor: '#6517ce' }}
        >
          Áp dụng
        </Button>
      )}
    </Box>
  );
} 