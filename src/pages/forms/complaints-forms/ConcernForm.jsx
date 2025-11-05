import {
   Checkbox,
   Radio,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import CommonFieldForm from './CommonFieldForm';

const ConcernForm = ({ type }) => {
   const methods = useForm({
      defaultValues: {
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

   // watch concernType concernTypeOptions to see selected values
   const selectedConcernTypes = watch('concernType');

   const onSubmit = async (data) => {
      console.log('Submitted Concern:', data);
   };

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
      { value: 'Other', label: 'Other' },
   ];

   return (
      <div className="">
         <CommonFieldForm type={type} />

         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white min-h-screen">
               <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-8">
                  Concern
               </h1>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        />
                     )}
                  />
                  {selectedConcernTypes.includes('Other') && (
                     <Controller
                        name="otherConcernType"
                        control={control}
                        render={({ field }) => (
                           <Text
                              label="Other: Please specify"
                              placeholder="Enter other concern type"
                              {...field}
                              error={errors.otherConcernType?.message}
                              //   no border
                              // className="!border-none"
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
                           //   no border
                           // className="!border-none"
                        />
                     )}
                  />
                  <Controller
                     name="firstNotice"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           label="When did you first notice this?"
                           placeholder="Enter details here"
                           {...field}
                           error={errors.firstNotice?.message}
                        />
                     )}
                  />
                  <Controller
                     name="happeningArea"
                     control={control}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="When did you first notice this?"
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
                        />
                     )}
                  />

                  {/* ✅ Submit Button */}
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
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
