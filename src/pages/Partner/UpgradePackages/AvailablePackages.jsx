import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Typography, Space, Spin, Button, Modal, Descriptions, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailablePartnerPackages } from '../../../store/slices/partnerPackageSlice';
import { transactionDepositApi } from '../../../store/slices/transactionSlice';

const { Title } = Typography;

const AvailablePackages = () => {
  const dispatch = useDispatch();
  const { availablePackages, isLoading, error } = useSelector((state) => state.partnerPackage);
  const { isLoading: transactionLoading, error: transactionError } = useSelector((state) => state.transaction);

  // State cho Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    dispatch(fetchAvailablePartnerPackages());
  }, [dispatch]);

  // Hiển thị Modal khi nhấn "Mua ngay"
  const showPurchaseModal = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalVisible(true);
  };

  // Đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPackage(null);
  };

  // Xử lý xác nhận mua gói
  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;

    // Lấy partnerId từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const partnerId = currentUser.id;

    if (!partnerId) {
      message.error('Vui lòng đăng nhập để thực hiện giao dịch!');
      setIsModalVisible(false);
      return;
    }

    try {
      // Chuẩn bị dữ liệu cho API
      const transactionData = {
        packageId: selectedPackage.id,
        partnerId,
        amount: selectedPackage.price,
        description: `Thanh toán gói ${selectedPackage.name}`,
        packageType: selectedPackage.name.toLowerCase(), // Ví dụ: "basic", "premium", "vip"
      };

      // Gọi API transactionDepositApi
      const response = await dispatch(transactionDepositApi(transactionData)).unwrap();

      // Lưu thông tin giao dịch vào localStorage (để sử dụng trong CheckoutSuccess)
      localStorage.setItem('lastTransaction', JSON.stringify({
        orderCode: response.orderCode,
        amount: response.amount,
        package: transactionData.packageType,
        method: 'payos',
        transactionId: response.paymentLinkId,
      }));

      // Chuyển hướng đến checkoutUrl của PayOS
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        message.error('Không nhận được URL thanh toán từ PayOS!');
      }

      // Đóng Modal
      setIsModalVisible(false);
      setSelectedPackage(null);
    } catch (err) {
      message.error(`Lỗi khi thực hiện giao dịch: ${err.message || 'Vui lòng thử lại!'}`);
      setIsModalVisible(false);
    }
  };

  // Xử lý lỗi giao dịch
  useEffect(() => {
    if (transactionError) {
      message.error(`Lỗi giao dịch: ${transactionError}`);
    }
  }, [transactionError]);

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
        <Button type="primary" onClick={() => showPurchaseModal(record)}>
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

      {/* Modal xác nhận mua gói */}
      <Modal
        title="Xác nhận mua gói"
        visible={isModalVisible}
        onOk={handleConfirmPurchase}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={transactionLoading}
      >
        {selectedPackage && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên gói">
              <strong>{selectedPackage.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              {selectedPackage.price.toLocaleString('vi-VN')}đ
            </Descriptions.Item>
            <Descriptions.Item label="Thời hạn">
              {selectedPackage.duration} tháng
            </Descriptions.Item>
            <Descriptions.Item label="Tính năng">
              <Space direction="vertical">
                {selectedPackage.features?.map((feature, index) => (
                  <Tag key={index} color="blue">
                    {feature}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AvailablePackages;