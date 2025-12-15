import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetSingleWellbeingFollowupNotes from '@hooks/wellbeings/useGetSingleWellbeingFollowupNotes';
import useUpdateWellbeingFollowupNotes from '@hooks/wellbeings/useUpdateWellbeingFollowupNotes';
import React, { memo, useEffect, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import StatusBadgeForWellbeing from './StatusBadgeForWellbeing';

const WellbeingFollowupListDetails = () => {
   const { id, followUpId } = useParams();

   const { data, isLoading, isError } = useGetSingleWellbeingFollowupNotes(
      id,
      followUpId
   );

   const [showModal, setShowModal] = useState(false);
   const [followupNote, setFollowupNote] = useState(null);

   const {
      mutateAsync,
      isPending: updatePending,
      isSuccess: updateSuccess,
   } = useUpdateWellbeingFollowupNotes();

   // init hook form
   const {
      handleSubmit,
      control,
      reset,
      formState: { errors },
   } = useForm({
      defaultValues: {
         note: '',
      },
   });

   // when clicked open modal and load data
   const handleClick = (question) => {
      setFollowupNote(question);
      setShowModal(true);
      reset({ note: question.note || '' });
   };

   // handle submit form
   const onSubmit = (formData) => {
      const payload = {
         followupId: followupNote._id,
         note: formData.note,
      };

      mutateAsync({
         staffId: id,
         payload,
      });
   };

   useEffect(() => {
      if (updateSuccess) {
         setShowModal(false);
         reset();
      }
   }, [updateSuccess, reset]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-gray-600">Loading...</div>
         </div>
      );
   }

   if (isError || !data) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-red-600">Error loading data</div>
         </div>
      );
   }

   const questionFields = [
      { key: 'aboutLastSupervision', label: 'About Last Supervision' },
      { key: 'challengesExperience', label: 'Challenges Experience' },
      { key: 'challengesOnWorking', label: 'Challenges On Working' },
      {
         key: 'challengesWithStaffOversee',
         label: 'Challenges With Staff Oversee',
      },
      { key: 'currentRoleFinding', label: 'Current Role Finding' },
      {
         key: 'effectivityAndRequiredDocOnTime',
         label: 'Effectivity And Required Doc On Time',
      },
   ];

   return (
      <>
         <div className="w-full max-w-[900px] mx-auto font-montserrat p-6 space-y-6">
            {/* Follow-up Questions Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">
                     Previous Meetings Follow-up Questions
                  </h2>
               </div>
               <div className="p-6 space-y-3">
                  {data.previousMeetingsFollowupQuestions &&
                  data.previousMeetingsFollowupQuestions.length > 0 ? (
                     data.previousMeetingsFollowupQuestions.map((question) => (
                        <div
                           key={question._id}
                           onClick={() => handleClick(question)}
                           className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                        >
                           <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-gray-800 text-lg">
                                 {question.title || 'N/A'}
                              </p>
                              <StatusBadgeForWellbeing
                                 status={question.status}
                              />
                           </div>
                           {question.note && (
                              <p className="text-gray-600 text-sm mt-2 pl-2 border-l-2 border-blue-400">
                                 {question.note}
                              </p>
                           )}
                        </div>
                     ))
                  ) : (
                     <p className="text-gray-500 text-center py-4">
                        No previous meetings follow-up questions available.
                     </p>
                  )}
               </div>
            </div>

            {/* Question Discussion Sections */}
            <div className="space-y-4">
               {questionFields.map((field) => (
                  <div
                     key={field.key}
                     className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                     <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                           {field.label}
                        </h3>
                     </div>
                     <div className="p-6">
                        <p className="text-gray-700 leading-relaxed">
                           {data[field.key] || 'No information provided'}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Modal */}
         {followupNote && (
            <ModalWithContent
               title={followupNote.title || 'Edit Note'}
               isOpen={showModal}
               setIsOpen={setShowModal}
               maxWidth="max-w-md"
               content={
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                     <Controller
                        name="note"
                        control={control}
                        rules={{
                           required: 'Note is required',
                           minLength: {
                              value: 3,
                              message: 'Note must be at least 3 characters',
                           },
                        }}
                        render={({ field }) => (
                           <Textarea
                              {...field}
                              label="Enter your note"
                              placeholder="Enter your updated note"
                              error={errors.note?.message}
                              required
                           />
                        )}
                     />
                     {errors.note && (
                        <p className="text-red-500 text-sm mt-1">
                           {errors.note.message}
                        </p>
                     )}

                     <button
                        type="submit"
                        disabled={updatePending}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
                     >
                        {updatePending ? 'Saving Note...' : 'Save Note'}
                     </button>
                  </form>
               }
            />
         )}
      </>
   );
};

export default memo(WellbeingFollowupListDetails);
