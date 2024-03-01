'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
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

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getUserName(name: string): string {
  const words = name.split(' ').filter(Boolean).map(capitalizeFirstLetter);

  if (words.length === 0) return '';
  if (words.length === 1) return words[0];
  if (words.length > 4) {
    // Bỏ từ thứ hai và lấy 3 từ còn lại
    return `${words[0]} ${words[2]} ${words[3]}`;
  }

  // Trường hợp còn lại, trả về tên đầy đủ
  return words.join(' ');
}

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  const { Sider } = Layout;

  const [collapsed, setCollapsed] = useState(true);

  const router = useRouter()

  const { data: session } = useSession()

  const showLogout = session ? true : false

  //@ts-ignore
  const path = children?.props.childProp?.segment

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
      <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth='55px' width='200px'
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
            style={{ backgroundColor: session ? '#7265e6' : '#404040', marginLeft: '-8px', marginRight: '10px', marginBottom: '5px', minWidth: '36px', height: '36px', paddingTop: '2px' }}
          >
            {session ? getAvatarName(session.user.name) : ''}
          </Avatar>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginTop: session ? '-4px' : '3px', marginLeft: session ? '0px' : '12px' }}>
              <div style={{ fontSize: 14, marginTop: -5 }}>{collapsed ? '' : (session ? getUserName(session.user.name) : 'Đăng nhập')}</div>
              {session && (
                <div style={{ display: 'flex', marginTop: -3 }} >
                  <div style={{
                    fontSize: 12, marginTop: 2, padding: '0px 5px 0px 5px',
                    background:
                      session.user.role === "T2M ADMIN" ? '#98217c' : (
                        !session.user.licenseInfo.product ? '#404040' : (
                          session.user.licenseInfo.product === "BASIC" ? '#1E7607' : (
                            session.user.licenseInfo.product === "PRO" ? '#1777ff' : (
                              session.user.licenseInfo.product === "PREMIUM" ? '#98217c' : '#404040'
                            )))),
                    borderRadius: 5, width: 'fit-content'
                  }}
                  >
                    {collapsed ? null : session.user.role === "T2M ADMIN" ? "ADMIN" : session.user.licenseInfo.product ?? 'FREE'}
                  </div>
                  {session.user.licenseInfo.daysLeft && (
                    //@ts-ignore
                    <div style={{ fontSize: 12, marginTop: 2, marginLeft: '5px', padding: '0px 5px 0px 5px', background: '#A20D0D', borderRadius: 5, width: 'fit-content' }}>{collapsed ? null : `${session.user.licenseInfo.daysLeft} days`}</div>
                  )}
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
                label: <Link href='/' />,
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