'use client'
import { sendRequest } from "@/utlis/api"
import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'antd';
import type { TableProps } from 'antd';
import { useSession } from "next-auth/react";
import {
  PlusCircleOutlined
} from '@ant-design/icons';
import CreateUserModal from "./components/create.user.modal";

const columns: TableProps<any>['columns'] = [
  {
    title: 'Email',
    dataIndex: 'email',
    render: (value, record) => <a>{record.email}</a>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber',
  },
  {
    title: 'Role',
    dataIndex: 'role',
  },
];

const PageUsers = () => {

  const { data: session } = useSession()

  const [listUsers, setListUsers] = useState([])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const getData = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `http://localhost:8000/api/v1/users?current=1&pageSize=3`,
      method: "GET",
      headers: { 'Authorization': `Bearer ${session?.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
  }

  useEffect(() => {
    getData()
  }, [session])

  return (
    <>
      <CreateUserModal
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1> Danh sách Users</h1>
        <Button icon={<PlusCircleOutlined />} onClick={() => setIsCreateModalOpen(true)} style={{}}>Tạo mới</Button>
      </div>
      <Table
        columns={columns}
        dataSource={listUsers}
        rowKey={"_id"}
      />
    </>
  )
}

export default PageUsers;