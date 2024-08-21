import React,{ useState } from 'react';
import { Layout, Menu, Typography,Modal  } from 'antd';
import { Link } from 'react-router-dom';
import {
  DesktopOutlined,
  IdcardOutlined,
  MonitorOutlined,
  TeamOutlined,
  UserOutlined,
  RollbackOutlined,
  FileExcelOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import NavComponent from '../components/NavComponent'; 
import { useAuth } from '../context/AuthContext';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children, onClick) {
    return {
      key,
      icon,
      children,
      label,
      onClick,
    };
  }


  const MainLayout = ({ children, logout }) => {
    const [collapsed, setCollapsed] = React.useState(true);
    const { user } = useAuth(); 

    const isAdmin = user?.role_in_web?.RoleName === "Admin";


    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

const showLogoutModal = () => {
  setIsLogoutModalVisible(true);
};

const handleLogoutCancel = () => {
  setIsLogoutModalVisible(false);
};

const handleLogoutConfirm = () => {
  setIsLogoutModalVisible(false);
  logout();
};

    const items = [
      getItem('จัดการครุภัณฑ์', '3', <Link to="/manageInventory"><DesktopOutlined /></Link>),
      
      ...(isAdmin ? [
        getItem('ดูแลครุภัณฑ์', '4', <Link to="/MantenantPage1"><MonitorOutlined /></Link>),
        getItem('เปลี่ยนที่ตั้ง/ส่งคืนครุภัณฑ์', '5', <Link to="/RequestManagement"><RollbackOutlined /></Link>),
        getItem('จัดการข้อมูลผู้ดูแล', '10', <Link to="/AddInformationTeacher"><IdcardOutlined /></Link>),
        getItem('จัดการข้อมูลตัวแทนบริษัท/ผู้บริจาค', '9', <Link to="/AddInformationCompany"><TeamOutlined /></Link>),
        getItem('ออกรายงาน', '11', <Link to="/ExportFilePage"><FileExcelOutlined /></Link>),
      ] : []),
      getItem('Logout', 'logout', <LogoutOutlined />, null, showLogoutModal),
    ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        {!collapsed && user && (
          <div style={{ padding: '16px', color: 'white', textAlign: 'center' }}>
           
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '14px' }}>{user.responsible?.responsibleName}</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: '14px' }}>สิทธิ์การใช้งาน: {user.role_in_web?.RoleName}</Text>
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
}} 
    onClick={() => setCollapsed(true)}> {/* เพิ่ม onClick ตรงนี้ */}
          {children}
        </Content>
      </Layout>
      <Modal
  title="ยืนยันการออกจากระบบ"
  visible={isLogoutModalVisible}
  onOk={handleLogoutConfirm}
  onCancel={handleLogoutCancel}
  okText="ยืนยัน"
  cancelText="ยกเลิก"
  okButtonProps={{
    className: 'bg-blue-300 text-white hover:bg-blue-500',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
    <LogoutOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
    <p>คุณต้องการออกจากระบบใช่หรือไม่?</p>
  </div>
</Modal>
    </Layout>
  );
};

export default MainLayout;
