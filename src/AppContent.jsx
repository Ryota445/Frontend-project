import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './pages/MainLayout';
import ManagementAdmin from './pages/ManagementAdmin';
import AddInformationCompany from './pages/AddInformationCompany';
import AddInformationTeacher from './pages/AddInformationTeacher';
import AddInventory from './pages/AddInventory';
import UserDetail from './pages/UserDetail';
import MantenantPage1 from './pages/MantenantPage1';
import MantenantPage2 from './pages/MantenantPage2';
import MaintenancePage3 from './pages/MaintenancePage3';
import RequestManagement from './pages/RequestManagement';
import RequestChangeLocation from './pages/RequestChangeLocation';
import EditInventory from './pages/EditInventory';
import ExportFilePage from './pages/ExportFilePage';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './context/ProtectedRoute';

const AppContent = () => {
  const { token, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;  // หรือใช้ LoadingSpinner component
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout logout={() => {
      logout();
      navigate('/login');
    }}>
      <Routes>
        <Route path="/" element={<Navigate to="/manageInventory" replace />} />
        <Route path="/manageInventory" element={<ManagementAdmin />} />
        <Route path="/AddInformationCompany" element={<ProtectedRoute adminOnly><AddInformationCompany /></ProtectedRoute>} />
        <Route path="/AddInformationTeacher" element={<ProtectedRoute adminOnly><AddInformationTeacher /></ProtectedRoute>} />
        <Route path="/AddInventory" element={<ProtectedRoute adminOnly><AddInventory /></ProtectedRoute>} />
        <Route path="/UserDetailInventory/:id" element={<UserDetail />} />
        <Route path="/MantenantPage1" element={<ProtectedRoute adminOnly><MantenantPage1 /></ProtectedRoute>} />
        <Route path="/MantenantPage2/:id" element={<ProtectedRoute adminOnly><MantenantPage2 /></ProtectedRoute>} />
        <Route path="/MaintenancePage3/:id" element={<ProtectedRoute adminOnly><MaintenancePage3 /></ProtectedRoute>} />
        <Route path="/RequestManagement" element={<ProtectedRoute adminOnly><RequestManagement /></ProtectedRoute>} />
        <Route path="/RequestChangeLocation" element={<ProtectedRoute adminOnly><RequestChangeLocation /></ProtectedRoute>} />
        <Route path="/EditInventory/:id" element={<ProtectedRoute adminOnly><EditInventory /></ProtectedRoute>} />
        <Route path="/ExportFilePage" element={<ProtectedRoute adminOnly><ExportFilePage /></ProtectedRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </MainLayout>
  );
};

export default AppContent;