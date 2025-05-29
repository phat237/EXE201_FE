import React from 'react';
import { Table, Tag } from 'antd';

const data = [
  {
    key: '1',
    name: 'Nguyen Van A',
    email: 'a@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Tran Thi B',
    email: 'b@example.com',
    role: 'User',
    status: 'Inactive',
  },
  {
    key: '3',
    name: 'Le Van C',
    email: 'c@example.com',
    role: 'User',
    status: 'Active',
  },
];

const columns = [
  {
    title: 'ID',
    dataIndex: 'key',
    key: 'key',
    width: 60,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role) => <Tag color={role === 'Admin' ? 'geekblue' : 'green'}>{role}</Tag>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <Tag color={status === 'Active' ? 'green' : 'volcano'}>{status}</Tag>,
  },
];

const Users = () => {
  return (
    <div>
      <h2>Users Management Page</h2>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default Users; 