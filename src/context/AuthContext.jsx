import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // เพิ่มสถานะ loading

  const login = async (newToken) => {
    setLoading(true);  // เริ่มต้น loading
    setToken(newToken);
    localStorage.setItem('jwt', newToken);
    
    try {
      const response = await fetch(`${API_URL}/api/custom-user/me`, {
        headers: {
          'Authorization': `Bearer ${newToken}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        // console.log('User data:', userData);
        setUser(userData);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch user data:', errorData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);  // สิ้นสุด loading ไม่ว่าจะสำเร็จหรือไม่
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt');
  };

  useEffect(() => {
    if (token) {
      login(token);
    } else {
      setLoading(false);  // ถ้าไม่มี token ก็ไม่ต้อง loading
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);