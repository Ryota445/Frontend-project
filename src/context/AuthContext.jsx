import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [user, setUser] = useState(null);

  const login = async (newToken) => {
    setToken(newToken);
    localStorage.setItem('jwt', newToken);
    
    try {
      const response = await fetch('http://localhost:1337/api/custom-user/me', {
        headers: {
          'Authorization': `Bearer ${newToken}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        console.log('User data:', userData);  // เพิ่มบรรทัดนี้เพื่อดูข้อมูลที่ได้รับ
        setUser(userData);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch user data:', errorData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);