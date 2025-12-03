import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useDocumentsData = (staffId) => {
    return useQuery({
        queryKey: ['documents', staffId],
        queryFn: async () => {
            try {

                const response = await axiosInstance.get(
                    `/staffs/${staffId}/my-documents`
                );
                const result = response?.data;

                if (result?.success) {
                    return result.data && Object.keys(result.data).length > 0
                        ? result.data
                        : { noRequest: true };
                }

                toast.error(result?.message || 'Failed to fetch request data');
                return null;
            } catch (error) {
                console.error(error);
                toast.error('Network error. Please try again.');
                return null;
            }
        },
        enabled: !!staffId,
        staleTime: 60 * 1000,
    });
};

export default useDocumentsData;