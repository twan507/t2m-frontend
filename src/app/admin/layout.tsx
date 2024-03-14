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
  FallOutlined,
  FundViewOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { sendRequest } from '@/utlis/api';
import { useRouter } from 'next/navigation';
import AuthSignInModal from '@/components/auth/signin.modal';
import AuthSignUpModal from '@/components/auth/signup.modal';
import UserInfoModal from '@/components/auth/userinfo.modal';

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

  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)
  const [isUserInfoModal, setUserInfoModalOpen] = useState(false)

  const sider_menu = [
    {
      label: (
        <Link href="/admin/dashboard">
          Dashboard
        </Link>
      ),
      key: 'dashboard',
      icon: <FundViewOutlined style={{ fontSize: '20px', marginLeft: '-1px' }} />
    },
    {
      label: (
        <Link href="/admin/users">
          Users
        </Link>
      ),
      key: 'users',
      icon: <UserOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/admin/products">
          Products
        </Link>
      ),
      key: 'products',
      icon: <ProductOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/admin/licenses">
          Licenses
        </Link>
      ),
      key: 'licenses',
      icon: <FileDoneOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <Link href="/admin/discountcodes">
          Discount Codes
        </Link>
      ),
      key: 'discountcodes',
      icon: <FallOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />
    },
  ]
  return (
    <>
      <AuthSignInModal
        isSignInModalOpen={isSignInModalOpen}
        setSignInModalOpen={setSignInModalOpen}
      />
      <AuthSignUpModal
        isSignUpModalOpen={isSignUpModalOpen}
        setSignUpModalOpen={setSignUpModalOpen}
      />
      <UserInfoModal
        isUserInfoModal={isUserInfoModal}
        setUserInfoModalOpen={setUserInfoModalOpen}
      />
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
              // session ? '' : router.push("/auth/signin")
              session ? setUserInfoModalOpen(true) : setSignInModalOpen(true)
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
                          !session.user.licenseInfo.accessLevel ? '#404040' : (
                            session.user.licenseInfo.accessLevel === 1 ? '#1E7607' : (
                              session.user.licenseInfo.accessLevel === 2 ? '#1777ff' : (
                                session.user.licenseInfo.accessLevel === 3 ? '#642198' : '#98217c'
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
            defaultSelectedKeys={['dashboard']}
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
                height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
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
                  icon: <img src="/photo/header-logo.png" alt="Home Icon" style={{ width: '150px', height: 'auto', paddingTop: '25px', marginLeft: '10px' }} />
                },
                ...(!session ? [
                  {
                    label: <Button ghost type='primary' onClick={() => setSignInModalOpen(true)}
                      style={{ width: '120px', marginLeft: collapsed ? 'calc(100vw - 550px)' : 'calc(100vw - 700px)', fontWeight: 'bold', fontFamily: 'Helvetica Neue, sans-serif' }}
                    >
                      Đăng nhập
                    </Button>,
                    key: 'signin',
                  },
                  {
                    label: <Button type='primary' onClick={() => setSignUpModalOpen(true)}
                      style={{ width: '120px', marginLeft: '-20px', fontWeight: 'bold', fontFamily: 'Helvetica Neue, sans-serif' }}
                    >
                      Đăng ký
                    </Button>,
                    key: 'signup',
                  }
                ] : []),
              ]}
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
    </>
  );
};

export default AdminLayout;