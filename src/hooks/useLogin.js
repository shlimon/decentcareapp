/* eslint-disable no-unused-vars */
import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/auth";

const useLogin = () => {
  const auth = useAuth();
  const { login } = auth;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post("/user/login", values);

      const data = response.data;

      if (response.status === 200) {
        login(data.token, data.user);
      } else if (response.status === 404) {
        setError(data.message);
      } else {
        message.error("Registration Failed");
      }
    } catch (error) {
      message.error("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const forgetPassword = async (email) => {
    try {
      setLoading(true);
      const response = await api.post("/user/forgetPassword", { email });
      if (response.status === 200) {
        message.success("Password reset link sent to your email");
      } else {
        message.error("Failed to send password reset link");
      }
    } catch (error) {
      message.error("Failed to send password reset link");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      const response = await api.post("/user/resetPassword", {
        token,
        newPassword,
      });
      if (response.status === 200) {
        message.success("Password reset successfully");
        navigate("/");
      } else {
        message.error("Failed to reset password");
      }
    } catch (error) {
      message.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, forgetPassword, resetPassword, error, loading };
};

export default useLogin;
