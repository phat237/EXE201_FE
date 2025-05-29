import React, { useState } from 'react';
import { Table, Tag, Switch, Image } from 'antd';

const data = [
  {
    key: '1',
    name: 'Sản phẩm A',
    price: 120000,
    category: 'Điện tử',
    status: 'Còn hàng',
    image: 'https://via.placeholder.com/60',
  },
  {
    key: '2',
    name: 'Sản phẩm B',
    price: 80000,
    category: 'Gia dụng',
    status: 'Hết hàng',
    image: 'https://via.placeholder.com/60',
  },
  {
    key: '3',
    name: 'Sản phẩm C',
    price: 150000,
    category: 'Thời trang',
    status: 'Còn hàng',
    image: 'https://via.placeholder.com/60',
  },
];

const baseColumns = [
  {
    title: 'ID',
    dataIndex: 'key',
    key: 'key',
    width: 60,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Giá',
    dataIndex: 'price',
    key: 'price',
    render: (price) => price.toLocaleString('vi-VN') + '₫',
  },
  {
    title: 'Danh mục',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <Tag color={status === 'Còn hàng' ? 'green' : 'volcano'}>{status}</Tag>,
  },
];

const imageColumn = {
  title: 'Hình ảnh',
  dataIndex: 'image',
  key: 'image',
  render: (img) => <Image src={img} width={60} alt="product" />,
};

const Products = () => {
  const [showImage, setShowImage] = useState(false);

  const columns = showImage ? [...baseColumns, imageColumn] : baseColumns;

  return (
    <div>
      <h2>Products Management Page</h2>
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={showImage}
          onChange={setShowImage}
          checkedChildren="Hiện hình ảnh"
          unCheckedChildren="Ẩn hình ảnh"
        />
        <span style={{ marginLeft: 8 }}>Hiển thị cột hình ảnh</span>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default Products; 