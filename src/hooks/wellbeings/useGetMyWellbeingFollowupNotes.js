import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useGetMyWellbeingFollowupNotes = (staffId) => {
  return useQuery({
    queryKey: ['wellbeing-followup-notes'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/wellbeings/${staffId}/my-wellbeings`);
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
      console.error('Error fetching wellbeing followup notes:', error);
      // Only show network error toast if it's not already handled
      if (!error.message.includes('Failed to load')) {
        toast.error('Network error while fetching wellbeing followup notes');
      }
    },
  });
};

export default useGetMyWellbeingFollowupNotes;
