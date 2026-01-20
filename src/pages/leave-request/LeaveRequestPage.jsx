import { Clock, Plane, Radio } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import CustomProgressBarLeave from './CustomProgressBarLeave';

const LeaveRequestPage = () => {
   const navigate = useNavigate();

   const data = {
      usedHours: 64,
      totalHours: 160,
   };

   const probationProgress = (data.usedHours / data.totalHours) * 100;

   return (
      <div className="max-w-xl mx-auto">
         <div className="w-full max-w-[800px] rounded-xl  font-montserrat p-6 bg-white h-full space-y-4">
            <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
               {JSON.parse(localStorage.getItem('user_data'))?.user?.name ||
                  'User Name'}
            </div>

            {/* Progress bar */}
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
                  usedLabel={`Used: ${data.usedHours}h`}
                  totalLabel={`Total: ${data.totalHours}h`}
               />
            </div>

            {/* div navigate */}

            <div>
               {/* mouse pointer show on css */}
               <div
                  className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex items-center justify-between cursor-pointer "
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
                  className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex items-center justify-between cursor-pointer"
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
