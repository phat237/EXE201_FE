import React, { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  List,
} from "antd";
import { 
  EyeOutlined, 
  ShoppingOutlined, 
  RiseOutlined, 
  StarOutlined,
  TrophyOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductViewStatsApi,
  fetchProductSummaryApi,
  fetchNewProductGrowthApi,
  fetchAvgRatingApi,
  selectViewStats,
  selectViewStatsLoading,
  selectSummary,
  selectSummaryLoading,
  selectNewProductGrowth,
  selectNewProductGrowthLoading,
  selectAvgRating,
  selectAvgRatingLoading,
} from "../../../store/slices/productDashboardSlice";



const Products = () => {
  const dispatch = useDispatch();

  // Product Dashboard Data
  const viewStats = useSelector(selectViewStats);
  const isLoadingViewStats = useSelector(selectViewStatsLoading);
  const summary = useSelector(selectSummary);
  const isLoadingSummary = useSelector(selectSummaryLoading);
  const newProductGrowth = useSelector(selectNewProductGrowth);
  const isLoadingGrowth = useSelector(selectNewProductGrowthLoading);
  const avgRating = useSelector(selectAvgRating);
  const isLoadingRating = useSelector(selectAvgRatingLoading);

  // Gọi 4 API dashboard khi component mount
  useEffect(() => {
    dispatch(fetchProductViewStatsApi());
    dispatch(fetchProductSummaryApi());
    dispatch(fetchNewProductGrowthApi());
    dispatch(fetchAvgRatingApi());
  }, [dispatch]);

  // Hàm render tỉ lệ tăng trưởng với màu sắc
  const renderGrowthRate = (rate) => {
    const isPositive = rate >= 0;
    const color = isPositive ? '#52c41a' : '#ff4d4f';
    const icon = isPositive ? <RiseOutlined /> : <RiseOutlined rotate={180} />;
    
    return (
      <span style={{ color, fontWeight: 'bold' }}>
        {icon} {Math.abs(rate).toFixed(1)}%
      </span>
    );
  };

  return (
    <div>
      <Typography.Title level={2}>Quản lý Sản phẩm</Typography.Title>
      
      {/* 1. Tổng lượt xem và top 5 sản phẩm xem nhiều */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng lượt xem"
              value={viewStats.totalViews}
              prefix={<EyeOutlined />}
              loading={isLoadingViewStats}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Typography.Text type="secondary">
                Hôm nay: {viewStats.dailyViews} | Tuần này: {viewStats.weeklyViews} | Tháng này: {viewStats.monthlyViews}
              </Typography.Text>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top 5 sản phẩm xem nhiều" loading={isLoadingViewStats}>
            <List
              size="small"
              dataSource={viewStats.topProducts || []}
              renderItem={(item, index) => (
                <List.Item>
                  <Space>
                    <TrophyOutlined style={{ color: index < 3 ? '#ffd700' : '#d9d9d9' }} />
                    <Typography.Text strong>{item.name}</Typography.Text>
                    <Typography.Text type="secondary">{item.brandName}</Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 2. Tổng số sản phẩm và tổng danh mục */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={summary.totalProducts}
              prefix={<ShoppingOutlined />}
              loading={isLoadingSummary}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng danh mục"
              value={summary.totalCategories}
              loading={isLoadingSummary}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 3. Tăng trưởng sản phẩm mới */}
      <Card title="Tăng trưởng sản phẩm mới" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={4}>Tuần này</Typography.Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Typography.Text>Tuần trước: {newProductGrowth.previousWeekCount || 0}</Typography.Text>
              </div>
              <div>
                <Typography.Text>Tuần này: {newProductGrowth.currentWeekCount || 0}</Typography.Text>
              </div>
              <div>
                <Typography.Text>Tỉ lệ: {renderGrowthRate(newProductGrowth.growthPercentage || 0)}</Typography.Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 4. Đánh giá trung bình theo danh mục */}
      <Card title="Đánh giá trung bình theo danh mục" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic
              title="Đánh giá trung bình tổng"
              value={avgRating.overallRating}
              prefix={<StarOutlined />}
              suffix="/5"
              precision={1}
              loading={isLoadingRating}
              valueStyle={{ color: '#faad14' }}
            />
            <Typography.Text type="secondary">
              Tổng {avgRating.totalReviews} đánh giá
            </Typography.Text>
          </Col>
          <Col span={16}>
            <Typography.Title level={5}>Phân bố đánh giá theo danh mục</Typography.Title>
            <List
              size="small"
              dataSource={avgRating.ratingDistribution || []}
              renderItem={(item) => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Typography.Text>{item.category}</Typography.Text>
                    <Space>
                      <Typography.Text strong>{item.avgRating.toFixed(1)}</Typography.Text>
                      <StarOutlined style={{ color: '#faad14' }} />
                      <Typography.Text type="secondary">({item.reviewCount} đánh giá)</Typography.Text>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Products;