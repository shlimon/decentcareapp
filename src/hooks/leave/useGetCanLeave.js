import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const useGetCanLeave = (params) => {
    const { start, end, type = '', hours = '' } = params || {};

    return useQuery({
        queryKey: ['can-leave', start, end, type, hours],
        queryFn: async () => {
            const hoursParam = hours ? `&hours=${hours}` : '';
            const response = await axiosInstance.get(
                `/leaves/can-leave?start=${start}&end=${end}&type=${type}${hoursParam}`,
            );

            const result = response?.data;

            if (result?.success) {
                return result.data;
            }

            const errorMessage = result?.message || 'Failed to load leaves';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        },

        enabled: Boolean(start && end && params), // ✅ only after both dates selected and params provided
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

export default useGetCanLeave;
