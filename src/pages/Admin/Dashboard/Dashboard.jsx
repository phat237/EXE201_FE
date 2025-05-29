import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
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
    <div style={{ padding: '24px' }}>
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
    </div>
  );
};

export default Dashboard;
