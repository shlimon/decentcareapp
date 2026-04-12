import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { addWeeks, getISOWeek } from 'date-fns';
import { toast } from 'react-hot-toast';

// weekOffset: 0 = current week, -1 = last week, etc.
const getISOWeekNumber = (offsetWeeks = 0) => {
    const date = addWeeks(new Date(), offsetWeeks);
    return getISOWeek(date);
};

const useGetMyTravels = (weekOffset = 0) => {
    const weekNumber = getISOWeekNumber(weekOffset);

    return useQuery({
        queryKey: ['my-travels', weekNumber],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/travels/my-list?w=${weekNumber}`,
            );
            const result = response?.data;

            if (result?.success) {
                return result.data;
            }

            const errorMessage = result?.message || 'Failed to load travels';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 1,
        onError: (error) => {
            console.error('Error fetching my travels:', error);
            if (!error.message.includes('Failed to load')) {
                toast.error('Network error while fetching my travels');
            }
        },
    });
};

export default useGetMyTravels;