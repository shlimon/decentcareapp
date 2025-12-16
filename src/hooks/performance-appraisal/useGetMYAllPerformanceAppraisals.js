import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useGetMYAllPerformanceAppraisals = (staffId) => {
  return useQuery({
    queryKey: ['performance-appraisals'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/performance-appraisal/${staffId}/my-performances`
      );
      const result = response?.data;

      if (result?.success) {
        return result.data;
      }

      const errorMessage =
        result?.message || 'Failed to load wellbeing followup notes';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
    onError: (error) => {
      console.error('Error fetching all year performance appraisals:', error);
      // Only show network error toast if it's not already handled
      if (!error.message.includes('Failed to load')) {
        toast.error(
          'Network error while fetching all year performance appraisals'
        );
      }
    },
  });
};

export default useGetMYAllPerformanceAppraisals;
