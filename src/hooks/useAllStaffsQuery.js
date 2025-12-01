import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useAllStaffsQuery = (endpoint = '/staffs') => {
    return useQuery({
        queryKey: ['staff-list', endpoint],
        queryFn: async () => {
            const response = await axiosInstance.get(endpoint);
            const result = response?.data;

            if (result?.success) {
                return result.data;
            }

            const errorMessage = result?.message || 'Failed to load staff members';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        },
        staleTime: 5 * 60 * 1000,
        // 👇 REFRESH WHEN USER RETURNS TO TAB
        refetchOnWindowFocus: true,
        retry: 1,
        onError: (error) => {
            console.error('Error fetching staff members:', error);
            // Only show network error toast if it's not already handled
            if (!error.message.includes('Failed to load')) {
                toast.error('Network error while fetching staff members');
            }
        },
    });
};

export default useAllStaffsQuery;