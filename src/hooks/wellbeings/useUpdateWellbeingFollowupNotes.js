import axiosInstance from '@api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUpdateWellbeingFollowupNotes = (id,
  followUpId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await axiosInstance.post(
        `/wellbeings/${id}/my-wellbeings/${followUpId}`,
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
