import React from 'react';
import { useNavigate } from 'react-router';

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
                  {leave.dateFrom} - {leave.dateTo} ({leave.leaveType})
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
   const navigate = useNavigate();
   const data = [
      {
         id: 'LR-001',
         dateFrom: '2025-01-21',
         dateTo: '2025-01-29',
         leaveType: 'Sick Leave',
         status: 'Pending',
      },
      {
         id: 'LR-002',
         dateFrom: '2025-01-21',
         dateTo: '2025-01-29',
         leaveType: 'Personal Leave',
         status: 'Approved',
      },
      {
         id: 'LR-003',
         dateFrom: '2025-01-21',
         dateTo: '2025-01-29',
         leaveType: 'Sick Leave',
         status: 'Declined',
      },
   ];

   return (
      <div className="max-w-xl mx-auto">
         <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 bg-white h-full space-y-4">
            <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
               {JSON.parse(localStorage.getItem('user_data'))?.user?.name ||
                  'User Name'}
            </div>

            {/* header */}
            <div className="bg-white px-4 py-2 flex items-center justify-between">
               <p className="text-[14px] font-bold text-[#FF5C00]">
                  Sick or Personal Leave’s
               </p>

               <button
                  className="bg-[#FF5C00] text-white py-1 px-4 rounded-lg hover:bg-[#E04E00] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:ring-offset-2 transition-colors font-medium"
                  onClick={() => {
                     navigate('/work/document-data/sick/form');
                  }}
               >
                  Apply Leave
               </button>
            </div>

            {/* show cards */}
            {data.map((leave) => (
               <LeaveShowCard key={leave.id} leave={leave} />
            ))}
         </div>
      </div>
   );
};

export default SickLeaveDataShow;
