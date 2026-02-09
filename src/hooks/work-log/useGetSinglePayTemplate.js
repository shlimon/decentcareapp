import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const useGetSinglePayTemplate = ({ id }) => {
    return useQuery({
        queryKey: ['pay-templates', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`sw-templates/${id}`);
            return response.data || {};
        },
        enabled: !!id,          // 👈 this is the key line
        staleTime: 300000,      // 5 minutes
        gcTime: 300000,
    });
};

export default useGetSinglePayTemplate;
