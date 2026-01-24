import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import Loading from '@components/reusable/loading/Loading';
import useGetLeaveBalance from '@hooks/leave/useGetLeaveBalance';
import React from 'react';
import { useNavigate } from 'react-router';

const LeaveShowCard = ({ leave }) => {
  const statusStyles = {
    Approved: {
      backgroundColor: '#C7DFFF',
      color: '#3086F3',
      borderColor: '#3086F3',
    },
    Declined: {
      backgroundColor: '#FFECEC',
      color: '#FF5E5E',
      borderColor: '#FF5E5E',
    },
    Pending: {
      backgroundColor: '#F3F4F6',
      color: '#374151',
      borderColor: '#9CA3AF',
    },
  };

  const currentStyle = statusStyles[leave.status] || statusStyles.Pending;

  return (
    <div>
      <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-4 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-bold mb-1 text-gray-500">
            {leave.dateFrom} - {leave.dateTo}
          </p>
        </div>

        <div
          className="text-[14px] font-bold py-1 px-4 rounded-2xl border"
          style={currentStyle}
        >
          {leave.status}
        </div>
      </div>
    </div>
  );
};

const AnnualLeaveDataShow = () => {
  const navigate = useNavigate();
  const navigation = () => navigate(`/work/leave-request`);

  const { data: apiData, isLoading } = useGetLeaveBalance();
  console.log(apiData);

  if (isLoading) {
    return <Loading />;
  }

  // Filter and transform the data for Annual Leave only
  const leaveData =
    apiData?.leaves
      ?.filter((leave) => leave.leaveType === 'Annual Leave')
      .map((leave) => ({
        id: leave._id,
        dateFrom: new Date(leave.startDate).toISOString().split('T')[0],
        dateTo: new Date(leave.endDate).toISOString().split('T')[0],
        leaveType: leave.leaveType,
        status: leave.status.charAt(0).toUpperCase() + leave.status.slice(1), // Capitalize first letter
      })) || [];

  return (
    <div className="max-w-xl mx-auto">
      <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 bg-white h-full space-y-4">
        <BreadCrumb
          currentPage="Annual Leave"
          prevPage="Leave"
          navigation={navigation}
        />
        <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4 mt-4">
          {apiData?.name || 'User Name'}
        </div>

        {/* header */}
        <div className="bg-white px-4 py-2 flex items-center justify-between">
          <p className="text-[14px] font-bold text-[#3086F3]">Annual Leave's</p>
          {/* {data?.annualLeave?.available > 0 && ( */}
          <button
            className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            onClick={() => {
              navigate('/work/leave-request/annual/form');
            }}
          >
            Apply Leave
          </button>
        </div>

        {/* show cards */}
        {leaveData.map((leave) => (
          <LeaveShowCard key={leave.id} leave={leave} />
        ))}
      </div>
    </div>
  );
};

export default AnnualLeaveDataShow;
