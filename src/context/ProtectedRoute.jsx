import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

    // อนุญาตให้เข้าถึง /register โดยไม่ต้องมี token
  if (location.pathname === "/register") {
    return children;
  }
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }



  // ถ้าต้องการตรวจสอบข้อมูล user เพิ่มเติม สามารถทำได้ที่นี่
  // เช่น ตรวจสอบ role หรือ permissions

  return children;
};
export default ProtectedRoute;
