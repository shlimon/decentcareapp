// src/api/axiosInstance.js
import axios from 'axios';
import { getStoredData, removeStoredData } from '../utils/manageLocalData';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://test-dc-central-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosInstance = (axiosInstance) => {
  // Request interceptor to attach token and user info
  axiosInstance.interceptors.request.use(
    (config) => {
      const userData = getStoredData('user_data');
      const user = userData?.user;
      const token = userData?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (user) {
        config.headers['name'] = user.name || '';
        config.headers['phone'] = user.phone || '';
        config.headers['dob'] = user.dob || '';
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle 401 errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeStoredData('user_data');
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default axiosInstance(instance);
