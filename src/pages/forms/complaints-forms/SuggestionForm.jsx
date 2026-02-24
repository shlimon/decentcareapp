import axiosInstance from '@api/axiosInstance';
import { Checkbox, Text, Textarea } from '@components/reusable/FormInputs';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';
import CommonFieldForm from './CommonFieldForm';

const SuggestionForm = () => {
   const location = useLocation();
   const navigate = useNavigate();

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
         type: 'suggestions',
         haveConsent: '',
         reporterAnonymous: '',
         participantAnonymous: '',
         contactTime: [],
         contactMethod: [],

         relatedArea: [],
         otherRelatedArea: '',
         suggestion: '',
         improvement: '',
      },
   });

   const {
      handleSubmit,
      control,
      watch,
      formState: { errors, isSubmitting },
   } = methods;

   const reporterAnonymous = watch('reporterAnonymous');

   // Always an array ✅
   const selectedRelatedAreas = watch('relatedArea') || [];

   const onSubmit = async (data) => {
      try {
         const payload = {
            type: data.type,
            haveConsent: data.haveConsent === 'yes',
            // Add participant and departmentName from CommonFieldForm
            participant,
            departmentName,
            anonymous: data.participantAnonymous === 'yes',
            reporterAnonymous: data.reporterAnonymous,

            // Contact information
            contact: {
               time: Array.isArray(data.contactTime)
                  ? data.contactTime
                  : [data.contactTime],
               method: Array.isArray(data.contactMethod)
                  ? data.contactMethod
                  : [data.contactMethod],
            },

            // SuggestionsSchema fields matching schema
            relatedArea: Array.isArray(data.relatedArea)
               ? data.relatedArea.includes('Others') && data.otherRelatedArea
                  ? data.relatedArea
                       .filter((area) => area !== 'Others')
                       .concat(data.otherRelatedArea)
                  : data.relatedArea
               : [data.relatedArea],
            suggestion: data.suggestion,
            improvement: data.improvement || undefined, // Optional field
         };

         const response = await axiosInstance.post(`/complaints`, payload);
         if (response?.data?.success) {
            toast.success('Suggestion Submitted Successfully');
            navigate('/forms/complaint');
         }
      } catch (error) {
         toast.error('Submission Failed');
         console.error('Error submitting suggestion:', error);
      }
   };

   const relatedAreaOptions = [
      { value: 'Service delivery', label: 'Service delivery' },
      { value: 'Communication', label: 'Communication' },
      { value: 'Scheduling/rostering', label: 'Scheduling/rostering' },
      { value: 'Technology/Apps', label: 'Technology/Apps' },
      { value: 'Documentation', label: 'Documentation' },
      { value: 'Staff training', label: 'Staff training' },
      { value: 'Facilities/Equipment', label: 'Facilities/Equipment' },
      { value: 'Policies/Procedures', label: 'Policies/Procedures' },
      { value: 'Events', label: 'Events' },
      { value: 'Others', label: 'Others' },
   ];

   return (
      <div className="">
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                  Suggestion
               </h2>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <CommonFieldForm />
                  {/* Related Area */}

                  {reporterAnonymous === 'fully-anonymous' && (
                     <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-start">
                           Do you want to remain anonymous?
                        </h2>
                        <h5 className="text-gray-700 mb-2">
                           Anonymous Suggestion:{' '}
                        </h5>
                        <ul className="list-disc text-gray-700 mb-6 pl-6">
                           <li>
                              We can investigate anonymous
                              compliment/suggestion/compliment, but we may not
                              be able to update you on progress.
                           </li>
                           <li>
                              We recommend providing at least a way to contact
                              you, which we will keep confidential.
                           </li>
                           <li>
                              If your complaint involves serious safety
                              concerns, we may still need to take actions even
                              if anonymous.
                           </li>
                        </ul>
                     </div>
                  )}

                  <Controller
                     name="relatedArea"
                     control={control}
                     rules={{
                        required: 'Please select at least one related area',
                     }}
                     render={({ field, fieldState: { error } }) => (
                        <Checkbox
                           {...field}
                           multiselect
                           title="What area does this relate to?"
                           options={relatedAreaOptions}
                           error={error?.message}
                           required
                           isOptionsAreVertical={true}
                        />
                     )}
                  />

                  {/* Show "Others" text input only when selected */}
                  {selectedRelatedAreas.includes('Others') && (
                     <Controller
                        name="otherRelatedArea"
                        control={control}
                        rules={{ required: 'Please specify the others area' }}
                        render={({ field }) => (
                           <Text
                              {...field}
                              label="Others: Please specify"
                              placeholder="Enter others related area"
                              error={errors.otherRelatedArea?.message}
                              required
                           />
                        )}
                     />
                  )}

                  {/* Suggestion */}
                  <Controller
                     name="suggestion"
                     control={control}
                     rules={{ required: 'Please enter your suggestion' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="What is your suggestion?"
                           placeholder="Enter your suggestion here"
                           error={errors.suggestion?.message}
                           required
                        />
                     )}
                  />

                  {/* Improvement */}
                  <Controller
                     name="improvement"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="How would this improvement help you?"
                           placeholder="Enter your thoughts here (optional)"
                           error={errors.improvement?.message}
                        />
                     )}
                  />

                  {/* Submit */}
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                     {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                  </button>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default SuggestionForm;
