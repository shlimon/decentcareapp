import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useGetAllDocuments = ({ type, endpoint }) => {
  return useQuery({
    queryKey: [type],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoint);
      return response.data.data;
    },
    staleTime: 300000,
    cacheTime: 300000,
    onError: (error) => {
      toast.error(error.message);
      console.error('Error fetching permissions', error);
    },
  });
};

export default useGetAllDocuments;
