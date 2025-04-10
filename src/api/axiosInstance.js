// src/api/axiosInstance.js
import axios from 'axios';
import { getStoredData, removeStoredData } from '../utils/manageLocalData';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

const axiosInstance = (axiosInstance) => {
  // Request interceptor to attach token
  axiosInstance.interceptors.request.use(
    (config) => {
      const user = getStoredData('user_data');
      const token = user?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
