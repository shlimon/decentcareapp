import Loading from '@components/reusable/loading/Loading';
import useGetLeaveBalance from '@hooks/leave/useGetLeaveBalance';
import { Clock, Plane } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import CustomProgressBarLeave from './CustomProgressBarLeave';

const LeaveRequestPage = () => {
   const navigate = useNavigate();

   const { data, isLoading, error } = useGetLeaveBalance();

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

   // ---- SAFE DATA EXTRACTION ----
   const annualTaken = data?.annualLeave?.taken ?? 0;
   const annualAvailable = data?.annualLeave?.available ?? 0;

   const sickTaken = data?.sickLeave?.taken ?? 0;
   const sickAvailable = data?.sickLeave?.available ?? 0;

   // ---- PROGRESS (ONLY FOR BAR WIDTH) ----
   const annualProgress =
      annualAvailable > 0 ? (annualTaken / annualAvailable) * 100 : 0;

   const sickProgress =
      sickAvailable > 0 ? (sickTaken / sickAvailable) * 100 : 0;

   const formatToTwoDecimals = (value) => {
      if (!value) return 0;

      return Math.trunc(value * 100) / 100;
   };

   return (
      <div className="max-w-xl mx-auto">
         <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 bg-white h-full space-y-4">
            {/* USER NAME */}
            <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
               {data?.name || 'User Name'}
            </div>
            {data?.employmentType !== 'Casual' &&
               data?.employmentType !== 'Contractor' && (
                  <div className="space-y-4">
                     {/* ANNUAL LEAVE */}
                     <div
                        className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 cursor-pointer"
                        onClick={() => navigate('/work/leave-request/annual')}
                     >
                        <div className="flex items-center gap-2 mb-3">
                           <Clock className="text-blue-600 w-5 h-5" />
                           <span className="text-[16px] font-bold text-blue-600">
                              Annual Leave
                           </span>
                        </div>

                        <div className="text-[14px] text-gray-500 mb-3">
                           Remaining Balance
                        </div>

                        <CustomProgressBarLeave
                           progress={annualProgress}
                           color="#1B75BB"
                           usedLabel={`Used: ${formatToTwoDecimals(annualTaken)}h`}
                           totalLabel={`Total: ${formatToTwoDecimals(annualAvailable)}h`}
                        />
                     </div>

                     {/* SICK / PERSONAL LEAVE */}
                     <div
                        className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 cursor-pointer"
                        onClick={() => navigate('/work/leave-request/sick')}
                     >
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
                           progress={sickProgress}
                           color="#FF5C00"
                           usedLabel={`Used: ${formatToTwoDecimals(sickTaken)} h`}
                           totalLabel={`Total: ${formatToTwoDecimals(sickAvailable)} h`}
                        />
                     </div>
                  </div>
               )}
            {/* NAVIGATION - ANNUAL */}
            {/* <div
               className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-8 flex items-center justify-between cursor-pointer"
               onClick={() => navigate('/work/leave-request/annual')}
            >
               <div className="w-10 h-10 rounded flex items-center justify-center bg-[#C7DFFF]">
                  <Plane className="w-6 h-6 text-[#3086F3]" />
               </div>

               <p className="text-[18px] font-bold text-[#3086F3]">
                  Annual Leave
               </p>
            </div> */}

            {/* NAVIGATION - SICK */}
            {/* <div className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-8 flex items-center justify-between cursor-pointer">
               <div className="w-10 h-10 rounded flex items-center justify-center bg-[#FFC6A6]">
                  <Radio className="w-6 h-6 text-[#FF5C00]" />
               </div>

               <p className="text-[18px] font-bold text-[#FF5C00]">
                  Sick or Personal Leave
               </p>
            </div> */}

            {/* NAVIGATION - unpaid */}
            <div
               className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-8 flex items-center justify-between cursor-pointer"
               onClick={() => navigate('/work/leave-request/unpaid')}
            >
               <div className="w-10 h-10 rounded flex items-center justify-center bg-[#C7DFFF]">
                  <Plane className="w-6 h-6 text-[#3086F3]" />
               </div>

               <p className="text-[18px] font-bold text-[#3086F3]">
                  Unpaid Leave
               </p>
            </div>
         </div>
      </div>
   );
};

export default LeaveRequestPage;
