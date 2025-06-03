import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  StarOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const PartnerDashboard = () => {
  const recentOrders = [
    {
      key: '1',
      orderId: 'ORD001',
      customer: 'Nguyễn Văn A',
      amount: '1,500,000đ',
      status: 'Hoàn thành',
    },
    {
      key: '2',
      orderId: 'ORD002',
      customer: 'Trần Thị B',
      amount: '750,000đ',
      status: 'Đang xử lý',
    },
    {
      key: '3',
      orderId: 'ORD003',
      customer: 'Lê Văn C',
      amount: '2,300,000đ',
      status: 'Hoàn thành',
    },
  ];

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Hoàn thành' ? 'green' : 'orange' }}>
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
              title="Tổng sản phẩm"
              value={45}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={128}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đánh giá trung bình"
              value={4.5}
              prefix={<StarOutlined />}
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Lượt xem"
              value={2560}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Đơn hàng gần đây"
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

export default PartnerDashboard; 