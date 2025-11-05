import {
   Checkbox,
   Radio,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import CommonFieldForm from './CommonFieldForm';

const SuggestionForm = ({ type }) => {
   const methods = useForm({
      defaultValues: {
         relatedArea: [],
         otherRelatedArea: '',
         suggestion: '',
         improvement: '',
         whereItWorked: '',
         priority: '',
         followup: '',
      },
   });

   const {
      handleSubmit,
      control,
      watch,
      formState: { errors, isSubmitting },
   } = methods;

   // Always an array ✅
   const selectedRelatedAreas = watch('relatedArea') || [];

   const onSubmit = async (data) => {
      console.log('Submitted Suggestion ✅:', data);
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
      { value: 'Other', label: 'Other' },
   ];

   return (
      <div className="">
         <CommonFieldForm type={type} />

         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white min-h-screen">
               <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-8">
                  Suggestion
               </h1>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Related Area */}
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

                  {/* Show "Other" text input only when selected */}
                  {selectedRelatedAreas.includes('Other') && (
                     <Controller
                        name="otherRelatedArea"
                        control={control}
                        rules={{ required: 'Please specify the other area' }}
                        render={({ field }) => (
                           <Text
                              {...field}
                              label="Other: Please specify"
                              placeholder="Enter other related area"
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
                     rules={{ required: 'Please describe how this helps' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="How would this improvement help you?"
                           placeholder="Enter your thoughts here"
                           error={errors.improvement?.message}
                           required
                        />
                     )}
                  />

                  {/* Where it worked */}
                  <Controller
                     name="whereItWorked"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Have you seen this work well elsewhere?"
                           placeholder="Share details here (optional)"
                           error={errors.whereItWorked?.message}
                        />
                     )}
                  />

                  {/* Priority */}
                  <Controller
                     name="priority"
                     control={control}
                     rules={{ required: 'Please select priority' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Priority for you"
                           options={[
                              {
                                 value: 'Would be really helpful',
                                 label: 'Would be really helpful',
                              },
                              { value: 'Nice to have', label: 'Nice to have' },
                              { value: 'Just an idea', label: 'Just an idea' },
                           ]}
                           error={errors.priority?.message}
                           required
                           isOptionsAreVertical={true}
                        />
                     )}
                  />

                  {/* Follow up */}
                  <Controller
                     name="followup"
                     control={control}
                     rules={{ required: 'Please choose an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Would you like us to follow up with you?"
                           options={[
                              {
                                 value: "Yes, I'd like to discuss further",
                                 label: "Yes, I'd like to discuss further",
                              },
                              {
                                 value: 'No, just wanted to share the idea',
                                 label: 'No, just wanted to share the idea',
                              },
                           ]}
                           error={errors.followup?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* Submit */}
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

export default SuggestionForm;
