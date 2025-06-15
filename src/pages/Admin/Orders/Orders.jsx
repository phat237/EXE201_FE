import React, { useState } from 'react';
import { Table, Tag, Switch, Image } from 'antd';
import AdminSearchSort from '../../../components/Admin/AdminSearchSort';

const data = [
  {
    key: '1',
    orderId: 'ORD001',
    customer: 'Nguyen Van A',
    amount: 150000,
    status: 'Completed',
    image: 'https://via.placeholder.com/60',
  },
  {
    key: '2',
    orderId: 'ORD002',
    customer: 'Tran Thi B',
    amount: 75500,
    status: 'Pending',
    image: 'https://via.placeholder.com/60',
  },
  {
    key: '3',
    orderId: 'ORD003',
    customer: 'Le Van C',
    amount: 200000,
    status: 'Completed',
    image: 'https://via.placeholder.com/60',
  },
];

const baseColumns = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount) => amount.toLocaleString('vi-VN') + '₫',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <Tag color={status === 'Completed' ? 'green' : 'orange'}>{status}</Tag>,
  },
];

const imageColumn = {
  title: 'Hình ảnh',
  dataIndex: 'image',
  key: 'image',
  render: (img) => <Image src={img} width={60} alt="order" />,
};

const Orders = () => {
  const [showImage, setShowImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('orderId'); // Mặc định sắp xếp theo Order ID
  const [sortOrder, setSortOrder] = useState('asc'); // Mặc định sắp xếp tăng dần

  const sortOptions = [
    { value: 'orderId', label: 'Mã đơn hàng' },
    { value: 'customer', label: 'Tên khách hàng' },
    { value: 'amount', label: 'Số tiền' },
    { value: 'status', label: 'Trạng thái' },
  ];

  // Logic lọc và sắp xếp dữ liệu
  const getFilteredAndSortedData = () => {
    let currentData = [...data];

    // Lọc theo searchTerm
    if (searchTerm) {
      currentData = currentData.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sắp xếp dữ liệu
    if (sortBy) {
      currentData.sort((a, b) => {
        const aValue = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
        const bValue = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return currentData;
  };

  const columns = showImage ? [...baseColumns, imageColumn] : baseColumns;
  const displayedData = getFilteredAndSortedData();

  return (
    <div>
      <h2>Orders Management Page</h2>
      <AdminSearchSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={sortOptions}
      />
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={showImage}
          onChange={setShowImage}
          checkedChildren="Hiện hình ảnh"
          unCheckedChildren="Ẩn hình ảnh"
        />
        <span style={{ marginLeft: 8 }}>Hiển thị cột hình ảnh</span>
      </div>
      <Table columns={columns} dataSource={displayedData} pagination={false} />
    </div>
  );
};

export default Orders; 