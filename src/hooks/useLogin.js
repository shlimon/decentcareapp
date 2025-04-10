/* eslint-disable no-unused-vars */
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/auth';

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axiosInstance.post('/staff/login', values);

      const data = response.data;

      if (response.status === 200) {
        const loginData = { token: data?.token, user: data?.user };
        login(loginData);
      } else if (response.status === 404) {
        setError(data.message);
      } else {
        toast.error('Registration Failed');
      }
    } catch (error) {
      toast.error('Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  const forgetPassword = async (email) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/staff/forgetPassword', {
        email,
      });
      if (response.status === 200) {
        toast.success('Password reset link sent to your email');
      } else {
        toast.error('Failed to send password reset link');
      }
    } catch (error) {
      toast.error('Failed to send password reset link');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/staff/resetPassword', {
        token,
        password,
      });
      if (response.status === 200) {
        toast.success('Password reset successfully');
        navigate('/');
      } else {
        toast.error('Failed to reset password');
      }
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, forgetPassword, resetPassword, error, loading };
};

export default useLogin;
