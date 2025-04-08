// src/api/axiosInstance.js
import axios from "axios";
import { getStoredData, removeStoredData } from "../utils/manageLocalData";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

const axiosInstanceWarper = (axiosInstance) => {
  // Request interceptor to attach token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getStoredData("token"); // Or use sessionStorage
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
        removeStoredData("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default axiosInstanceWarper(instance);
