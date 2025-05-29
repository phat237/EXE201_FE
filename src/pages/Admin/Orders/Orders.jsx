import React, { useState } from 'react';
import { Table, Tag, Switch, Image } from 'antd';

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

  const columns = showImage ? [...baseColumns, imageColumn] : baseColumns;

  return (
    <div>
      <h2>Orders Management Page</h2>
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

export default Orders; 