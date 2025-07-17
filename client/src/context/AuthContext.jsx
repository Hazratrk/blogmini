//AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react'; 
import axiosInstance from '../../api/axiosInstance'
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();


export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            logout(); 
            return;
          }


          const res = await axiosInstance.get('/auth/me');
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Authentication check failed:", error);
          logout(); 
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user); 
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data.message : error.message);
      throw error;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const res = await axiosInstance.post('/auth/register', { fullName, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user); 
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data.message : error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');

    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);

  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};