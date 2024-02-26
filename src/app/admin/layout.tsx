'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserOutlined,
  FileDoneOutlined,
  ProductOutlined,
  UserSwitchOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, MenuProps } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { sendRequest } from '@/utlis/api';
import { useRouter } from 'next/navigation';

const { Header, Footer, Content } = Layout;

function getAvatarName(name: string): string {
  const words = name.split(' ').filter(Boolean);
  if (words.length === 0) return '';

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  const firstInitial = words[0][0];
  const lastInitial = words[words.length - 1][0];
  return (firstInitial + lastInitial).toUpperCase();
}

function getUserName(name: string): string {
  const words = name.split(' ').filter(Boolean);

  if (words.length === 0) return '';
  if (words.length === 1) return words[0];

  return `${words[0]} ${words[words.length - 1]}`;
}

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  const { Sider } = Layout;

  const [collapsed, setCollapsed] = useState(true);

  const router = useRouter()

  const { data: session } = useSession()

  const showLogout = session ? true : false

  //@ts-ignore
  const path = children?.props.childProp?.segment

  const header_menu: MenuProps['items'] = [
    {
      label: <Link href="/">Home</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link href="/admin">Admin</Link>,
      key: 'admin',
      icon: <UserOutlined />,
    },
    session ? {
      label: <Link href="#" onClick={async () => {
        await sendRequest<IBackendRes<any>>({
          url: `http://localhost:8000/api/v1/auth/logout`,
          method: "POST",
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        })
        signOut()
      }}>Logout</Link>,
      key: 'logout',
      icon: <UserOutlined />,
    } : {
      label: <Link href="/auth/signin">Login</Link>,
      key: 'login',
      icon: <UserOutlined />,
    }
  ];

  const sider_menu = [
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
  ]

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth='55px' width='160px'
        style={{
          background: '#0a0a0a',
          borderRight: '2px solid #303030',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
        <Button
          type="text"
          onClick={() => {
            session ? '' : router.push("/auth/signin")
          }}
          block={true}
          style={{
            marginTop: '10px',
            height: "50px",
            color: '#dfdfdf',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'middle'
          }}
        >
          <Avatar
            icon={session ? null : <UserOutlined />}
            style={{ backgroundColor: session ? '#7265e6' : '#404040', marginLeft: '-8px', marginRight: '10px', marginBottom: '5px', minWidth: '36px', height: '36px', paddingTop: '3px' }}
          >
            {session ? getAvatarName(session.user.name) : ''}
          </Avatar>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginTop: session ? '-4px' : '3px', marginLeft: session ? '0px' : '12px' }}>
              <div style={{ fontSize: 14, marginTop: -5 }}>{collapsed ? '' : (session ? getUserName(session.user.name) : 'Đăng nhập')}</div>
              {session && (
                <div style={{ display: 'flex', marginTop: -3 }} >
                  <div style={{ fontSize: 12, marginTop: 2, padding: '0px 5px 0px 5px', background: '#1777ff', borderRadius: 5, width: 'fit-content' }}>{collapsed ? null : 'FREE'}</div>
                  <div style={{ fontSize: 12, marginTop: 2, marginLeft: '5px', padding: '0px 5px 0px 5px', background: '#A20D0D', borderRadius: 5, width: 'fit-content' }}>{collapsed ? null : '30 days'}</div>
                </div>
              )}
            </div>
          )}
        </Button>
        <Button
          type="text"
          icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          block={true}
          style={{
            fontSize: '16px',
            height: "50px",
            color: '#dfdfdf',
          }}
        />
        <Menu
          style={{ background: '#0a0a0a' }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[path]}
          items={sider_menu}
        />
        <div>
          {showLogout && (
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={async () => {
                await sendRequest<IBackendRes<any>>({
                  url: `http://localhost:8000/api/v1/auth/logout`,
                  method: "POST",
                  headers: { 'Authorization': `Bearer ${session?.access_token}` }
                })
                signOut()
              }}
              style={{
                fontSize: '14px',
                height: "50px",
                color: '#dfdfdf',
                marginLeft: collapsed ? '8px' : '13px',
                marginTop: `calc(100vh - 110px - ${5 * 55}px`
              }}
            >
              {collapsed ? '' : 'Đăng xuất'}
            </Button>
          )}
        </div>
      </Sider>
      <Layout style={{ background: '#0a0a0a' }}>
        <Header style={{ margin: '0px', padding: '0px', height: '60px' }}>
          <Menu
            style={{
              background: '#0a0a0a',
              height: '100%', display: 'flex', alignItems: 'center',
              borderBottom: '2px solid #303030',
              position: 'sticky',
              top: 0,
              zIndex: 1000
            }}
            theme='dark'
            mode="horizontal"
            selectedKeys={[]}
            items={[
              {
                label: <Link href='/admin' />,
                key: 'home',
                icon: <img src="/photo/header-logo.png" alt="Home Icon" style={{ width: '150px', height: 'auto', paddingTop: '25px', marginLeft: '5px' }} />
              }]
            }
          />
        </Header>
        <Content
          style={{
            margin: '24px 24px 24px 24px',
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: 10,
            minHeight: 'calc(100vh - 110px)'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout >
  );
};

export default AdminLayout;