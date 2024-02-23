'use client'
import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileDoneOutlined,
  UserOutlined,
  ProductOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import Link from 'next/link';



const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  const [collapsed, setCollapsed] = useState(true);

  //@ts-ignore
  const path = children.props.childProp.segment

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          style={{ height: '100%', borderRight: 0, background: 'black', minHeight: 'calc(100vh - 50px)' }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[path]}
          items={[
            {
              label: (
                <Link href="/admin/dashboard">
                  Dashboard
                </Link>
              ),
              key: 'dashboard',
              icon: <UserOutlined />,
            },
            {
              label: (
                <Link href="/admin/users">
                  Users
                </Link>
              ),
              key: 'users',
              icon: <UserOutlined />,
            },
            {
              label: (
                <Link href="/admin/products">
                  Products
                </Link>
              ),
              key: 'products',
              icon: <ProductOutlined />,
            },
            {
              label: (
                <Link href="/admin/licenses">
                  Licenses
                </Link>
              ),
              key: 'licenses',
              icon: <FileDoneOutlined />,
            },
            {
              label: (
                <Link href="/admin/roles">
                  Roles
                </Link>
              ),
              key: 'roles',
              icon: <UserSwitchOutlined />,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: 'white' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            // minHeight: '82vh',
            background: 'white',
            borderRadius: 10,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;