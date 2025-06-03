import React from 'react';
import { Card, Table, Tag, Typography, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UpgradePackages = () => {
  // Mock data - sẽ được thay thế bằng dữ liệu thực từ API
  const purchasedPackages = [
    {
      key: '1',
      packageName: 'Gói Cơ Bản',
      purchaseDate: '2024-03-15',
      expiryDate: '2024-06-15',
      price: '500,000đ',
      status: 'active',
      features: ['Tối đa 100 đánh giá', 'Báo cáo cơ bản', 'Hỗ trợ qua email'],
    },
    {
      key: '2',
      packageName: 'Gói Nâng Cao',
      purchaseDate: '2024-02-01',
      expiryDate: '2024-05-01',
      price: '1,500,000đ',
      status: 'expired',
      features: ['Tối đa 500 đánh giá', 'Báo cáo chi tiết', 'Hỗ trợ 24/7', 'Phân tích xu hướng'],
    },
    {
      key: '3',
      packageName: 'Gói Doanh Nghiệp',
      purchaseDate: '2024-03-01',
      expiryDate: '2024-09-01',
      price: '3,000,000đ',
      status: 'active',
      features: ['Không giới hạn đánh giá', 'Báo cáo nâng cao', 'Hỗ trợ 24/7', 'Phân tích xu hướng', 'API tích hợp'],
    },
  ];

  const columns = [
    {
      title: 'Tên gói',
      dataIndex: 'packageName',
      key: 'packageName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Ngày mua',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'active' ? 'green' : 'red'}
          icon={status === 'active' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status === 'active' ? 'Đang hoạt động' : 'Hết hạn'}
        </Tag>
      ),
    },
    {
      title: 'Tính năng',
      dataIndex: 'features',
      key: 'features',
      render: (features) => (
        <Space direction="vertical">
          {features.map((feature, index) => (
            <Tag key={index} color="blue">
              {feature}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Gói nâng cấp đã mua</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={purchasedPackages}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default UpgradePackages; 