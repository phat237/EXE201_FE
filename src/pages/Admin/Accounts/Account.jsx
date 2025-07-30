import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { UserOutlined, TeamOutlined, RiseOutlined, FallOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAccountCountsApi, 
  fetchRegistrationGrowthApi, 
  fetchOnlineUsersApi,
  selectAccountCounts, 
  selectAccountCountsLoading,
  selectRegistrationGrowth,
  selectRegistrationGrowthLoading,
  selectOnlineUsers,
  selectOnlineUsersLoading
} from '../../../store/slices/accountSlice';



const Accounts = () => {
  const dispatch = useDispatch();
  const accountCounts = useSelector(selectAccountCounts);
  const isLoadingCounts = useSelector(selectAccountCountsLoading);
  const registrationGrowth = useSelector(selectRegistrationGrowth);
  const isLoadingGrowth = useSelector(selectRegistrationGrowthLoading);
  const onlineUsers = useSelector(selectOnlineUsers);
  const isLoadingOnline = useSelector(selectOnlineUsersLoading);

  // Gọi 3 API khi component mount
  useEffect(() => {
    dispatch(fetchAccountCountsApi());
    dispatch(fetchRegistrationGrowthApi());
    dispatch(fetchOnlineUsersApi());
  }, [dispatch]);

  // Hàm tính toán tỉ lệ tăng trưởng
  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Hàm render tỉ lệ tăng trưởng với màu sắc
  const renderGrowthRate = (rate) => {
    const isPositive = rate >= 0;
    const color = isPositive ? '#52c41a' : '#ff4d4f';
    const icon = isPositive ? <RiseOutlined /> : <FallOutlined />;
    
    return (
      <span style={{ color, fontWeight: 'bold' }}>
        {icon} {Math.abs(rate).toFixed(1)}%
      </span>
    );
  };

  return (
    <div>
      <Typography.Title level={2}>Quản lý Tài khoản</Typography.Title>
      
      {/* 1. Tổng số tài khoản User và Partner */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng số User"
              value={accountCounts.userCount}
              prefix={<UserOutlined />}
              loading={isLoadingCounts}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng số Partner"
              value={accountCounts.partnerCount}
              prefix={<TeamOutlined />}
              loading={isLoadingCounts}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 2. Tăng trưởng theo tuần */}
      <Card title="Tăng trưởng đăng ký theo tuần" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Typography.Title level={4}>User</Typography.Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Typography.Text>Tuần trước: {registrationGrowth.monthlyGrowth?.[0]?.userCount || 0}</Typography.Text>
              </div>
              <div>
                <Typography.Text>Tuần này: {registrationGrowth.monthlyGrowth?.[1]?.userCount || 0}</Typography.Text>
              </div>
              <div>
                <Typography.Text>Tỉ lệ: {renderGrowthRate(
                  calculateGrowthRate(
                    registrationGrowth.monthlyGrowth?.[1]?.userCount || 0,
                    registrationGrowth.monthlyGrowth?.[0]?.userCount || 0
                  )
                )}</Typography.Text>
              </div>
            </Space>
          </Col>
          <Col span={12}>
            <Typography.Title level={4}>Partner</Typography.Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Typography.Text>Tuần trước: {registrationGrowth.monthlyGrowth?.[0]?.partnerCount || 0}</Typography.Text>
              </div>
              <div>
                <Typography.Text>Tuần này: {registrationGrowth.monthlyGrowth?.[1]?.partnerCount || 0}</Typography.Text>
              </div>
              <div>
                <Typography.Text>Tỉ lệ: {renderGrowthRate(
                  calculateGrowthRate(
                    registrationGrowth.monthlyGrowth?.[1]?.partnerCount || 0,
                    registrationGrowth.monthlyGrowth?.[0]?.partnerCount || 0
                  )
                )}</Typography.Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 3. Số người đang online */}
      <Card title="Người dùng đang online" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic
              title="User Online"
              value={onlineUsers.userCount}
              prefix={<UserOutlined />}
              loading={isLoadingOnline}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Partner Online"
              value={onlineUsers.partnerCount}
              prefix={<TeamOutlined />}
              loading={isLoadingOnline}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Tổng Online"
              value={onlineUsers.totalOnline}
              prefix={<EyeOutlined />}
              loading={isLoadingOnline}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
        {onlineUsers.lastUpdated && (
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            Cập nhật lần cuối: {new Date(onlineUsers.lastUpdated).toLocaleString('vi-VN')}
          </Typography.Text>
                 )}
       </Card>
     </div>
   );
};

export default Accounts; 