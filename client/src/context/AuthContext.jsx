import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext(null);


export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem('token') || null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 


  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
      
          const res = await axiosInstance.get('/auth/me'); 
          setUser(res.data.data); 
          console.log('Kullanıcı bilgileri yüklendi:', res.data.data);
        } catch (error) {
          console.error('Token doğrulaması başarısız oldu veya sunucu hatası:', error);
          logout(); 
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);


  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
   const { token: receivedToken, user: userData } = res.data;

      
      localStorage.setItem('token', receivedToken); 
      setToken(receivedToken); 
      setUser(userData); 
      console.log('Giriş başarılı:', userData);
      navigate('/'); 
      return { success: true };
    } catch (error) {
      console.error('Giriş hatası:', error.response ? error.response.data.message : error.message);
      return { success: false, message: error.response ? error.response.data.message : 'Bilinməyən xəta' };
    }
  };


  const register = async (fullName, email, password) => {
    try {
      const res = await axiosInstance.post('/auth/register', { fullName, email, password });
     
      console.log('Kayıt başarılı:', res.data);
      navigate('/login');
      return { success: true };
    } catch (error) {
      console.error('Kayıt hatası:', error.response ? error.response.data.message : error.message);
      return { success: false, message: error.response ? error.response.data.message : 'Bilinməyən xəta' };
    }
  };

 
  const logout = () => {
    localStorage.removeItem('token'); 
    setToken(null); 
    setUser(null); 
    navigate('/login'); 
  };
  const authContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user, 
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};