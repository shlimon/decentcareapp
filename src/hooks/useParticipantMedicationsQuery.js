import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useParticipantMedicationsQuery = (participantId) => {
  return useQuery({
    queryKey: ['participant-medications', participantId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/medication-administrations/participants/${participantId}/schedule/today`
        );

        const result = response?.data;

        // Handle empty data array (no active medications)
        if (Array.isArray(result.data) && result.data.length === 0) {
          return {
            participantName: null,
            participantCommunity: null,
            dosesDueToday: 0,
            administeredToday: 0,
            refused: 0,
            notAdministered: 0,
            todayMedications: [],
          };
        }

        // Transform API response to component format
        return {
          participantName: result.data.participant.name,
          participantAvatar: result.data.participant.avatar,
          participantCommunity: result.data.participant.community,
          dosesDueToday: result.data.summary.dueDoses,
          administeredToday: result.data.summary.administered,
          refused: result.data.summary.refused,
          notAdministered: result.data.summary.notAdministered,
          todayMedications: result.data.medications,
        };
      } catch (error) {
        console.error(error);
        toast.error(
          'Error fetching medication data: ' +
            (error.message || 'Unknown error')
        );
        return null;
      }
    },
    enabled: !!participantId,
    staleTime: 60 * 1000,
    // 👇 REFRESH WHEN USER RETURNS TO TAB
    refetchOnWindowFocus: true,

    // 👇 REFETCH WHEN TAB BECOMES VISIBLE AGAIN
    refetchOnMount: true,
  });
};

export default useParticipantMedicationsQuery;
