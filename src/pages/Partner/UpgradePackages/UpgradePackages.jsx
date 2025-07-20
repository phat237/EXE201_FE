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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active) =>
        active ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>Đang hoạt động</Tag>
        ) : (
          <Tag color="red" icon={<ClockCircleOutlined />}>Hết hạn</Tag>
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
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default UpgradePackages; 