import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/auth";

export const useLoginMutation = () => {
  const { login } = useContext(AuthContext);

  return useMutation({
    mutationFn: (data) => axiosInstance.post("/staff/login", data),
    onSuccess: (response) => {
      const userData = {
        user: response?.data?.user,
        token: response?.data?.token,
      };
      login(userData);
      return response?.data;
    },
  });
};
