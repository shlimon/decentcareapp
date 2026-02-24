import axiosInstance from '@api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useUpdatePerformanceAppraisalGoal = (id, appraisalId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ staffId, payload }) => {
      const response = await axiosInstance.post(
        `/performance-appraisal/${staffId}/my-performances/${appraisalId}`,
        payload
      );

      if (response.data.success) {
        await queryClient.invalidateQueries({
          queryKey: ['performance-appraisals', appraisalId],
        });
        toast.success('Comment updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update data');
        throw new Error(response.data.message || 'Failed to update data');
      }

      return response.data;
    },

    onError: (error) => {
      console.error('Update error:', error);
    },
  });
};

export default useUpdatePerformanceAppraisalGoal;
