import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useGetParticipantMedicationQuery = (participantId, medicationId) => {
    return useQuery({
        queryKey: ['medication-administration', participantId, medicationId],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/medication-administrations/participant/${participantId}/administer/${medicationId}`
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
        enabled: !!participantId && !!medicationId, // Only run query if both IDs exist
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useGetParticipantMedicationQuery;