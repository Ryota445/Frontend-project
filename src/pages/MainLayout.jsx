import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  DesktopOutlined,
  IdcardOutlined,
  MonitorOutlined,
  TeamOutlined,
  UserOutlined,
  RollbackOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';

import NavComponent from '../components/NavComponent'; 
import { useAuth } from '../context/AuthContext';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }


  const MainLayout = ({ children, logout }) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const { user } = useAuth(); 

    const isAdmin = user?.role_in_web?.RoleName === "Admin";

    const items = [
      getItem('จัดการครุภัณฑ์', '3', <Link to="/manageInventory"><DesktopOutlined /></Link>),
      
      ...(isAdmin ? [
        getItem('ดูแลครุภัณฑ์', '4', <Link to="/MantenantPage1"><MonitorOutlined /></Link>),
        getItem('เปลี่ยนที่ตั้ง/ส่งคืนครุภัณฑ์', '5', <Link to="/RequestManagement"><RollbackOutlined /></Link>),
        getItem('จัดการข้อมูลผู้ดูแล', '10', <Link to="/AddInformationTeacher"><IdcardOutlined /></Link>),
        getItem('จัดการข้อมูลตัวแทนบริษัท/ผู้บริจาค', '9', <Link to="/AddInformationCompany"><TeamOutlined /></Link>),
        getItem('ออกรายงาน', '11', <Link to="/ExportFilePage"><FileExcelOutlined /></Link>),
      ] : []),
      { key: 'logout', icon: <UserOutlined />, label: 'Logout', onClick: logout },
    ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        {!collapsed && user && (
          <div style={{ padding: '16px', color: 'white', textAlign: 'center' }}>
            <Text strong style={{ color: 'white', display: 'block',fontSize: '16px' }}>{user.username}</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '14px' }}>Role: {user.role_in_web?.RoleName}</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '14px' }}>{user.responsible?.responsibleName}</Text>
          </div>
        )}


      </Sider>
      <Layout>
      <Header style={{ 
  margin: '0 0px', 
  padding: 0, 
  background: 'white',
  height: 'auto',  // เพิ่มบรรทัดนี้
  lineHeight: 'normal'  // เพิ่มบรรทัดนี้
}}>
          <NavComponent collapsed={collapsed} setCollapsed={setCollapsed} /> {/* เพิ่มบรรทัดนี้ */}
        </Header>
       <Content style={{ 
  margin: 'px 16px 0',  // เพิ่ม margin-top
  background: '#F7F7F8',
  padding: '16px'  // เพิ่มบรรทัดนี้
}}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;