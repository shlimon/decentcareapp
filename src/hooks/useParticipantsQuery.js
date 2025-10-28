import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useParticipantsQuery = (endpoint = '/participants') => {
    return useQuery({
        queryKey: ['participants-list'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(endpoint);
                const result = response?.data;

                if (result?.success) {
                    return result.data;
                }

                toast.error(result?.message || 'Failed to load participants');
                return [];
            } catch (error) {
                console.error(error);
                toast.error('Network error while fetching participants');
                return [];
            }
        },
        staleTime: 5 * 60 * 1000,
    });
};

export default useParticipantsQuery;