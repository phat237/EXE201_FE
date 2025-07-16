import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  StarOutlined,
  DollarOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileTextOutlined,
  CrownOutlined,
  MoneyCollectOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';


const { Header, Sider, Content } = Layout;

const PartnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Chuyển về trang home
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/partner/upgrade-packages',
      icon: <CrownOutlined />,
      label: 'Gói nâng cấp đã mua',
    },
    {
      key: '/partner/available-packages',
      icon: <ShoppingOutlined />,
      label: 'Gói nâng cấp có sẵn',
    },
    {
      key: '/partner/products',
      icon: <ShoppingCartOutlined />,
      label: 'Sản phẩm',
    },
    {
      key: '/partner/deposit',
      icon: <MoneyCollectOutlined />,
      label: 'Nạp Tiền',
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
          <h2 style={{ margin: 0 }}>Partner Panel</h2>
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
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PartnerLayout; 