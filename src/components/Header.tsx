import { Layout, Button, Dropdown, Avatar, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const { Header } = Layout;

const AppHeader = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const userMenu = {
    items: [
      {
        key: 'profile', 
        label: '个人资料',
        onClick: () => navigate('/profile')
      },
      {
        key: 'logout', 
        label: '退出登录',
        onClick: handleLogout
      },
    ],
  };

  const userName = user?.username || '管理员';

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggle}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Dropdown menu={userMenu}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: 8 }}>{userName}</span>
            </div>
          </Dropdown>
        </div>
      )}
    </Header>
  );
};

export default AppHeader;
