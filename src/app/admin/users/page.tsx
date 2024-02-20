'use client'

import { sendRequest } from "@/utlis/api"

// export default async function PageUsers() {

//   const user_id = "65bc76897e9d32d76d997a48"

//   const res = await sendRequest<IBackendRes<any>>({
//     url: `http://localhost:8000/api/v1/users?current=1&pageSize=3`,
//     method: "GET"
//   })

//   console.log(res)

//   return (
//     <>
//       <div> T2M Users </div>
//       <div> T2M Users </div>
//       <div> T2M Users </div>
//       <div> T2M Users </div>
//       <div> T2M Users </div>
//       <div> T2M Users </div>
//     </>

//   )
// }

import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

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

const App = () => {

  const [listUsers, setListUsers] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await sendRequest<IBackendRes<any>>({
        url: `http://localhost:8000/api/v1/users?current=1&pageSize=3`,
        method: "GET"
      })
      setListUsers(res.data.result)
    }
    getData()
  }, [])

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

export default App;