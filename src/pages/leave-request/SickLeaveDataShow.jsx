import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import Loading from '@components/reusable/loading/Loading';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetLeaveBalance from '@hooks/leave/useGetLeaveBalance';
import { formatDate } from '@utils/DateFormation';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import LeaveSingleDataShow from './LeaveSingleDataShow';

const LeaveShowCard = ({ leave }) => {
  const statusStyles = {
    Approved: {
      backgroundColor: '#FFC6A5',
      color: '#FF5C00',
      borderColor: '#FF5C00',
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
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-bold mb-1 text-gray-500">
            {formatDate(leave.dateFrom)} - {formatDate(leave.dateTo)} (
            {leave.leaveType})
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

const SickLeaveDataShow = () => {
  const { data: apiData, isLoading } = useGetLeaveBalance();
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const navigate = useNavigate();
  const navigation = () => navigate(`/work/leave-request`);

  if (isLoading) {
    return <Loading />;
  }

  // Filter and transform the data for Sick Leave and Personal Leave

  // add anoter one with leaveType 'Annual Leave' add here 'Unpaid Leave'
  const leaveData =
    apiData?.leaves
      ?.filter(
        (leave) =>
          leave.leaveType !== 'Annual Leave' &&
          leave.leaveType !== 'Unpaid Leave',
      )
      .map((leave) => ({
        id: leave._id,
        dateFrom: leave.startDate,
        dateTo: leave.endDate,
        leaveType: leave.leaveType,
        status: leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
      })) || [];

  return (
    <div className="max-w-xl mx-auto">
      <div className="w-full max-w-[800px] rounded-xl font-montserrat p-4 bg-white h-full space-y-4">
        <BreadCrumb
          currentPage="Sick Leave"
          prevPage="Leave"
          navigation={navigation}
        />

        <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4 mt-4">
          {apiData?.name || 'User Name'}
        </div>

        {/* header */}
        <div className="bg-white px-4 py-2 flex items-center justify-between">
          <p className="text-[14px] font-bold text-[#FF5C00]">
            Sick or Personal Leave's
          </p>

          {/* {data?.sickLeave?.available > 0 && ( */}
          <button
            className="bg-[#FF5C00] text-white py-1 px-4 rounded-lg hover:bg-[#E04E00] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:ring-offset-2 transition-colors font-medium"
            onClick={() => {
              navigate('/work/leave-request/sick/form');
            }}
          >
            Apply Leave
          </button>
        </div>

        {/* show cards */}
        {leaveData.map((leave) => (
          <div
            key={leave.id}
            onClick={() => {
              // Find the full leave data from apiData
              const fullLeaveData = apiData?.leaves?.find(
                (l) => l._id === leave.id,
              );
              setSelectedData(fullLeaveData);
              setShowModal(true);
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <LeaveShowCard leave={leave} />
          </div>
        ))}
      </div>

      <ModalWithContent
        title="Leave Details"
        isOpen={showModal}
        setIsOpen={setShowModal}
        maxWidth="max-w-2xl"
        padding={false}
        content={
          selectedData && <LeaveSingleDataShow selectedData={selectedData} />
        }
      />
    </div>
  );
};

export default SickLeaveDataShow;
