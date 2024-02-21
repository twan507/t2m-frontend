'use client'
import React, { useState } from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';


const items: MenuProps['items'] = [
  {
    label: (
      <Link href="/">
        Home
      </Link>
    ),
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: (
      <Link href="/admin">
        Admin
      </Link>
    ),
    key: 'admin',
    icon: <UserOutlined />,
  },
  {
    label: (
      <Link href="/auth/signin">
        Login
      </Link>
    ),
    key: 'login',
    icon: <UserOutlined />,
  },
  {
    label: (
      <Link href="#" onClick={() => signOut()}>
        Logout
      </Link>
    ),
    key: 'logout',
    icon: <UserOutlined />,
  }
];

const Header: React.FC = () => {
  
  const { data: session } = useSession()
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu
      style={{
        width: '100vw',
        borderBottom: 'none',
        background: 'black',
      }}
      theme='dark'
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  )
};

export default Header;