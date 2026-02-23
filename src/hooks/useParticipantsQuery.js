import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useParticipantsQuery = (endpoint = '/participants') => {
    const user = localStorage.getItem('user_data');
    const userData = JSON.parse(user || '{}');
    const department = userData?.user?.department;

    // ✅ Map department values
    const getDeptCode = (dept) => {
        if (!dept) return '';

        switch (dept) {
            case 'Direct Support':
                return 'DS';
            case 'Plan Management':
                return 'PM';
            case 'Support Coordination':
                return 'SC';
            default:
                return dept; // send others as-is
        }
    };

    const deptCode = getDeptCode(department);

    return useQuery({
        queryKey: ['participants-list', deptCode],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `${endpoint}?department=${deptCode}`
                );

                const result = response?.data;

                if (result?.success) {
                    return result.data.participants;
                }

                toast.error(result?.message || 'Failed to load participants');
                return [];
            } catch (error) {
                console.error(error);
                toast.error('Network error while fetching participants');
                return [];
            }
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
        enabled: !!deptCode, // prevents call if department missing
    });
};

export default useParticipantsQuery;