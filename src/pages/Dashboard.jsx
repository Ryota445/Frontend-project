import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu,  Button ,theme } from 'antd';
import NavComponent from '../components/NavComponent';
import FooterComponent from '../components/FooterComponent';


const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}



const items = [
  getItem('หน้าหลัก', '1', <PieChartOutlined />),
  getItem('ครุภัณฑ์', 'sub1', <DesktopOutlined />, [
      getItem('จัดการครุภัณฑ์', '3'),
      getItem('การบำรุงรักษา', '4'),
      getItem('การทำจำหน่าย', '5'),
    ]),
    getItem('ทำรายงาน', 'sub2', <FileOutlined />, [getItem('ทำรายงานตรวจเช็คครุภัณฑ์', '6'), getItem('นำข้อมูลออก', '8')]),
    getItem('เพิ่มข้อมูลบริษัท', '9', <TeamOutlined />),
    getItem('Logout', '2', <UserOutlined />),
];
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        
      <Header
          style={{
              padding: 0,
              background: colorBgContainer,
            }}
            >
           <NavComponent collapsed={collapsed} setCollapsed={setCollapsed} />

        </Header>
      
      





        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Bill is a cat.
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
           <FooterComponent/>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;