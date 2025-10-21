import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useRequestsQuery = () => {
    return useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get('/requests?request=my-request');
                const result = response?.data;

                console.log('Requests Fetch Result:', response);

                if (result?.success) {
                    return result.data;
                }

                toast.error(result?.message || 'Failed to load requests');
                return [];
            } catch (error) {
                console.log(error);
                toast.error('Network error while fetching requests');
                return [];
            }
        },
        staleTime: 5 * 60 * 1000,
    });
};

export default useRequestsQuery;