import StatusBadgeForWellbeing from '@components/wellbeing-followup/StatusBadgeForWellbeing';
import { useAuth } from '@context/auth';
import useGetMYAllPerformanceAppraisals from '@hooks/performance-appraisal/useGetMYAllPerformanceAppraisals';
import { formatDate } from '@utils/DateFormation';
import React from 'react';
import { useNavigate } from 'react-router';

function PerformanceAppraisalList() {
    const navigate = useNavigate();

    const { userData } = useAuth();
    const user = userData?.user;

    const { data, isLoading, isError } = useGetMYAllPerformanceAppraisals(
        user?._id
    );

    const handleClick = (item) => {
        navigate(`/work/my-performance-appraisal/${user?._id}/details/${item._id}`);
    };

    return (
        <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 h-full space-y-4">
            <p className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
                My Performance Appraisals
            </p>

            {isLoading && (
                <p className="text-gray-500">
                    Loading yearly performance appraisals...
                </p>
            )}

            {isError && (
                <p className="text-red-500">
                    Failed to load performance appraisals. Please try again.
                </p>
            )}

            {!isLoading && !isError && (!data || data.length === 0) && (
                <p className="text-gray-500 italic">
                    No performance appraisals available.
                </p>
            )}

            <div className="space-y-3">
                {!isLoading &&
                    !isError &&
                    data?.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleClick(item)}
                            className="border bg-gray-50 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {formatDate(item.checkInDate) || 'N/A'}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {item.assessor || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end space-y-4">
                                    <div>
                                        <StatusBadgeForWellbeing
                                            status={item.status}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Follow Up Tasks
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {item.followupActions?.complete} /{' '}
                                            {item.followupActions?.total}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default PerformanceAppraisalList;
