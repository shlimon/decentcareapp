import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const useGetMyWhsList = () => {
  return useQuery({
    queryKey: ['my-whs-list'],
    queryFn: async () => {
      const response = await axiosInstance.get('/whs/staff/my-whs');
      const result = response?.data;

      if (result?.success) {
        return result.data;
      }

      const errorMessage = result?.message || 'Failed to load whs';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching staff whs:', error);
      // Only show network error toast if it's not already handled
      if (!error.message.includes('Failed to load')) {
        toast.error('Network error while fetching staff whs');
      }
    },
  });
};

export default useGetMyWhsList;
