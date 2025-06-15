import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Descriptions, Spin, Card, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPremiumPackages,
  createPremiumPackage,
  updatePremiumPackage,
  deletePremiumPackage,
  resetCreateSuccess,
  resetUpdateSuccess,
  resetDeleteSuccess,
  fetchPremiumPackageById,
  resetSelectedPackage
} from '../../../store/slices/preniumPackageSlice';
import AdminSearchSort from '../../../components/Admin/AdminSearchSort';

const UpgradePackages = () => {
  const dispatch = useDispatch();
  const { data, loading, error, createSuccess, updateSuccess, deleteSuccess, selectedPackage } = useSelector(state => state.premiumPackages);

  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt'); // Hoặc 'name', 'price', 'duration'
  const [sortOrder, setSortOrder] = useState('desc');

  const sortOptions = [
    { value: 'name', label: 'Tên gói' },
    { value: 'price', label: 'Giá' },
    { value: 'duration', label: 'Thời hạn' },
    { value: 'createdAt', label: 'Ngày tạo' },
  ];

  const fetchPackageData = () => {
    // Giả sử fetchPremiumPackages có thể nhận các tham số search, sortBy, sortOrder
    dispatch(fetchPremiumPackages({ search: searchTerm, sortBy, sortOrder }));
  };

  useEffect(() => {
    fetchPackageData();
  }, [dispatch, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    if (createSuccess) {
      message.success('Tạo gói thành công!');
      dispatch(resetCreateSuccess());
      setModalOpen(false);
      form.resetFields();
      fetchPackageData(); // Refresh data
    }
    if (updateSuccess) {
      message.success('Cập nhật gói thành công!');
      dispatch(resetUpdateSuccess());
      setModalOpen(false);
      form.resetFields();
      fetchPackageData(); // Refresh data
    }
    if (deleteSuccess) {
      message.success('Xóa gói thành công!');
      dispatch(resetDeleteSuccess());
      fetchPackageData(); // Refresh data
    }
    if (error) {
      message.error(error);
    }
  }, [createSuccess, updateSuccess, deleteSuccess, error, dispatch, form]);

  const openAddModal = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(deletePremiumPackage(id));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        dispatch(updatePremiumPackage({ id: editing.id, updatedPackage: values }));
      } else {
        dispatch(createPremiumPackage(values));
      }
    });
  };

  const handleViewDetails = (id) => {
    dispatch(fetchPremiumPackageById(id));
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    dispatch(resetSelectedPackage());
  };

  const columns = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => (
        <Row gutter={[8, 8]}>
          {desc?.split('\n').map((feature, idx) =>
            feature.trim() ? (
              <Col key={idx}>
                <Card
                  size="small"
                  style={{
                    backgroundColor: '#f0f5ff',
                    borderColor: '#1890ff',
                    minWidth: 120,
                    textAlign: 'center',
                    padding: 0,
                    margin: 0
                  }}
                  bodyStyle={{ padding: 8 }}
                >
                  {feature.trim()}
                </Card>
              </Col>
            ) : null
          )}
        </Row>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price !== undefined && price !== null ? price.toLocaleString('vi-VN') + '₫' : ''
    },
    {
      title: 'Thời hạn',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => duration ? `${duration} tháng` : '',
      sorter: (a, b) => a.duration - b.duration,
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleViewDetails(record.id)}>Xem chi tiết</Button>
          <Button type="link" onClick={() => openEditModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Gói nâng cấp</h2>
      <AdminSearchSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={sortOptions}
        onApply={fetchPackageData}
      />
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openAddModal}>Thêm gói mới</Button>
      </div>
      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        loading={loading}
        rowKey={record => record.id}
        pagination={false}
      />
      <Modal
        title={editing ? 'Cập nhật gói nâng cấp' : 'Thêm gói nâng cấp'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="name" label="Tên gói" rules={[{ required: true, message: 'Vui lòng nhập tên gói!' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}> 
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="duration" label="Thời hạn (tháng)" rules={[{ required: true, message: 'Vui lòng nhập thời hạn!' }]}> 
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết gói nâng cấp"
        open={detailsModalOpen}
        onCancel={handleCloseDetails}
        footer={[
          <Button key="close" onClick={handleCloseDetails}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
          </div>
        ) : selectedPackage ? (
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tên gói">{selectedPackage.name}</Descriptions.Item>
              <Descriptions.Item label="Giá">{selectedPackage.price?.toLocaleString('vi-VN')}₫</Descriptions.Item>
              <Descriptions.Item label="Thời hạn">{selectedPackage.duration} tháng</Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '16px' }}>Tính năng gói:</h3>
              <Row gutter={[16, 16]}>
                {selectedPackage.description.split('\n').map((feature, index) => (
                  feature.trim() && (
                    <Col span={8} key={index}>
                      <Card 
                        hoverable
                        style={{ 
                          height: '100%',
                          backgroundColor: '#f0f5ff',
                          borderColor: '#1890ff'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          height: '100%',
                          textAlign: 'center'
                        }}>
                          {feature.trim()}
                        </div>
                      </Card>
                    </Col>
                  )
                ))}
              </Row>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Không tìm thấy thông tin gói
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UpgradePackages; 