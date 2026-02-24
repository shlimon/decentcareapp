import axiosInstance from '@api/axiosInstance';
import toast from 'react-hot-toast';

import {
   Checkbox,
   DateSelection,
   Radio,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import CommonFieldForm from './CommonFieldForm';

const ConcernForm = () => {
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
         type: 'concerns',
         haveConsent: '',
         reporterAnonymous: '',
         participantAnonymous: '',
         contactTime: [],
         contactMethod: [],
         concern: '',
         concernType: [],
         firstNotice: '',
         happeningArea: '',
         affection: '',
         helpingAddressConcern: '',
         urgency: '',
      },
   });

   const {
      handleSubmit,
      control,
      watch,
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
               method: Array.isArray(data.contactMethod)
                  ? data.contactMethod
                  : [data.contactMethod],
            },

            // Concern fields payload matching schema
            concernType:
               data.concernType.includes('Others') && data.otherConcernType
                  ? data.concernType
                       .filter((type) => type !== 'Others')
                       .concat(data.otherConcernType)
                  : data.concernType, // Keep as array to match schema type [String]
            concern: data.concern,
            firstNotice: data.firstNotice, // Keep as string to match schema
            happeningArea: data.happeningArea,
            affection: data.affection,
            helpingAddressConcern: data.helpingAddressConcern,
            urgency: data.urgency, // Send as string to match schema
         };

         const response = await axiosInstance.post(`/complaints`, payload);

         if (response?.data?.success) {
            toast.success('Concern Submitted Successfully');
            navigate('/forms/complaint');
         }
      } catch (error) {
         toast.error('Submission Failed');
         console.error('Error submitting concern:', error);
      }
   };

   // watch concernType to see selected values
   const selectedConcernTypes = watch('concernType');

   const concernTypeOptions = [
      { value: 'Service quality', label: 'Service quality' },
      { value: 'Communication issue', label: 'Communication issue' },
      {
         value: 'Staff well-being/behavior',
         label: 'Staff well-being/behavior',
      },
      { value: 'Safety (minor)', label: 'Safety (minor)' },
      { value: 'Schedule/reliability', label: 'Schedule/reliability' },
      {
         value: 'Relationship with support worker',
         label: 'Relationship with support worker',
      },
      { value: 'Cost/billing query', label: 'Cost/billing query' },
      { value: 'Future planning', label: 'Future planning' },
      { value: 'Others', label: 'Others' },
   ];

   return (
      <div className="">
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                  Concern
               </h2>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <CommonFieldForm />
                  <Controller
                     name="concernType"
                     control={control}
                     render={({ field, fieldState: { error } }) => (
                        <Checkbox
                           {...field}
                           multiselect={true}
                           title="What type of concern is this?"
                           options={concernTypeOptions}
                           error={error?.message}
                           required
                           isOptionsAreVertical={true}
                        />
                     )}
                  />
                  {selectedConcernTypes.includes('Others') && (
                     <Controller
                        name="otherConcernType"
                        control={control}
                        render={({ field }) => (
                           <Text
                              label="Others: Please specify"
                              placeholder="Enter others concern type"
                              {...field}
                              error={errors.otherConcernType?.message}
                           />
                        )}
                     />
                  )}
                  <Controller
                     name="concern"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           label="What is your concern?"
                           placeholder="Enter your concern here"
                           {...field}
                           error={errors.concern?.message}
                        />
                     )}
                  />
                  <Controller
                     name="firstNotice"
                     control={control}
                     render={({ field }) => (
                        <DateSelection
                           {...field}
                           label="When did you first notice this?"
                           placeholder="Select date"
                           error={errors.firstNotice?.message}
                           maxDate={new Date().toISOString()}
                        />
                     )}
                  />
                  <Controller
                     name="happeningArea"
                     control={control}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="How often has this happened?"
                           options={[
                              { value: 'First time', label: 'First time' },
                              {
                                 value: 'Happened a few times',
                                 label: 'Happened a few times',
                              },
                              {
                                 value: 'Ongoing issue',
                                 label: 'Ongoing issue',
                              },
                           ]}
                           error={errors.happeningArea?.message}
                           isOptionsAreVertical={true}
                        />
                     )}
                  />

                  <Controller
                     name="affection"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           label="How is this affecting you?"
                           placeholder="Enter details here"
                           {...field}
                           error={errors.affection?.message}
                        />
                     )}
                  />
                  <Controller
                     name="helpingAddressConcern"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           label="What would help address this concern?"
                           placeholder="Enter details here"
                           {...field}
                           error={errors.helpingAddressConcern?.message}
                        />
                     )}
                  />

                  <Controller
                     name="urgency"
                     control={control}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="How urgent is this?"
                           options={[
                              {
                                 value: 'Not urgent, just wanted to mention',
                                 label: 'Not urgent, just wanted to mention',
                              },
                              {
                                 value: 'Would like addressed soon',
                                 label: 'Would like addressed soon',
                              },
                              { value: 'Quite urgent', label: 'Quite urgent' },
                           ]}
                           error={errors.urgency?.message}
                           isOptionsAreVertical={true}
                        />
                     )}
                  />

                  {/* ✅ Submit Button */}
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                     {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default ConcernForm;
