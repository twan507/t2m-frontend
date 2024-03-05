'use client'
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { TableColumnType, TableProps } from 'antd';
import { Button, Input, Popconfirm, Space, Table, Tag, notification } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utlis/api';

import {
  EditOutlined,
  DeleteOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  RedoOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

import ResetPasswordModal from './components/reset.password.modal';
import ManageCTVModal from './components/manege.ctv.modal';
import UpdateUserModal from './components/update.user.modal';
import CreateUserModal from './components/create.user.modal';

interface DataType {
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  affiliateCode: string;
  sponsorCode: string;
  createdAt: string;
}

type DataIndex = keyof DataType;

const PageUsers: React.FC = () => {
  const { data: session } = useSession()
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<any>(null);

  const [listUsers, setListUsers] = useState([])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isCTVModalOpen, setIsCTVModalOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [updateUserRecord, setUpdateUserRecord] = useState()

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  })

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

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Email',
      dataIndex: 'email',
      render: (value, record) => <a>{value}</a>,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      ...getColumnSearchProps('role'),
      render: (value, record) => {
        const tagColor = value === 'T2M ADMIN' ? 'purple' :
          value === 'T2M CTV' ? 'blue' :
            value === 'T2M USER' ? 'default' : 'green';

        return (
          <Tag color={tagColor}>
            {value}
          </Tag>
        );
      },
    },
    {
      title: 'Mã CTV',
      dataIndex: 'affiliateCode',
      ...getColumnSearchProps('affiliateCode'),
      render: (value, record) => (
        <Tag color={'volcano'}>
          {value}
        </Tag>
      )
    },
    {
      title: 'Mã giới thiệu',
      dataIndex: 'sponsorCode',
      ...getColumnSearchProps('sponsorCode'),
      render: (value, record) => (
        <Tag color={'green'}>
          {value}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
    },
    {
      title: 'Quyền CTV',
      align: 'center',
      render: (value, record) => {
        if (record.role === 'T2M USER') {
          return (
            <Button
              type={"primary"}
              icon={<CaretUpOutlined />}
              onClick={() => {
                setIsCTVModalOpen(true)
                setUpdateUserRecord(record)
              }}>
              CTV
            </Button>
          )
        } else if (record.role === 'T2M CTV') {
          return (
            <Button
              type={"primary"} danger
              icon={<CaretDownOutlined />}
              onClick={() => {
                setIsCTVModalOpen(true)
                setUpdateUserRecord(record)
              }}>
              CTV
            </Button>
          )
        }
      }
    },
    {
      title: 'Chỉnh sửa thông tin',
      align: 'center',
      render: (value, record) => {
        return (
          <div>
            <Button shape="circle"
              style={{ marginLeft: "5px" }}
              icon={<EditOutlined />}
              type={"primary"}
              onClick={() => {
                setIsUpdateModalOpen(true)
                setUpdateUserRecord(record)
              }}
            />
            <Button
              type={"primary"} danger
              icon={<RedoOutlined />}
              style={{ marginLeft: "5px" }}
              onClick={() => {
                setIsResetPasswordOpen(true)
                setUpdateUserRecord(record)
              }}>
            </Button>
          </div>
        )
      }
    },
  ];

  return (
    <>
      <CreateUserModal
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <UpdateUserModal
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        updateUserRecord={updateUserRecord}
      />

      <ManageCTVModal
        getData={getData}
        isCTVModalOpen={isCTVModalOpen}
        setIsCTVModalOpen={setIsCTVModalOpen}
        updateUserRecord={updateUserRecord}
      />

      <ResetPasswordModal
        getData={getData}
        isResetPasswordOpen={isResetPasswordOpen}
        setIsResetPasswordOpen={setIsResetPasswordOpen}
        updateUserRecord={updateUserRecord}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1> Danh sách Users</h1>
        <Button icon={<PlusCircleOutlined />} onClick={() => setIsCreateModalOpen(true)} type={'primary'} style={{ fontSize: 16, height: 'auto' }}>Tạo mới</Button>
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
};

export default PageUsers;