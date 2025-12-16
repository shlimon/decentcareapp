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
                            className="group border border-gray-200 bg-white p-5 rounded-xl cursor-pointer
             hover:shadow-md hover:border-gray-300 transition-all duration-200"
                        >
                            <div className="flex justify-between items-start">
                                {/* Left Section */}
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        Check-in Date
                                    </p>
                                    <p className="text-base font-semibold text-gray-800">
                                        {formatDate(item.checkInDate) || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Assessor:{' '}
                                        <span className="font-medium">
                                            {item.assessor || 'N/A'}
                                        </span>
                                    </p>
                                </div>

                                {/* Right Section */}
                                <div className="flex flex-col items-end space-y-3">
                                    {/* Status */}
                                    <StatusBadgeForWellbeing status={item.status} />

                                    {/* Goals */}
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Goals
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {item.followupActions?.complete ?? 0} /{' '}
                                            {item.followupActions?.total ?? 0}
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
