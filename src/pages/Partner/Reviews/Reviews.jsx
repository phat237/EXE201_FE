import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Space, Modal, Rate, Avatar, Row, Col, Statistic } from 'antd';
import { StarOutlined, UserOutlined, MessageOutlined, LikeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Reviews = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data - sẽ được thay thế bằng dữ liệu thực từ API
  const products = [
    {
      key: '1',
      productName: 'Sản phẩm A',
      totalReviews: 45,
      averageRating: 4.5,
      lastReviewDate: '2024-03-15',
      status: 'active',
      category: 'Điện thoại',
    },
    {
      key: '2',
      productName: 'Sản phẩm B',
      totalReviews: 28,
      averageRating: 4.2,
      lastReviewDate: '2024-03-14',
      status: 'active',
      category: 'Laptop',
    },
    {
      key: '3',
      productName: 'Sản phẩm C',
      totalReviews: 15,
      averageRating: 3.8,
      lastReviewDate: '2024-03-13',
      status: 'inactive',
      category: 'Phụ kiện',
    },
  ];

  // Mock data cho đánh giá chi tiết
  const productReviews = {
    '1': [
      {
        id: 1,
        user: 'Nguyễn Văn A',
        rating: 5,
        date: '2024-03-15',
        comment: 'Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh chóng.',
        likes: 12,
      },
      {
        id: 2,
        user: 'Trần Thị B',
        rating: 4,
        date: '2024-03-14',
        comment: 'Chất lượng tốt nhưng giá hơi cao.',
        likes: 8,
      },
    ],
    '2': [
      {
        id: 3,
        user: 'Lê Văn C',
        rating: 4,
        date: '2024-03-14',
        comment: 'Sản phẩm đúng như mô tả, rất hài lòng.',
        likes: 5,
      },
    ],
    '3': [
      {
        id: 4,
        user: 'Phạm Thị D',
        rating: 3,
        date: '2024-03-13',
        comment: 'Sản phẩm tạm được, cần cải thiện thêm.',
        likes: 3,
      },
    ],
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Số đánh giá',
      dataIndex: 'totalReviews',
      key: 'totalReviews',
      render: (total) => (
        <Space>
          <MessageOutlined />
          {total}
        </Space>
      ),
    },
    {
      title: 'Đánh giá trung bình',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating) => (
        <Space>
          <Rate disabled defaultValue={rating} allowHalf />
          <span>({rating})</span>
        </Space>
      ),
    },
    {
      title: 'Đánh giá mới nhất',
      dataIndex: 'lastReviewDate',
      key: 'lastReviewDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <a onClick={() => showReviews(record)}>Xem chi tiết</a>
      ),
    },
  ];

  const showReviews = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Danh sách đánh giá sản phẩm</Title>
      <Card>
        <Table
          columns={columns}
          dataSource={products}
          pagination={false}
        />
      </Card>

      <Modal
        title={
          selectedProduct && (
            <Space>
              <span>Đánh giá chi tiết: {selectedProduct.productName}</span>
              <Tag color="blue">{selectedProduct.category}</Tag>
            </Space>
          )
        }
        open={isModalVisible}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        {selectedProduct && (
          <>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Statistic
                  title="Tổng số đánh giá"
                  value={selectedProduct.totalReviews}
                  prefix={<MessageOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đánh giá trung bình"
                  value={selectedProduct.averageRating}
                  precision={1}
                  prefix={<StarOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đánh giá mới nhất"
                  value={selectedProduct.lastReviewDate}
                />
              </Col>
            </Row>

            <Space direction="vertical" style={{ width: '100%' }}>
              {productReviews[selectedProduct.key]?.map((review) => (
                <Card key={review.id} style={{ marginBottom: 16 }}>
                  <Space align="start">
                    <Avatar icon={<UserOutlined />} />
                    <div style={{ flex: 1 }}>
                      <Space>
                        <strong>{review.user}</strong>
                        <Rate disabled defaultValue={review.rating} />
                        <span style={{ color: '#999' }}>{review.date}</span>
                      </Space>
                      <p style={{ margin: '8px 0' }}>{review.comment}</p>
                      <Space>
                        <LikeOutlined /> {review.likes}
                      </Space>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Reviews;