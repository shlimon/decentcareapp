import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useGetNotificationData = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/notifications`
                );

                const result = response?.data;

                if (result?.success && result?.data) {

                    return result.data;
                }

                toast.error(result?.message || 'Failed to load medication notification data');
                return null;
            } catch (error) {
                console.error(error);
                toast.error('Error fetching medication notification data: ' + error.message);
                return null;
            }
        },

        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useGetNotificationData;