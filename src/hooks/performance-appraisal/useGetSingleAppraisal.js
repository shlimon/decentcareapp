import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useGetSingleAppraisal = (staffId, appraisalId) => {
  return useQuery({
    queryKey: ['performance-appraisals', appraisalId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/performance-appraisal/${staffId}/my-performances/${appraisalId}`
      );
      const result = response?.data;

      if (result?.success) {
        return result.data;
      }

      const errorMessage =
        result?.message || 'Failed to load single performance appraisal';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
    onError: (error) => {
      console.error('Error fetching single performance appraisal:', error);
      // Only show network error toast if it's not already handled
      if (!error.message.includes('Failed to load')) {
        toast.error(
          'Network error while fetching single performance appraisal'
        );
      }
    },
  });
};

export default useGetSingleAppraisal;
