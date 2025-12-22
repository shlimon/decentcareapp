import { formatDate } from '@utils/DateFormation';
import React, { memo } from 'react';

const ConflictOfInterestShow = ({ conflict }) => {
   if (!conflict) {
      return (
         <div className="p-6 text-center text-gray-500">
            No conflict data available
         </div>
      );
   }

   return (
      <div className="max-h-[75vh] overflow-y-auto">
         {/* Header Section */}
         <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
               <span className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full">
                  {conflict.conflictNumber}
               </span>
               <span
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                     conflict.status === 'Not started'
                        ? 'bg-yellow-200 text-yellow-800'
                        : conflict.status === 'In Progress'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-green-200 text-green-800'
                  }`}
               >
                  {conflict.status}
               </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
               {conflict.conflictType}
            </h2>
            {conflict.priorConflicts > 0 && (
               <p className="text-orange-600 font-medium">
                  ⚠️ {conflict.priorConflicts} Prior Conflict(s) Reported
               </p>
            )}
         </div>

         <div className="p-6 space-y-6">
            {/* Conflict Raiser Section */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
               <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Raised By
               </h3>
               <div className="space-y-2">
                  <p className="text-gray-700">
                     <span className="font-semibold">Name:</span>{' '}
                     {conflict.conflictRaiser.name}
                  </p>
                  <p className="text-gray-700">
                     <span className="font-semibold">Email:</span>{' '}
                     {conflict.conflictRaiser.email}
                  </p>
                  <p className="text-gray-700">
                     <span className="font-semibold">Department:</span>{' '}
                     {conflict.conflictRaiser.department}
                  </p>
               </div>
            </div>

            {/* Description Section */}
            <div>
               <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Description
               </h3>
               <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {conflict.description}
               </p>
            </div>

            {/* Involvement Section */}
            <div>
               <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Involvement
               </h3>
               <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {conflict.involvement}
               </p>
            </div>

            {/* Timing and Dates Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-purple-600 font-semibold mb-1">
                     Timing
                  </p>
                  <p className="text-gray-800 font-bold capitalize">
                     {conflict.timing}
                  </p>
               </div>
               <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-purple-600 font-semibold mb-1">
                     Occurrence Date
                  </p>
                  <p className="text-gray-800 font-bold">
                     {formatDate(conflict.occurDate)}
                  </p>
               </div>
            </div>

            {/* Staff Relations Section */}
            {conflict.staffRelations && conflict.staffRelations.length > 0 && (
               <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                     Staff Relations ({conflict.staffRelations.length})
                  </h3>
                  <div className="space-y-3">
                     {conflict.staffRelations.map((staff, index) => (
                        <div
                           key={staff._id}
                           className="bg-green-50 rounded-lg p-4 border border-green-200"
                        >
                           <p className="font-semibold text-gray-800 mb-2">
                              Staff Member {index + 1}
                           </p>
                           <div className="space-y-1 text-sm">
                              <p className="text-gray-700">
                                 <span className="font-semibold">Name:</span>{' '}
                                 {staff.name}
                              </p>
                              <p className="text-gray-700">
                                 <span className="font-semibold">Email:</span>{' '}
                                 {staff.email}
                              </p>
                              <p className="text-gray-700">
                                 <span className="font-semibold">
                                    Department:
                                 </span>{' '}
                                 {staff.department}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Staff Participants Section */}
            {conflict.staffParticipants &&
               conflict.staffParticipants.length > 0 && (
                  <div>
                     <h3 className="text-lg font-bold text-gray-800 mb-3">
                        Staff Participants ({conflict.staffParticipants.length})
                     </h3>
                     <div className="space-y-3">
                        {conflict.staffParticipants.map(
                           (participant, index) => (
                              <div
                                 key={participant._id}
                                 className="bg-indigo-50 rounded-lg p-4 border border-indigo-200"
                              >
                                 <p className="font-semibold text-gray-800 mb-2">
                                    Participant {index + 1}
                                 </p>
                                 <div className="space-y-1 text-sm">
                                    <p className="text-gray-700">
                                       <span className="font-semibold">
                                          Name:
                                       </span>{' '}
                                       {participant.name}
                                    </p>
                                    <p className="text-gray-700">
                                       <span className="font-semibold">
                                          Email:
                                       </span>{' '}
                                       {participant.email}
                                    </p>
                                    {participant.department &&
                                       participant.department.length > 0 && (
                                          <div className="mt-2">
                                             <p className="font-semibold text-gray-700 mb-1">
                                                Departments:
                                             </p>
                                             {participant.department.map(
                                                (dept) => (
                                                   <div
                                                      key={dept._id}
                                                      className="ml-4 text-gray-600"
                                                   >
                                                      • {dept.departmentName} (
                                                      {dept.community})
                                                   </div>
                                                )
                                             )}
                                          </div>
                                       )}
                                 </div>
                              </div>
                           )
                        )}
                     </div>
                  </div>
               )}

            {/* Follow-up Action */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
               <p className="text-sm font-semibold text-yellow-800 mb-1">
                  Follow-up Action Required
               </p>
               <p className="text-gray-800 font-bold">
                  {conflict.followupAction ? 'Yes' : 'No'}
               </p>
            </div>

            {/* Reviewed By */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
               <p className="text-sm font-semibold text-gray-600 mb-1">
                  Reviewed By
               </p>
               <p className="text-gray-800 font-medium">
                  {conflict.reviewedBy || 'Not yet reviewed'}
               </p>
            </div>

            {/* Investigation Actions */}
            {conflict.investigationActions &&
               conflict.investigationActions.length > 0 && (
                  <div>
                     <h3 className="text-lg font-bold text-gray-800 mb-3">
                        Investigation Actions
                     </h3>
                     <div className="space-y-2">
                        {conflict.investigationActions.map((action, index) => (
                           <div
                              key={index}
                              className="bg-red-50 rounded-lg p-4 border border-red-200"
                           >
                              <p className="text-gray-700">{action}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
               <div>
                  <p className="text-sm text-gray-500 mb-1">Created At</p>
                  <p className="text-gray-800 font-semibold">
                     {formatDate(conflict.createdAt)}
                  </p>
               </div>
               <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="text-gray-800 font-semibold">
                     {formatDate(conflict.updatedAt)}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default memo(ConflictOfInterestShow);
