import React from 'react';
import { Table, Tag } from 'antd';

const data = [
  {
    key: '1',
    setting: 'Ngôn ngữ',
    value: 'Tiếng Việt',
    status: 'Đang sử dụng',
  },
  {
    key: '2',
    setting: 'Chế độ tối',
    value: 'Bật',
    status: 'Đang sử dụng',
  },
  {
    key: '3',
    setting: 'Thông báo',
    value: 'Tắt',
    status: 'Không sử dụng',
  },
];

const columns = [
  {
    title: 'Thiết lập',
    dataIndex: 'setting',
    key: 'setting',
  },
  {
    title: 'Giá trị',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <Tag color={status === 'Đang sử dụng' ? 'green' : 'volcano'}>{status}</Tag>,
  },
];

const Settings = () => {
  return (
    <div>
      <h2>Settings Page</h2>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default Settings; 