import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPremiumPackages,
  createPremiumPackage,
  updatePremiumPackage,
  deletePremiumPackage,
  resetCreateSuccess,
  resetUpdateSuccess,
  resetDeleteSuccess,
} from '../../../store/slices/preniumPackageSlice';

const UpgradePackages = () => {
  const dispatch = useDispatch();
  const { data, loading, error, createSuccess, updateSuccess, deleteSuccess } = useSelector(state => state.premiumPackages);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null: add, object: edit
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchPremiumPackages());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess) {
      message.success('Tạo gói thành công!');
      dispatch(resetCreateSuccess());
      setModalOpen(false);
      form.resetFields();
    }
    if (updateSuccess) {
      message.success('Cập nhật gói thành công!');
      dispatch(resetUpdateSuccess());
      setModalOpen(false);
      form.resetFields();
    }
    if (deleteSuccess) {
      message.success('Xóa gói thành công!');
      dispatch(resetDeleteSuccess());
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
      render: (duration) => duration ? `${Math.round(duration/30)} tháng` : ''
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  console.log('data from redux:', data);

  return (
    <div>
      <h2>Gói nâng cấp</h2>
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
    </div>
  );
};

export default UpgradePackages; 