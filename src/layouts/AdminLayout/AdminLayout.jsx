import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <BarChartOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '/admin/products',
      icon: <ShoppingCartOutlined />,
      label: 'Products',
    },
    {
      key: '/admin/orders',
      icon: <DollarOutlined />,
      label: 'Orders',
    },
    {
      key: '/admin/upgrade-packages',
      icon: <StarOutlined />,
      label: 'Gói nâng cấp',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
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
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
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
            onClick={() => navigate('/auth/login')}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
