import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/map',
      icon: <EnvironmentOutlined />,
      label: <Link to="/map">轨迹地图</Link>,
    },
    {
      key: '/stats',
      icon: <BarChartOutlined />,
      label: '统计分析',
      children: [
        {
          key: '/stats/footprint',
          label: <Link to="/stats/footprint">足迹排名</Link>,
        },
        {
          key: '/stats/stay',
          label: <Link to="/stats/stay">停留排名</Link>,
        },
        {
          key: '/stats/extreme',
          label: <Link to="/stats/extreme">极值事件</Link>,
        },
      ],
    },
    {
      key: '/admin',
      icon: <SettingOutlined />,
      label: '任务管理',
      children: [
        {
          key: '/admin/import',
          icon: <UploadOutlined />,
          label: <Link to="/admin/import">数据导入</Link>,
        },
        {
          key: '/admin/geocoding',
          label: <Link to="/admin/geocoding">地理编码</Link>,
        },
        {
          key: '/admin/analysis',
          label: <Link to="/admin/analysis">数据分析</Link>,
        },
      ],
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center">
        <div className="text-white text-xl font-bold mr-8">轨迹分析系统</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="flex-1"
        />
      </Header>
      <Content className="p-6 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm min-h-[calc(100vh-180px)]">
          {children}
        </div>
      </Content>
      <Footer className="text-center text-gray-600">
        轨迹分析系统 ©2026 - GPS轨迹数据分析与可视化平台
      </Footer>
    </Layout>
  );
};

export default MainLayout;
