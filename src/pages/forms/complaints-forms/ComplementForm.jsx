import axiosInstance from '@api/axiosInstance';
import {
   DateSelection,
   Radio,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router';
import CommonFieldForm from './CommonFieldForm';

const ComplementForm = ({ type }) => {
   const location = useLocation();

   const [participant, setParticipant] = useState('');
   const [departmentName, setDepartmentName] = useState('');

   useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const participantParam = queryParams.get('participant');
      const departmentParam = queryParams.get('department');

      if (participantParam) setParticipant(participantParam);
      if (departmentParam)
         setDepartmentName(decodeURIComponent(departmentParam));
   }, [location.search]);

   const methods = useForm({
      defaultValues: {
         type: 'feedback',
         haveConsent: '',
         reporterAnonymous: '',
         participantAnonymous: '',
         contactTime: [],
         contactMethod: '',

         feedback: '',
         happenTime: '',
         recogniseStaff: '',
         staff: '',
         shareFeedback: '',
         publicity: '',
      },
   });

   const {
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
   } = methods;

   const onSubmit = async (data) => {
      try {
         const payload = {
            type: data.type,
            haveConsent: data.haveConsent === 'yes',
            // Add participant and departmentName from CommonFieldForm
            participant,
            departmentName,
            anonymous: data.participantAnonymous === 'yes',

            // Contact information
            contact: {
               time: Array.isArray(data.contactTime)
                  ? data.contactTime[0]
                  : data.contactTime,
               method: data.contactMethod,
            },

            // FeedbackSchema schema fields are show below
         };

         const response = await axiosInstance.post(`/complaints`, payload);
         if (response?.success) {
            toast.success('Concern Submitted Successfully');
         }
      } catch (error) {
         toast.error('Submission Failed');
         console.error('Error submitting concern:', error);
      }
   };

   return (
      <div>
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                  Compliment or positive feedback
               </h2>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <CommonFieldForm type={type} />
                  {/* Feedback */}
                  <Controller
                     name="feedback"
                     control={control}
                     rules={{ required: 'Please enter your feedback' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="What did we do well?"
                           placeholder="Share your positive experience here..."
                           error={errors.feedback?.message}
                           required
                        />
                     )}
                  />

                  {/* When did it happen */}
                  <Controller
                     name="happenTime"
                     control={control}
                     render={({ field }) => (
                        <DateSelection
                           {...field}
                           label="When did this happen?"
                           placeholder="Select date"
                           error={errors.happenTime?.message}
                        />
                     )}
                  />

                  {/* Recognized Staff Name */}

                  {/* Staff Relationship */}
                  <Controller
                     name="staff"
                     control={control}
                     render={({ field }) => (
                        <Text
                           {...field}
                           label="Should we recognise a staff (select staff)"
                           placeholder="Select staff member"
                           error={errors.staff?.message}
                        />
                     )}
                  />

                  {/* Share Feedback Privately or Directly */}
                  <Controller
                     name="shareFeedback"
                     control={control}
                     rules={{ required: 'Please choose an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Would you like us to share your feedback with the staff member?"
                           options={[
                              { value: 'Yes', label: 'Yes, please share' },
                              {
                                 value: 'No',
                                 label: 'No, keep it confidential',
                              },
                           ]}
                           error={errors.shareFeedback?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* Publicity Permission */}
                  <Controller
                     name="publicity"
                     control={control}
                     rules={{ required: 'Please choose an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Can we use your feedback publicly?"
                           options={[
                              { value: 'Yes', label: 'Yes, please share' },
                              {
                                 value: 'No',
                                 label: 'No, keep it confidential',
                              },
                           ]}
                           error={errors.publicity?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* Submit Button */}
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
                  >
                     {isSubmitting ? 'Submitting...' : 'Submit Compliment'}
                  </button>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default ComplementForm;
