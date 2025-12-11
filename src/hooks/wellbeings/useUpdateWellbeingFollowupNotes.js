import axiosInstance from '@api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUpdateWellbeingFollowupNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ staffId, payload }) => {
      const response = await axiosInstance.post(
        `/wellbeings/${staffId}/my`,
        payload
      );

      if (response.data.success) {
        await queryClient.invalidateQueries({
          queryKey: ['wellbeing-followup-notes'],
        });
      } else {
        throw new Error(response.data.message || 'Failed to update document');
      }

      return response.data;
    },

    onError: (error) => {
      console.error('Update error:', error);
    },
  });
};

export default useUpdateWellbeingFollowupNotes;
