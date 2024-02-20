'use client'
import React, { useState } from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';

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
  }
];

const Header: React.FC = () => {
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