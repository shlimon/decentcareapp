import axiosInstance from '@api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      } else {
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
