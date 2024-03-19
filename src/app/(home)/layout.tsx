'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  UserOutlined,
  FundViewOutlined,
  SearchOutlined,
  LineChartOutlined,
  BarChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Avatar, notification } from 'antd';
import { sendRequest } from '@/utlis/api';
import { useRouter } from 'next/navigation';
import AuthSignInModal from '@/components/auth/signin.modal';
import AuthSignUpModal from '@/components/auth/signup.modal';
import UserInfoModal from '@/components/auth/userinfo.modal';
import FooterComponent from '@/components/footer/footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { signOut } from '@/utlis/signOut';
import { resetAuthState } from '@/redux/authSlice';

const { Header, Footer, Content } = Layout;

function getAvatarName(name: string) {
  const words = name?.split(' ').filter(Boolean);
  if (words) {
    if (words.length === 0) return '';

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    const firstInitial = words[0][0];
    const lastInitial = words[words.length - 1][0];
    return (firstInitial + lastInitial).toUpperCase();
  }
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getUserName(name: string) {
  const words = name?.split(' ').filter(Boolean).map(capitalizeFirstLetter);

  if (words) {
    if (words.length === 0) return '';
    if (words.length === 1) return words[0];
    if (words.length > 4) {
      // Bỏ từ thứ hai và lấy 3 từ còn lại
      return `${words[0]} ${words[2]} ${words[3]}`;
    }
    // Trường hợp còn lại, trả về tên đầy đủ
    return words.join(' ');
  }

}

const Homelayout = ({ children }: React.PropsWithChildren) => {
  //@ts-ignore
  const path = children.props.childProp.segment === "__PAGE__" ? "tong-quan-thi-truong" : children.props.childProp.segment

  const { Sider } = Layout;

  const router = useRouter()

  const [collapsed, setCollapsed] = useState(true);

  const authInfo = useAppSelector((state) => state.auth)
  const authState = !!authInfo.user
  const dispatch = useAppDispatch();

  const showLogout = authState ? true : false

  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false)
  const [isUserInfoModal, setUserInfoModalOpen] = useState(false)
  const [mobileLayout, setmMobileLayout] = useState(false);

  const toggleMobileLayout = () => {
    const currentWidth = window.innerWidth;
    if (currentWidth > 800) {
      setmMobileLayout(false)
    } else {
      setmMobileLayout(true)
    }
  };

  useEffect(() => {
    window.addEventListener('resize', toggleMobileLayout);
    toggleMobileLayout();

    return () => {
      window.removeEventListener('resize', toggleMobileLayout);
    };
  }, []);

  const sider_menu = [
    {
      label: (
        <a onClick={() => { router.push('/tong-quan-thi-truong') }} >
          Tổng quan thị trường
        </a>
      ),
      key: 'tong-quan-thi-truong',
      icon: <FundViewOutlined style={{ fontSize: '20px', marginLeft: '-1px' }} />
    },
    {
      label: (
        <a onClick={() => {
          if (authState) {
            router.push('/dong-tien-thi-truong')
          } else {
            setSignInModalOpen(true)
            notification.warning({
              message: "Không có quyền truy cập",
              description: "Bạn cần đăng nhập để xem nội dung này"
            })
          }
        }} >
          Dòng tiền thị trường
        </a>
      ),
      key: 'dong-tien-thi-truon',
      icon: <LineChartOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <a onClick={() => {
          if (authState) {
            router.push('/dong-tien-nhom-nganh')
          } else {
            setSignInModalOpen(true)
            notification.warning({
              message: "Không có quyền truy cập",
              description: "Bạn cần đăng nhập để xem nội dung này"
            })
          }
        }} >
          Dòng tiền ngành
        </a>
      ),
      key: 'dong-tien-nhom-nganh',
      icon: <BarChartOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
    {
      label: (
        <a onClick={() => {
          if (authState) {
            router.push('/bo-loc-co-phieu')
          } else {
            setSignInModalOpen(true)
            notification.warning({
              message: "Không có quyền truy cập",
              description: "Bạn cần đăng nhập để xem nội dung này"
            })
          }
        }} >
          Bộ lọc cổ phiếu
        </a>
      ),
      key: 'bo-loc-co-phieu',
      icon: <SearchOutlined style={{ fontSize: '18px', marginLeft: '-1px' }} />,
    },
  ]

  const [checkAuth, setCheckAuth] = useState(true);

  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
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
          <Sider trigger={null} collapsible collapsed={collapsed}
            collapsedWidth={mobileLayout ? '0px' : '55px'}
            width='215px'
            style={{
              background: '#000000',
              borderRight: '2px solid #303030',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'sticky',
              top: 0,
              zIndex: 100000000
            }}>
            <Button
              type="text"
              onClick={() => {
                authState ? setUserInfoModalOpen(true) : setSignInModalOpen(true)
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
                icon={authState ? null : <UserOutlined />}
                style={{ backgroundColor: authState ? '#7265e6' : '#404040', marginLeft: '-8px', marginRight: '10px', marginBottom: '5px', minWidth: '36px', height: '36px', paddingTop: '2px' }}
              >
                {authState ? getAvatarName(authInfo.user.name) : ''}
              </Avatar>
              {!collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginTop: authState ? '-4px' : '3px', marginLeft: authState ? '0px' : '12px' }}>
                  <div style={{ fontSize: 16, marginTop: -5 }}>{collapsed ? '' : (authState ? getUserName(authInfo.user.name) : 'Đăng nhập')}</div>
                  {authState && (
                    <div style={{ display: 'flex', marginTop: -3 }} >
                      <div style={{
                        fontSize: 12, marginTop: 2, padding: '0px 5px 0px 5px',
                        background:
                          authInfo.user.role === "T2M ADMIN" ? '#98217c' : (
                            !authInfo.user.licenseInfo?.accessLevel ? '#404040' : (
                              authInfo.user.licenseInfo?.accessLevel === 1 ? '#1E7607' : (
                                authInfo.user.licenseInfo?.accessLevel === 2 ? '#1777ff' : (
                                  authInfo.user.licenseInfo?.accessLevel === 3 ? '#642198' : '#98217c'
                                )))),
                        borderRadius: 5, width: 'fit-content'
                      }}
                      >
                        {collapsed ? null : authInfo.user.role === "T2M ADMIN" ? "ADMIN" : authInfo.user.licenseInfo?.product ?? 'FREE'}
                      </div>
                      {authInfo.user.licenseInfo?.daysLeft && (
                        //@ts-ignore
                        <div style={{ fontSize: 12, marginTop: 2, marginLeft: '5px', padding: '0px 5px 0px 5px', background: '#A20D0D', borderRadius: 5, width: 'fit-content' }}>{collapsed ? null : `${authInfo.user.licenseInfo?.daysLeft} days`}</div>
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
              style={{ background: '#000000' }}
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
                    dispatch(resetAuthState())
                    signOut(authInfo.access_token)
                  }}
                  style={{
                    fontSize: '14px',
                    height: "50px",
                    color: '#dfdfdf',
                    marginLeft: collapsed ? '8px' : '13px',
                    marginTop: `calc(100vh - 120px - ${4 * 55}px`
                  }}
                >
                  {collapsed ? '' : 'Đăng xuất'}
                </Button>
              )}
            </div>
          </Sider>
          <Layout style={{ background: '#000000' }}>
            <Header style={{
              margin: '0px', padding: '0px', height: '60px',
              position: 'sticky',
              top: 0,
              zIndex: 1001
            }}>
              <Menu
                style={{
                  background: '#000000',
                  height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                  borderBottom: '2px solid #303030',
                }}
                theme='dark'
                mode="horizontal"
                selectedKeys={[]}
                items={[
                  // Kiểm tra điều kiện mobileLayout ngay ở đầu để quyết định phần tử hiển thị
                  ...(mobileLayout ? [
                    {
                      label: <a onClick={() => setCollapsed(!collapsed)} />,
                      key: 'home-mobile', // Sử dụng một key khác biệt cho mobile layout
                      icon: collapsed ? <MenuUnfoldOutlined style={{ fontSize: '20px' }} /> : <MenuFoldOutlined style={{ fontSize: '20px' }} />
                    },
                    {
                      label: <Link onClick={() => { window.location.href = "/" }} href='/' />,
                      key: 'home',
                      icon: <img src="/photo/header-logo.png" alt="Home Icon" style={{ width: '140px', height: 'auto', paddingTop: '25px' }} />
                    }
                  ] : [
                    {
                      label: <Link onClick={() => { window.location.href = "/" }} href='/' />,
                      key: 'home',
                      icon: <img src="/photo/header-logo.png" alt="Home Icon" style={{ width: '160px', height: 'auto', paddingTop: '25px', marginLeft: collapsed ? '180px' : '100px' }} />
                    }]),
                  ...(!authState ? [
                    {
                      label: <Button ghost type='primary' onClick={() => setSignInModalOpen(true)}
                        style={{
                          width: mobileLayout ? '100px' : '120px',
                          marginLeft: mobileLayout ? 'calc(100vw - 500px)' : 'calc(100vw - 910px)',
                          fontWeight: 'bold',
                          fontFamily: 'Helvetica Neue, sans-serif'
                        }}
                      >
                        Đăng nhập
                      </Button>,
                      key: 'signin',
                    },
                    {
                      label: <Button type='primary' onClick={() => setSignUpModalOpen(true)}
                        style={{
                          width: mobileLayout ? '100px' : '120px',
                          marginLeft: '-20px',
                          fontWeight: 'bold',
                          fontFamily: 'Helvetica Neue, sans-serif'
                        }}
                      >
                        Đăng ký
                      </Button>,
                      key: 'signup',
                    }
                  ] : []),
                ]}
              />
            </Header>
            <Content>
              {children}
            </Content>
            <FooterComponent />
          </Layout>
        </Layout >
      </>
    )
  }
}

export default Homelayout;