import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/auth/login", data);
      const token = response.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      return response.data;
    },
  });
