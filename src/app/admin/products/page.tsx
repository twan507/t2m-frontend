'use client'
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { TableColumnType, TableProps } from 'antd';
import { Button, Input, Popconfirm, Space, Switch, Table, Tag, notification } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utlis/api';

import {
  EditOutlined,
  RedoOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  CheckOutlined
} from '@ant-design/icons';

import CreateUserModal from '../users/components/create.user.modal';
import UpdateUserModal from '../users/components/update.user.modal';
import ManageCTVModal from '../users/components/manege.ctv.modal';
import ResetPasswordModal from '../users/components/reset.password.modal';
import CreatProductModal from './components/create.products.modal';


interface DataType {
  name: string;
  monthsDuration: number;
  accessLevel: number;
  price: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}


type DataIndex = keyof DataType;


const PageProducts: React.FC = () => {
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
      url: `http://localhost:8000/api/v1/products`,
      method: "GET",
      queryParams: { current: meta.current, pageSize: meta.pageSize },
      headers: { 'Authorization': `Bearer ${session?.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
    try { setMeta(res.data.meta) } catch (error) { }
  }

  const handleOnChange = async (current: number, pageSize: number) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `http://localhost:8000/api/v1/products`,
      method: "GET",
      queryParams: { current: current, pageSize: pageSize },
      headers: { 'Authorization': `Bearer ${session?.access_token}` }
    })
    try { setListUsers(res.data.result) } catch (error) { }
    try { setMeta(res.data.meta) } catch (error) { }
  }

  const changeActive = async (record: any, status: boolean) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `http://localhost:8000/api/v1/products/${record._id}`,
      method: "PATCH",
      headers: { 'Authorization': `Bearer ${session?.access_token}` },
      body: { status: status }
    })

    if (res.data) {
      await getData()
      notification.success({
        message: `Điều chỉnh trạng thái thành công`
      })
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message
      })
    }
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
          // placeholder={`Search ${dataIndex}`}
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
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      render: (value, record) => {
        const tagColor = value === 'FREE' ? '#404040' :
          record.accessLevel === 1 ? '#1E7607' :
            record.accessLevel === 2 ? '#1777ff' :
              record.accessLevel === 3 ? '#7539B7' : '#98217c'; 
        return (
          <Tag color={tagColor}>
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'Thời hạn (Tháng)',
      dataIndex: 'monthsDuration',
      ...getColumnSearchProps('monthsDuration'),
    },
    {
      title: 'Access Level',
      dataIndex: 'accessLevel',
      ...getColumnSearchProps('accessLevel'),
    },
    {
      title: 'Giá gốc',
      dataIndex: 'price',
      ...getColumnSearchProps('price'),
      render: (text) => {
        // Chuyển đổi số thành chuỗi có dấu phẩy phân cách hàng nghìn và thêm đơn vị đồng
        return text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      ...getColumnSearchProps('createdBy'),
      render: (value: any, record) => value?.email
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['descend', 'ascend'],
      render: (value, record) => new Date(value).toLocaleDateString('en-GB'),
    },
    {
      title: 'Trạng thái',
      align: 'center',
      dataIndex: 'isActive',
      ...getColumnSearchProps('isActive'),
      render: (value, record) => {
        const tagColor = value === true ? 'green' : 'red'
        return (
          <Tag color={tagColor}>
            {value ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: 'Thay đổi trạng thái',
      align: 'center',
      dataIndex: 'isActive',
      render: (value, record) => < Switch defaultChecked={value} onChange={() => changeActive(record, value ? false : true)} />
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
              type={"primary"}
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
      <CreatProductModal
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
        <h1> Danh sách sản phẩm</h1>
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

export default PageProducts;