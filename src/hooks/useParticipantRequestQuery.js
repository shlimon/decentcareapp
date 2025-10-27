import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useParticipantRequestQuery = (participantId) => {
    return useQuery({
        queryKey: ['participant-request', participantId],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/requests/participant/${participantId}`
                );
                const result = response?.data;

                if (result?.success) {
                    return result.data && Object.keys(result.data).length > 0
                        ? result.data
                        : { noRequest: true };
                }

                toast.error(result?.message || 'Failed to fetch request data');
                return null;
            } catch (error) {
                console.error(error);
                toast.error('Network error. Please try again.');
                return null;
            }
        },
        enabled: !!participantId,
        staleTime: 5 * 60 * 1000,
    });
};

export default useParticipantRequestQuery;