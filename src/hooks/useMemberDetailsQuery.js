import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useMemberDetailsQuery = () => {
    return useQuery({
        queryKey: ['/participants'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get('/membersWithDetails');

                return Array.isArray(response?.data) ? response?.data : [];
            } catch (error) {
                console.error(error);
                toast.error('Error fetching insights');
                return [];
            }
        },
        staleTime: 5 * 60 * 1000,
    });
};

export default useMemberDetailsQuery;
