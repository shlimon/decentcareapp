import Loading from '@components/reusable/loading/Loading';
import useGetLeaveParcent from '@hooks/leave/useGetLeaveParcent';
import { Clock, Plane, Radio } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import CustomProgressBarLeave from './CustomProgressBarLeave';

const LeaveRequestPage = () => {
   const navigate = useNavigate();

   const { data, isLoading, error } = useGetLeaveParcent();

   // const data = {
   //    usedHours: 64,
   //    totalHours: 160,
   // };

   const probationProgress =
      (data?.annualLeave?.taken / data?.annualLeave?.available) * 100;

   const sickLeaveProgress =
      (data?.sickLeave?.taken / data?.sickLeave?.available) * 100;

   if (isLoading) {
      return <Loading />;
   }
   if (error) {
      return (
         <div className="text-center py-10">
            <p className="text-red-600 font-medium">
               Failed to load leave data
            </p>
         </div>
      );
   }

   // convert 0.11538461538461535 to 0.12
   const formatProgress = (progress) => {
      if (isNaN(progress) || progress === null || progress === undefined) {
         return 0;
      }
      return Math.min(Math.max(progress, 0), 100).toFixed(2);
   };

   return (
      <div className="max-w-xl mx-auto">
         <div className="w-full max-w-[800px] rounded-xl  font-montserrat p-6 bg-white h-full space-y-4">
            <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
               {data?.name || 'User Name'}
            </div>

            {/* Progress bar for Annual Leave */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
               <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-blue-600 w-5 h-5" />
                  <span className="text-[16px] font-bold text-blue-600">
                     Annual Leave
                  </span>
               </div>
               <p className="text-[14px] text-gray-500 mb-3">
                  Remaining Balance
               </p>
               <CustomProgressBarLeave
                  progress={probationProgress}
                  color="#1B75BB"
                  usedLabel={`Used: ${formatProgress(data.annualLeave.taken)}h`}
                  totalLabel={`Total: ${formatProgress(data.annualLeave.available)}h`}
               />
            </div>

            {/* Progress bar for Sick or Personal Leave */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
               <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-orange-600 w-5 h-5" />
                  <span className="text-[16px] font-bold text-orange-600">
                     Sick or Personal Leave
                  </span>
               </div>
               <p className="text-[14px] text-gray-500 mb-3">
                  Remaining Balance
               </p>
               <CustomProgressBarLeave
                  progress={sickLeaveProgress}
                  color="#FF5C00"
                  usedLabel={`Used: ${formatProgress(data.sickLeave.taken)}h`}
                  totalLabel={`Total: ${formatProgress(data.sickLeave.available)}h`}
               />
            </div>

            {/* div navigate */}

            <div>
               {/* mouse pointer show on css */}
               <div
                  className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-8 flex items-center justify-between cursor-pointer "
                  onClick={() => {
                     navigate('/work/leave-request/annual');
                  }}
               >
                  <div className="w-10 h-10 rounded flex items-center justify-center bg-[#C7DFFF]">
                     <Plane className="w-6 h-6 text-[#3086F3]" />
                  </div>
                  <div>
                     <p className="text-[18px] font-bold mb-1 text-[#3086F3]">
                        Annual Leave
                     </p>
                  </div>
               </div>
            </div>
            <div>
               <div
                  className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-8 flex items-center justify-between cursor-pointer"
                  onClick={() => {
                     navigate('/work/leave-request/sick');
                  }}
               >
                  <div className="w-10 h-10 rounded flex items-center justify-center bg-[#FFC6A6]">
                     <Radio className="w-6 h-6 text-[#FF5C00]" />
                  </div>
                  <div>
                     <p className="text-[18px] font-bold mb-1 text-[#FF5C00]">
                        Sick or Personal Leave
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default LeaveRequestPage;
