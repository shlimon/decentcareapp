import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetAllMyConflicts from '@hooks/useGetAllMyConflicts';
import { formatDate } from '@utils/DateFormation';
import React, { useState } from 'react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import ConflictOfInterestShow from './ConflictOfInterestShow';

const ConflictOfInterestPage = () => {
   const navigate = useNavigate();
   const { data: conflitsData, isLoading: isLoadingConflicts } =
      useGetAllMyConflicts();
   const [showModal, setShowModal] = useState(false);
   const [selectedConflict, setSelectedConflict] = useState(null);

   console.log('Conflicts of Interest Data:', conflitsData);

   const handleConflictClick = (conflict) => {
      setSelectedConflict(conflict);
      setShowModal(true);
   };

   return (
      <div className="min-h-screen max-w-2xl mx-auto bg-white py-8 px-4">
         <div className=" ">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
               <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                     Conflicts of Interest
                  </h2>

                  <button
                     onClick={() => {
                        navigate('/forms/conflict-of-interest/form');
                     }}
                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                     <FaRegPlusSquare className="text-lg" />
                     <span className="font-medium">Create New Conflict</span>
                  </button>
               </div>
            </div>

            {/* Content Section */}
            {isLoadingConflicts ? (
               <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
                  <p className="text-gray-600 text-lg">
                     Loading conflicts of interest...
                  </p>
               </div>
            ) : conflitsData && conflitsData.length > 0 ? (
               <div className="grid gap-4">
                  {conflitsData.map((conflict) => (
                     <div
                        key={conflict._id}
                        onClick={() => handleConflictClick(conflict)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 overflow-hidden group"
                     >
                        <div className="p-6">
                           {/* Header Row */}
                           <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                                       {conflict.conflictNumber}
                                    </span>
                                    <span
                                       className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                                          conflict.status === 'Not started'
                                             ? 'bg-yellow-100 text-yellow-700'
                                             : conflict.status === 'In Progress'
                                             ? 'bg-blue-100 text-blue-700'
                                             : 'bg-green-100 text-green-700'
                                       }`}
                                    >
                                       {conflict.status}
                                    </span>
                                 </div>
                                 <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {conflict.conflictType}
                                 </h3>
                              </div>
                           </div>

                           {/* Info Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                              <div>
                                 <p className="text-sm text-gray-500 mb-1">
                                    Occurrence Date
                                 </p>
                                 <p className="text-sm font-semibold text-gray-800">
                                    {formatDate(conflict.occurDate)}
                                 </p>
                              </div>
                              <div>
                                 <p className="text-sm text-gray-500 mb-1">
                                    Date Reported
                                 </p>
                                 <p className="text-sm font-semibold text-gray-800">
                                    {formatDate(conflict.createdAt)}
                                 </p>
                              </div>
                           </div>

                           {/* Quick Stats */}
                           <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
                              {conflict.staffRelations.length > 0 && (
                                 <span className="text-gray-600">
                                    <strong className="text-gray-800">
                                       {conflict.staffRelations.length}
                                    </strong>{' '}
                                    Staff Relations
                                 </span>
                              )}
                              {conflict.staffParticipants.length > 0 && (
                                 <span className="text-gray-600">
                                    <strong className="text-gray-800">
                                       {conflict.staffParticipants.length}
                                    </strong>{' '}
                                    Participants
                                 </span>
                              )}
                              {conflict.priorConflicts > 0 && (
                                 <span className="text-orange-600">
                                    <strong>{conflict.priorConflicts}</strong>{' '}
                                    Prior Conflicts
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="max-w-md mx-auto">
                     <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaRegPlusSquare className="text-4xl text-gray-400" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No Conflicts Found
                     </h3>
                     <p className="text-gray-600 mb-6">
                        You haven't created any conflict of interest
                        declarations yet.
                     </p>
                     <button
                        onClick={() => {
                           navigate('/forms/conflict-of-interest/form');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                     >
                        <FaRegPlusSquare />
                        <span>Create Your First Conflict</span>
                     </button>
                  </div>
               </div>
            )}
         </div>

         <ModalWithContent
            title="Conflict of Interest Details"
            isOpen={showModal}
            setIsOpen={setShowModal}
            maxWidth="max-w-2xl"
            padding={false}
            content={
               selectedConflict && (
                  <ConflictOfInterestShow conflict={selectedConflict} />
               )
            }
         />
      </div>
   );
};

export default ConflictOfInterestPage;
