import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useGetAllMyConflicts = (endpoint = '/conflicts/staff/my-conflicts') => {
    return useQuery({
        queryKey: ['my-conflicts', endpoint],
        queryFn: async () => {
            const response = await axiosInstance.get(endpoint);
            const result = response?.data;

            if (result?.success) {
                return result.data;
            }

            const errorMessage = result?.message || 'Failed to load conflicts of interest';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        },
        staleTime: 60 * 1000,
        // 👇 REFRESH WHEN USER RETURNS TO TAB
        refetchOnWindowFocus: true,
        retry: 1,
        onError: (error) => {
            console.error('Error fetching conflicts of interest:', error);
            // Only show network error toast if it's not already handled
            if (!error.message.includes('Failed to load')) {
                toast.error('Network error while fetching conflicts of interest');
            }
        },
    });
};

export default useGetAllMyConflicts;