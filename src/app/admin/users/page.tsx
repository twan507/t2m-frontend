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
    render: (value, record) => <a>{value}</a>,
  },
  {
    title: 'Tên người dùng',
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
  {
    title: 'Mã CTV',
    dataIndex: 'affiliateCode',
  },
  {
    title: 'Mã giới thiệu',
    dataIndex: 'sponsorCode',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    render: (value, record) => new Date(value).toLocaleDateString('en-GB')
  },
];

const PageUsers = () => {

  const { data: session } = useSession()

  const [listUsers, setListUsers] = useState([])

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 2,
    pages: 0,
    total: 0,
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const getData = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `http://localhost:8000/api/v1/users`,
      method: "GET",
      queryParams: { current: meta.current, pageSize: meta.pageSize },
      headers: { 'Authorization': `Bearer ${session?.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
    try { setMeta(res.data.meta) } catch (error) { }
  }

  const handleOnChange = async (current: number, pageSize: number) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `http://localhost:8000/api/v1/users`,
      method: "GET",
      queryParams: { current: current, pageSize: pageSize },
      headers: { 'Authorization': `Bearer ${session?.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
    try { setMeta(res.data.meta) } catch (error) { }
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
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          onChange: (current: number, pageSize: number) => { handleOnChange(current, pageSize) },
          showSizeChanger: true
        }}
      />
    </>
  )
}

export default PageUsers;