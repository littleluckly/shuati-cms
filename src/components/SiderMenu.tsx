import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;

const SiderMenu = () => {
  const location = useLocation();

  return (
    <Sider trigger={null} theme="light" collapsible>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          刷题CMS系统
        </Title>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={[
          {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">仪表盘</Link>,
          },
          {
            key: "/subjects",
            icon: <BookOutlined />,
            label: <Link to="/subjects">科目管理</Link>,
          },
          {
            key: "/questions",
            icon: <BookOutlined />,
            label: <Link to="/questions">题目管理</Link>,
          },
          {
            key: "/users",
            icon: <UserOutlined />,
            label: <Link to="/users">用户管理</Link>,
          },
          {
            key: "/settings",
            icon: <SettingOutlined />,
            label: <Link to="/settings">系统设置</Link>,
          },
        ]}
      />
    </Sider>
  );
};

export default SiderMenu;
