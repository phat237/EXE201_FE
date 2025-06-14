import React, { useEffect } from 'react';
import { Card, Table, Tag, Typography, Space, Spin, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailablePartnerPackages } from '../../../store/slices/partnerPackageSlice';

const { Title } = Typography;

const AvailablePackages = () => {
  const dispatch = useDispatch();
  const { availablePackages, isLoading, error } = useSelector((state) => state.partnerPackage);

  useEffect(() => {
    dispatch(fetchAvailablePartnerPackages());
  }, [dispatch]);

  const handlePurchase = (packageId) => {
    // TODO: Implement purchase functionality
    console.log('Purchase package:', packageId);
  };

  const columns = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Thời hạn',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} tháng`,
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
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handlePurchase(record.id)}>
          Mua ngay
        </Button>
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
        <Title level={2}>Gói nâng cấp có sẵn</Title>
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
      <Title level={2}>Gói nâng cấp có sẵn</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={availablePackages}
          pagination={false}
          scroll={{ x: true }}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default AvailablePackages; 