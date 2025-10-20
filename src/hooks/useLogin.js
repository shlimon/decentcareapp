/* eslint-disable no-unused-vars */
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/auth";

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);

      // Combine first and last name
      const payload = {
        name: `${values.firstName.trim()} ${values.lastName.trim()}`,
        phone: values.phone,
        dob: values.dob,
      };

      const response = await axiosInstance.post("/staffs/sw-login", payload);
      const data = response.data;


      if (data.success) {
        const loginData = { user: data?.data };
        login(loginData);
        toast.success("Login successful");
        navigate("/");
      } else {
        setError(data?.message || "Login failed");
        toast.error(data?.message || "Login failed");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, error, loading };
};

export default useLogin;
