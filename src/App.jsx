import React, { useState,useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate  } from 'react-router-dom';
import {
  DesktopOutlined,
  IdcardOutlined,
  MonitorOutlined,
  TeamOutlined,
  UserOutlined,
  RollbackOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
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
import MainLayout from './pages/MainLayout'; // สร้างคอมโพเนนต์นี้ใหม่
import Register from './pages/Register'

// import InventoryReport from './pages/InventoryReport'

const { Header, Content, Sider } = Layout;





const AppContent = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return <Login />;
  }

  return (
    <MainLayout logout={() => {
      logout();
      navigate('/login');
    }}>
      <Content style={{ margin: '26px 16px' }}>
        <Routes>
        <Route path="/" element={<Navigate to="/manageInventory" replace />} />
        <Route path="/manageInventory" element={<ManagementAdmin />} />
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
                  <Route path="/register" element={<Register />} />
                  {/* <Route path="/InventoryReport" element={<InventoryReport />} /> */}
                  </Routes>
      </Content>
    </MainLayout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
};

export default App;