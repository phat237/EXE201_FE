import React, { useEffect } from 'react';
import { Card, Table, Tag, Typography, Space, Spin } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPackages } from '../../../store/slices/partnerPackageSlice';

const { Title } = Typography;

const UpgradePackages = () => {
  const dispatch = useDispatch();
  const { packages, isLoading, error } = useSelector((state) => state.partnerPackage);

  useEffect(() => {
    dispatch(fetchPartnerPackages());
  }, [dispatch]);

  const columns = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Ngày mua',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'ACTIVE' ? 'green' : 'red'}
          icon={status === 'ACTIVE' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status === 'ACTIVE' ? 'Đang hoạt động' : 'Hết hạn'}
        </Tag>
      ),
    },
    {
      title: 'Tính năng',
      dataIndex: 'features',
      key: 'features',
      render: (features) => (
        <Space direction="vertical">
          {features?.map((feature, index) => (
            <Tag key={index} color="blue">
              {feature}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2}>Gói nâng cấp đã mua</Title>
        <Card>
          <div style={{ color: 'red', textAlign: 'center' }}>
            Có lỗi xảy ra khi tải dữ liệu: {error.message}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Gói nâng cấp đã mua</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={packages}
          pagination={false}
          scroll={{ x: true }}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default UpgradePackages; 