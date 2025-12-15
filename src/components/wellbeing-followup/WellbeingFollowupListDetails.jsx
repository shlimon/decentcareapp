import useGetSingleWellbeingFollowupNotes from '@hooks/wellbeings/useGetSingleWellbeingFollowupNotes';
import useUpdateWellbeingFollowupNotes from '@hooks/wellbeings/useUpdateWellbeingFollowupNotes';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [updateSuccess]);

   console.log('Wellbeing Followup Details Data:', data);

   // this is response data
   // {
   //     "_id": "693af78cf4fd3a725baf6a65",
   //     "status": "Completed",
   //     "previousMeetingsFollowupQuestions": [
   //         {
   //             "title": "Stress Management",
   //             "status": "Completed",
   //             "note": "Check again and again test",
   //             "_id": "693af78cf4fd3a725baf6a67"
   //         },
   //         {
   //             "title": "Sleep Quality Review",
   //             "status": "Completed",
   //             "_id": "693af78cf4fd3a725baf6a68"
   //         },
   //         {
   //             "title": "Nutrition Awareness",
   //             "status": "Completed",
   //             "_id": "693af78cf4fd3a725baf6a69"
   //         },
   //         {
   //             "title": "Physical Activity",
   //             "status": "Completed",
   //             "_id": "693af78cf4fd3a725baf6a6a"
   //         }
   //     ],
   //     "aboutLastSupervision": "Test",
   //     "challengesExperience": "Test",
   //     "challengesOnWorking": null,
   //     "challengesWithStaffOversee": null,
   //     "currentRoleFinding": "Test",
   //     "effectivityAndRequiredDocOnTime": "Test"
   // }

   return (
      <>
         <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 h-full space-y-4">
            <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
               {data.previousMeetingsFollowupQuestions &&
               data.previousMeetingsFollowupQuestions.length > 0 ? (
                  data.previousMeetingsFollowupQuestions.map((question) => (
                     <div
                        key={question._id}
                        className="mb-4"
                        onClick={() => handleClick(question)}
                     >
                        <p className="font-semibold text-gray-800">
                           {question.title || 'N/A'}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                           Status: {question.status || 'N/A'}
                        </p>
                        {question.note && (
                           <p className="text-gray-600 text-sm mt-1">
                              {question.note}
                           </p>
                        )}
                     </div>
                  ))
               ) : (
                  <p>No previous meetings follow-up questions available.</p>
               )}
            </div>
            {/* show aboutLastSupervision, challengesExperience, challengesOnWorking, challengesWithStaffOversee, currentRoleFinding, effectivityAndRequiredDocOnTime */}
            <div>
               <div className="border bg-gray-50 border-gray-300 p-4 rounded-lg mb-4">
                  {data.aboutLastSupervision}
               </div>
               <div className="border bg-gray-50 border-gray-300 p-4 rounded-lg mb-4">
                  {data.challengesExperience}
               </div>
               <div className="border bg-gray-50 border-gray-300 p-4 rounded-lg mb-4">
                  {data.challengesOnWorking}
               </div>
               <div className="border bg-gray-50 border-gray-300 p-4 rounded-lg mb-4">
                  {data.challengesWithStaffOversee}
               </div>
               <div className="border bg-gray-50 border-gray-300 p-4 rounded-lg mb-4">
                  {data.currentRoleFinding}
               </div>
               <div className="border bg-gray-50 border-gray-300 p-4 rounded-lg mb-4">
                  {data.effectivityAndRequiredDocOnTime}
               </div>
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
                  <form onSubmit={handleSubmit(onSubmit)}>
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
                              error={errors.description?.message}
                              required
                           />
                        )}
                     />
                     {errors.note && (
                        <p className="text-red-500 text-sm">
                           {errors.note.message}
                        </p>
                     )}

                     <button
                        type="submit"
                        disabled={updatePending}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                     >
                        {updatePending ? 'Saving Note' : 'Save Note'}
                     </button>
                  </form>
               }
            />
         )}
      </>
   );
};

export default memo(WellbeingFollowupListDetails);
