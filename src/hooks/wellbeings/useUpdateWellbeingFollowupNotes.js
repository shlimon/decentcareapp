import axiosInstance from '@api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useUpdateWellbeingFollowupNotes = (id, followUpId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ staffId, payload }) => {
      const response = await axiosInstance.post(
        `/wellbeings/${staffId}/my-wellbeings/${followUpId}`,
        payload
      );

      if (response.data.success) {
        await queryClient.invalidateQueries({
          queryKey: ['wellbeing-followup-notes'],
        });
        toast.success('Note updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update document');
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
