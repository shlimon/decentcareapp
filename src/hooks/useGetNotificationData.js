import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useGetNotificationData = (page = 1) => {
    const limit = 10;

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
        staleTime: 5 * 60 * 1000, // 5 minutes
        keepPreviousData: true, // Keep previous data while loading new page
    });
};

export default useGetNotificationData;