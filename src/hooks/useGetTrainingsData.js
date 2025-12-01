import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useGetTrainingsData = () => {
    return useQuery({
        queryKey: ['trainings'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/trainings`
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

        staleTime: 5 * 60 * 1000, // 5 minutes
        // 👇 REFRESH WHEN USER RETURNS TO TAB
        refetchOnWindowFocus: true,
    });
};

export default useGetTrainingsData;