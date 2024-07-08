import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  DesktopOutlined,
  IdcardOutlined,
  MonitorOutlined,
  TeamOutlined,
  UserOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import './index.css';

// component
import NavComponent from './components/NavComponent';

// page
import HomePage from './pages/HomePage';
import ManageInventoryMain from './pages/ManageInventoryMain';
import MaintenanceInventoryMain from './pages/MaintenanceInventoryMain';
import DisposeMain from './pages/DisposeMain';
import ReportCheckInventory from './pages/ReportCheckInventory';
import ReportAll from './pages/ReportAll';
import AddInformationCompany from './pages/AddInformationCompany';
import AddInformationTeacher from './pages/AddInformationTeacher';
import AddInventory from './pages/AddInventory';
import AddCompany from './pages/AddCompany';
import AddMaintenant from './pages/AddMaintenant';
import AddMaintenant2 from './pages/AddMaintenant2';
import TestAddInventory from './pages/TestAddInventory';
import AddTeacherPage from './pages/AddTeacherPage';
import ViewInventory from './pages/ViewInventory';
import ManagementAdmin from './pages/ManagementAdmin';
import DetailInventory from './pages/DetailInventory';
import Detailtest from './pages/Detailtest';
import UserDetail from './pages/UserDetail';
import MantinantAdmin from './pages/MantinantAdmin';
import MainPageMantenant from './pages/MainPageMantenant';
import MantenantPage1 from './pages/MantenantPage1';
import MantenantPage2 from './pages/MantenantPage2';
import ManagePage1 from './pages/ManagePage1';
import FixMantenantPage2 from './pages/FixMantenantPage2';
import MaintenancePage3 from './pages/MaintenancePage3';
import RequestManagement from './pages/RequestManagement';
import RequestChangeLocation from './pages/RequestChangeLocation';
import Login from './pages/Login';
import EditInventory from './pages/EditInventory'
import ExportFilePage from './pages/ExportFilePage'
// import InventoryReport from './pages/InventoryReport'

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('จัดการครุภัณฑ์', '3', <Link to="/manageInventory"><DesktopOutlined /></Link>),
  getItem('ดูแลครุภัณฑ์', '4', <Link to="/MantenantPage1"><MonitorOutlined /></Link>),
  getItem('เปลี่ยนที่ตั้ง/ส่งคืนครุภัณฑ์', '5', <Link to="/RequestManagement"><RollbackOutlined /></Link>),
  getItem('จัดการข้อมูลผู้ดูแล', '10', <Link to="/AddInformationTeacher"><IdcardOutlined /></Link>),
  getItem('จัดการข้อมูลตัวแทนบริษัท/ผู้บริจาค', '9', <Link to="/AddInformationCompany"><TeamOutlined /></Link>),
  getItem('ออกรายงาน', '11', <Link to="/ExportFilePage"><TeamOutlined /></Link>),
  getItem('Logout', '2', <Link to="/"><UserOutlined /></Link>),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation(); // ใช้ useLocation เพื่อเช็คตำแหน่งปัจจุบัน
  const isLoginPage = location.pathname === '/'; // เช็คว่าหน้าปัจจุบันคือหน้าล็อกอินหรือไม่

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
              <NavComponent collapsed={collapsed} setCollapsed={setCollapsed} />
            </Header>
            <Content style={{ margin: '26px 16px' }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Routes>
                  <Route path="/manageInventory" element={<ManagementAdmin />} />
                  <Route path="/maintenanceInventory" element={<MaintenanceInventoryMain />} />
                  <Route path="/disposeMain" element={<DisposeMain />} />
                  <Route path="/ReportCheckInventory" element={<ReportCheckInventory />} />
                  <Route path="/ReportAll" element={<ReportAll />} />
                  <Route path="/AddInformationCompany" element={<AddInformationCompany />} />
                  <Route path="/AddInformationTeacher" element={<AddInformationTeacher />} />
                  <Route path="/AddInventory" element={<AddInventory />} />
                  <Route path="/AddCompany" element={<AddCompany />} />
                  <Route path="/AddMaintenant" element={<AddMaintenant />} />
                  <Route path="/AddTeacherPage" element={<AddTeacherPage />} />
                  <Route path="/ViewInventory" element={<AddTeacherPage />} />
                  <Route path="/DetailInventory" element={<Detailtest />} />
                  <Route path="/UserDetailInventory/:id" element={<UserDetail />} />
                  <Route path="/MantinantAdmin" element={<MantinantAdmin />} />
                  <Route path="/MainPageMantenant" element={<MainPageMantenant />} />
                  <Route path="/MantenantPage1" element={<MantenantPage1 />} />
                  <Route path="/MantenantPage2/:id" element={<MantenantPage2 />} />
                  <Route path="/ManagePage1" element={<ManagePage1 />} />
                  <Route path="/FixMantenantPage2" element={<FixMantenantPage2 />} />
                  <Route path="/MaintenancePage3/:id" element={<MaintenancePage3 />} />
                  <Route path="/RequestManagement" element={<RequestManagement />} />
                  <Route path="/RequestChangeLocation" element={<RequestChangeLocation />} />
                  <Route path="/EditInventory/:id" element={<EditInventory />} />
                  <Route path="/ExportFilePage" element={<ExportFilePage />} />
                  {/* <Route path="/InventoryReport" element={<InventoryReport />} /> */}
                </Routes>
              </div>
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default App;
