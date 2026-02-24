import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetSingleWellbeingFollowupNotes from '@hooks/wellbeings/useGetSingleWellbeingFollowupNotes';
import useUpdateWellbeingFollowupNotes from '@hooks/wellbeings/useUpdateWellbeingFollowupNotes';
import React, { memo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useParams } from 'react-router';

const WellbeingFollowupListDetails = () => {
   const { id, followUpId } = useParams();

   const { data, isLoading, isError } = useGetSingleWellbeingFollowupNotes(
      id,
      followUpId,
   );

   const [showModal, setShowModal] = useState(false);
   const [followupNote, setFollowupNote] = useState(null);

   const {
      mutateAsync,
      isPending: updatePending,
      isSuccess: updateSuccess,
   } = useUpdateWellbeingFollowupNotes(id, followUpId);

   // init hook form
   const {
      handleSubmit,
      control,
      reset,
      formState: { errors, isSubmitting },
   } = useForm({
      defaultValues: {
         note: '',
      },
   });

   // when clicked open modal and load data
   const handleClick = (question) => {
      if (data.status !== 'Completed') {
         setFollowupNote(question);
         setShowModal(true);
         reset({ note: question.note || '' });
      }
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
            <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
               {/* Header */}
               <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800">
                     Follow-up Questions
                  </h2>
               </div>

               {/* Content */}
               <div className="px-4 py-6 space-y-4">
                  {data.previousMeetingsFollowupQuestions?.length > 0 ? (
                     data.previousMeetingsFollowupQuestions.map((question) => (
                        <div
                           key={question._id}
                           onClick={() => handleClick(question)}
                           className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-400"
                        >
                           {/* Top Row */}
                           <div className="space-y-1">
                              <p className="text-base font-medium text-gray-900">
                                 {question.title || 'N/A'}
                              </p>
                           </div>

                           {/* Note */}
                           {question.note && (
                              <div className="mt-3 border-l-4 border-blue-500 pl-3">
                                 <p className="text-sm text-gray-600 leading-relaxed">
                                    {question.note}
                                 </p>
                              </div>
                           )}
                        </div>
                     ))
                  ) : (
                     <div>
                        No previous meetings follow-up questions available.
                     </div>
                  )}
               </div>
            </div>

            {/* Question Discussion Sections */}
            <div className="space-y-6">
               {questionFields.map((field) => {
                  const value = data[field.key];

                  if (!value) return;

                  return (
                     <div
                        key={field.key}
                        className="bg-white rounded-xl border border-gray-300 overflow-hidden"
                     >
                        {/* Header */}
                        <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                           <p className="text-base font-semibold text-gray-800">
                              {field.label}
                           </p>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                           <p className="text-sm text-gray-700 text-center leading-relaxed">
                              {value}
                           </p>
                        </div>
                     </div>
                  );
               })}
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
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Enter your note{' '}
                           <span className="text-red-500">*</span>
                        </label>
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
                              <textarea
                                 {...field}
                                 placeholder="Enter your updated note"
                                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                    errors.note
                                       ? 'border-red-500'
                                       : 'border-gray-300'
                                 }`}
                                 rows={5}
                              />
                           )}
                        />
                        {errors.note && (
                           <p className="text-red-500 text-sm mt-1">
                              {errors.note.message}
                           </p>
                        )}
                     </div>

                     <button
                        type="submit"
                        disabled={updatePending || isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-semibold "
                     >
                        {updatePending || isSubmitting
                           ? 'Saving Note...'
                           : 'Save Note'}
                     </button>
                  </form>
               }
            />
         )}
      </>
   );
};

export default memo(WellbeingFollowupListDetails);
