import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const useGetMyTimesheet = (week) => {
    return useQuery({
        queryKey: ['my-timesheet', week],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/timesheets/my-timesheet?week=${week}`,
            );
            return response.data || {};
        },
        enabled: !!week, // only call API if week exists
        staleTime: 300000,
        gcTime: 300000,
    });
};

export default useGetMyTimesheet;
