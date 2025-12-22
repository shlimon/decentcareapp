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

   console.log('Conflicts of Interest Data:', conflitsData);
   return (
      <div className="py-8 px-4 max-w-xl mx-auto bg-white">
         {/* ConflictOfInterestForm will be on button if button clicked than navigate to /conflict-of-interest/form */}
         <button
            onClick={() => {
               navigate('/forms/conflict-of-interest/form');
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
         >
            <div className="flex items-center gap-2">
               <FaRegPlusSquare />

               <span> Create a New Conflict of Interest</span>
            </div>
         </button>
         <h2 className="text-xl font-bold text-gray-700 border-b pb-2">
            Conflict of Interests
         </h2>
         {isLoadingConflicts ? (
            <p className="text-gray-500 mt-4">
               Loading conflicts of interest...
            </p>
         ) : conflitsData && conflitsData.length > 0 ? (
            <div>
               {conflitsData.map((conflict) => (
                  <div
                     key={conflict._id}
                     className="w-full   p-2 rounded-2xl bg-[#EAFFF5] border-green-200  border border-gray-300 cursor-pointer hover:shadow-md transition-shadow"
                     // if clicked modal open with conflict details
                     onClick={() => {
                        setShowModal(true);
                     }}
                  >
                     <p className="text-gray-800">
                        <span className="font-semibold">Conflict Type:</span>{' '}
                        {conflict.conflictType}
                     </p>
                     <p className="text-gray-800">
                        <span className="font-semibold">Description:</span>{' '}
                        {conflict.description}
                     </p>
                     <p className="text-gray-800">
                        <span className="font-semibold">Occur Date:</span>{' '}
                        {formatDate(conflict.occurDate)}
                     </p>
                     <p className="text-gray-800">
                        <span className="font-semibold">Date Reported:</span>{' '}
                        {formatDate(conflict.createdAt)}
                     </p>
                  </div>
               ))}
            </div>
         ) : (
            <p className="text-gray-500 mt-4">
               No conflicts of interest found.
            </p>
         )}

         <ModalWithContent
            title={'Conflict Details'}
            isOpen={showModal}
            setIsOpen={setShowModal}
            maxWidth="max-w-md"
            content={
               <div>
                  <ConflictOfInterestShow />
               </div>
            }
         />
      </div>
   );
};

export default ConflictOfInterestPage;
