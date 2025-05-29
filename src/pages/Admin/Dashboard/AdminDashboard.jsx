import React from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Table, Button } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <BarChartOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: 'products',
      icon: <ShoppingCartOutlined />,
      label: 'Products',
    },
    {
      key: 'orders',
      icon: <DollarOutlined />,
      label: 'Orders',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const recentOrders = [
    {
      key: '1',
      orderId: 'ORD001',
      customer: 'John Doe',
      amount: '$150.00',
      status: 'Completed',
    },
    {
      key: '2',
      orderId: 'ORD002',
      customer: 'Jane Smith',
      amount: '$75.50',
      status: 'Pending',
    },
    // Add more orders as needed
  ];

  const columns = [
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
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Completed' ? 'green' : 'orange' }}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        }}
      >
        <div style={{ height: '64px', padding: '16px', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>Admin Panel</h2>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => navigate('/login')}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={1128}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Products"
                  value={93}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Orders"
                  value={256}
                  prefix={<DollarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Revenue"
                  value={15400}
                  prefix="$"
                />
              </Card>
            </Col>
          </Row>

          <Card
            title="Recent Orders"
            style={{ marginTop: 24 }}
          >
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard; 