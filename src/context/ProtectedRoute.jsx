import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // แสดง loading indicator หรือ null ขณะรอข้อมูล
    return null;  // หรือ return <LoadingSpinner /> ถ้าคุณมี component สำหรับแสดง loading
  }

  if (location.pathname === "/register") {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role_in_web?.RoleName !== "Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;