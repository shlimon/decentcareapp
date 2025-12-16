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
               My current wellbeings
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
      </>
   );
}

export default WellbeingFollowupList;
