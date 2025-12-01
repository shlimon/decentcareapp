import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useGetParticipantMedicationQuery = (participantId, medicationId) => {
  return useQuery({
    queryKey: ['medication-administration', participantId, medicationId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/medication-administrations/participants/${participantId}/records/${medicationId}`
        );

        const result = response?.data;

        if (result?.success && result?.data) {
          return result.data;
        }

        toast.error(result?.message || 'Failed to load medication data');
        return null;
      } catch (error) {
        console.error(error);
        toast.error('Error fetching medication data: ' + error.message);
        return null;
      }
    },

    staleTime: 0, // Data is always stale
    cacheTime: 0, // Don't cache data
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnReconnect: true, // Refetch when reconnecting
  });
};

export default useGetParticipantMedicationQuery;