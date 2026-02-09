import axiosInstance from '@api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { getStoredData } from '@utils/manageLocalData';

const useGetPayRate = () => {
    const userData = getStoredData('user_data');
    const staffId = userData?.user?._id;
    return useQuery({
        queryKey: ['pay-rates'],
        queryFn: async () => {
            const response = await axiosInstance.get(`pay-rates/${staffId}`)
            return response.data || {};
        },
        staleTime: 300000, // 5 minutes
        gcTime: 300000, // renamed from cacheTime in v4+
    });
};

export default useGetPayRate;