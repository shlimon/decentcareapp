// src/api/axiosInstance.js
import * as Sentry from '@sentry/react';
import axios from 'axios';
import { getStoredData, removeStoredData } from '../utils/manageLocalData';

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://test-dc-central-api.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Renamed function to avoid shadowing the exported variable
const setupInterceptors = (axiosInstance) => {
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

      config.headers['x-timezone'] =
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor to handle errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      Sentry.captureException(error, {
        tags: { type: 'api-error' },
        extra: {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          responseData: error.response?.data,
        },
      });

      if (error.response?.status === 401) {
        removeStoredData('user_data');
        window.location.href = '/login';
      }

      if (error.response?.status === 403) {
        console.error('Access forbidden - insufficient permissions');
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export default setupInterceptors(instance);