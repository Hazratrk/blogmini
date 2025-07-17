// frontend/src/api/axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5450/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
 
    if (error.response && error.response.status === 401) {

      console.error('Unauthorized access - token expired or invalid. Logging out...');
      localStorage.removeItem('token'); 
    
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;