import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVouchers, bulkCreateVouchers } from '../../../store/slices/voucherSlice';
import { Table, Spin, Alert, Tag, Button, Modal, Form, Input, InputNumber, DatePicker, message, Switch } from 'antd';
import dayjs from 'dayjs';

const Voucher = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.vouchers);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchVouchers());
  }, [dispatch]);

  const columns = [
    { title: 'Mã voucher', dataIndex: 'code', key: 'code' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Batch', dataIndex: 'batchCode', key: 'batchCode' },
    { title: 'Điểm đổi', dataIndex: 'requiredPoint', key: 'requiredPoint' },
    { title: 'Giảm giá (%)', dataIndex: 'discount', key: 'discount' },
    { title: 'Trạng thái', dataIndex: 'active', key: 'active', render: v => v ? <Tag color="green">Kích hoạt</Tag> : <Tag color="red">Ẩn</Tag> },
    { title: 'Đã đổi', dataIndex: 'hasBeenRedeemed', key: 'hasBeenRedeemed', render: v => v ? <Tag color="red">Đã đổi</Tag> : <Tag color="blue">Chưa đổi</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: d => d ? new Date(d).toLocaleString('vi-VN') : '' },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', render: d => d ? new Date(d).toLocaleDateString('vi-VN') : '' },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate', render: d => d ? new Date(d).toLocaleDateString('vi-VN') : '' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
  ];

  const openModal = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const codes = values.codes.split('\n').map(code => code.trim()).filter(Boolean);
      if (codes.length === 0) {
        message.error('Vui lòng nhập ít nhất một mã voucher!');
        return;
      }
      const vouchers = codes.map(code => ({
        code,
        name: values.name,
        batchCode: values.batchCode,
        requiredPoint: values.requiredPoint,
        discount: values.discount,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        description: values.description,
        active: values.active,
      }));
      dispatch(bulkCreateVouchers(vouchers)).then(res => {
        if (!res.error) {
          message.success('Tạo voucher thành công!');
          setModalOpen(false);
          dispatch(fetchVouchers());
        } else {
          message.error('Tạo voucher thất bại!');
        }
      });
    });
  };

  return (
    <div>
      <h2>Quản lý Voucher</h2>
      <Button type="primary" onClick={openModal} style={{ marginBottom: 16 }}>Tạo Voucher</Button>
      {error && <Alert type="error" message={error} />}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={Array.isArray(data) ? data : []}
          rowKey={record => record.id || record.code}
          pagination={false}
        />
      </Spin>
      <Modal
        title="Tạo Voucher"
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText="Tạo"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="codes" label="Danh sách mã voucher (mỗi dòng 1 mã)" rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}> 
            <Input.TextArea rows={5} placeholder="VD:\nCODE1\nCODE2\nCODE3" />
          </Form.Item>
          <Form.Item name="name" label="Tên voucher" rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="batchCode" label="Batch" rules={[{ required: true, message: 'Vui lòng nhập batch!' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="requiredPoint" label="Điểm đổi" rules={[{ required: true, message: 'Vui lòng nhập điểm đổi!' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="discount" label="Giảm giá (%)" rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}> 
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}> 
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}> 
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}> 
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="active" label="Kích hoạt" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Voucher; 