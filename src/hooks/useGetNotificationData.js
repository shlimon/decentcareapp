import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useGetNotificationData = (page = 1) => {
    const limit = 20;

    return useQuery({
        queryKey: ['notifications', page],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/notifications?page=${page}&limit=${limit}`
                );

                const result = response?.data;

                if (result?.success && result?.data) {
                    return result.data;
                }

                toast.error(result?.message || 'Failed to load notifications');
                return null;
            } catch (error) {
                console.error(error);
                toast.error('Error fetching notifications: ' + error.message);
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

export default useGetNotificationData;