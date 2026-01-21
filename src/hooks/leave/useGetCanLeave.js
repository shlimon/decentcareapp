import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const useGetCanLeave = ({ start, end }) => {
    return useQuery({
        queryKey: ['can-leave', start, end],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/leaves/can-leave?start=${start}&end=${end}`,
            );

            const result = response?.data;

            if (result?.success) {
                return result.data;
            }

            const errorMessage = result?.message || 'Failed to load leaves';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        },

        enabled: Boolean(start && end), // ✅ only after both selected
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

export default useGetCanLeave;
