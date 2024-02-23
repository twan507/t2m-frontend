'use client'
import { sendRequest } from "@/utlis/api"
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { useSession } from "next-auth/react";

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

  useEffect(() => {
    const getData = async () => {
      const res = await sendRequest<IBackendRes<any>>({
        url: `http://localhost:8000/api/v1/users?current=1&pageSize=3`,
        method: "GET",
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      })
      try { setListUsers(res.data.result) } catch (error) { }
    }
    getData()
  }, [session])

  return (
    <>
      <Table
        columns={columns}
        dataSource={listUsers}
        rowKey={"_id"}
      />
    </>
  )
}

export default PageUsers;