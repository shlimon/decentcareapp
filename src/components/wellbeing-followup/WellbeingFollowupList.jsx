import { useAuth } from '@context/auth';
import useGetMyWellbeingFollowupNotes from '@hooks/wellbeings/useGetMyWellbeingFollowupNotes';
import { formatDate } from '@utils/DateFormation';
import React from 'react';
import { useNavigate } from 'react-router';
import StatusBadgeForWellbeing from './StatusBadgeForWellbeing';

function WellbeingFollowupList() {
   const navigate = useNavigate();

   const { userData } = useAuth();
   const user = userData?.user;

   const { data, isLoading, isError } = useGetMyWellbeingFollowupNotes(
      user?._id
   );

   const handleClick = (item) => {
      navigate(`/work/my-wellbeing-notes/${user?._id}/details/${item._id}`);
   };

   return (
      <>
         <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 h-full space-y-4">
            <p className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
               My Current wellbeings
            </p>

            {isLoading && <p className="text-gray-500">Loading notes...</p>}

            {isError && (
               <p className="text-red-500">
                  Failed to load notes. Please try again.
               </p>
            )}

            {!isLoading && !isError && (!data || data.length === 0) && (
               <p className="text-gray-500 italic">
                  No follow-up notes available.
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
                                 {formatDate(item.checkInDate) || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                 Assessor: <span className="font-medium">{item.assessor || "N/A"}</span>
                              </p>
                           </div>

                           {/* Right Section */}
                           <div className="flex flex-col items-end space-y-3">

                              {/* Status */}
                              <StatusBadgeForWellbeing status={item.status} />

                              {/* Follow-up Tasks */}
                              <div className="text-right">
                                 <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Follow-up Tasks
                                 </p>
                                 <p className="text-sm font-semibold text-gray-800">
                                    {item.followupActions?.complete ?? 0} / {item.followupActions?.total ?? 0}
                                 </p>
                              </div>

                           </div>
                        </div>
                     </div>

                  ))}
            </div>
         </div>
      </>
   );
}

export default WellbeingFollowupList;
