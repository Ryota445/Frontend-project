import React, { createContext, useState, useContext, useEffect } from "react";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt'));

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('jwt', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwt');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
