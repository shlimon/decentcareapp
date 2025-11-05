import {
   Checkbox,
   DateSelection,
   Radio,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import TimeInput from '@components/reusable/FormInputs/TimeInput';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import CommonFieldForm from './CommonFieldForm';

const ComplaintForm = ({ type }) => {
   const methods = useForm({
      defaultValues: {
         needSupportPerson: '',
         supportPerson: {
            relation: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
         },
         complain: '',
         occurTime: '',
         occurDate: '',
         address: {
            street: '',
            postcode: '',
            city: '',
            state: '',
         },
         haveTried: '',
         attemptedAction: [],
         communicationOutcome: '',
         outcomeDescription: [],
         reasonNotResolved: [],
         impact: '',
         urgency: '',
         resolveSuggestion: '',
      },
   });

   const {
      handleSubmit,
      control,
      watch,
      formState: { errors, isSubmitting },
   } = methods;

   const needSupport = watch('needSupportPerson');
   const haveTried = watch('haveTried');
   const supportPersonRelation = watch('supportPerson.relation');
   const attemptedAction = watch('attemptedAction');
   const reasonNotResolved = watch('reasonNotResolved');

   const attemptedActionOptions = [
      {
         value: 'Spoke directly to the support worker involved',
         label: 'Spoke directly to the support worker involved',
      },
      {
         value: "Spoke to the support worker's supervisor",
         label: "Spoke to the support worker's supervisor",
      },
      { value: 'Spoke to my coordinator', label: 'Spoke to my coordinator' },
      {
         value: 'Spoke to a manager',
         label: 'Spoke to a manager',
      },
      {
         value: 'Sent an email',
         label: 'Sent an email',
      },
      {
         value: 'Called the office',
         label: 'Called the office',
      },
      {
         value: 'Lodged a concern (informal complaint)',
         label: 'Lodged a concern (informal complaint)',
      },
      {
         value: 'Other',
         label: 'Other',
      },
   ];

   const outcomeDescriptionOptions = [
      {
         value: 'Partially resolved (some things were fixed but not everything)',
         label: 'Partially resolved (some things were fixed but not everything)',
      },
      { value: 'Not resolved at all', label: 'Not resolved at all' },
      { value: 'Made things worse', label: 'Made things worse' },
      { value: 'No response received', label: 'No response received' },
      {
         value: 'Response was unsatisfactory',
         label: 'Response was unsatisfactory',
      },
      {
         value: 'Was told it would be addressed but nothing happened',
         label: 'Was told it would be addressed but nothing happened',
      },
   ];

   const reasonNotResolvedOptions = [
      {
         value: "I didn't know how to raise it",
         label: "I didn't know how to raise it",
      },
      {
         value: "I didn't know who to tell",
         label: "I didn't know who to tell",
      },
      {
         value: 'I was worried it would affect my services',
         label: 'I was worried it would affect my services',
      },
      {
         value: 'I was scared or intimidated',
         label: 'I was scared or intimidated',
      },
      {
         value: "I didn't feel comfortable",
         label: "I didn't feel comfortable",
      },
      {
         value: "I didn't think it would help",
         label: "I didn't think it would help",
      },
      {
         value: 'I wanted to think about it first',
         label: 'I wanted to think about it first',
      },
      {
         value: 'Other',
         label: 'Other',
      },
   ];

   const onSubmit = (data) => {
      console.log('Complaint Submitted ✅:', data);
   };

   return (
      <div>
         <CommonFieldForm type={type} />
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-8">
                  Formal Complaint
               </h1>

               <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-start">
                     Do you want to remain anonymous?
                  </h3>
                  <h5 className="text-gray-700">Anonymous complaints: </h5>
                  <ul className="list-disc list-inside text-gray-700 mb-6">
                     <li>
                        We can investigate anonymous complaints, but we may not
                        be able to update you on progress.
                     </li>
                     <li>
                        We recommend providing at least a way to contact you,
                        which we will keep confidential.
                     </li>
                     <li>
                        If your complaint involves serious safety concerns, we
                        may still need to take action even if anonymous.
                     </li>
                  </ul>
               </div>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Support Person Section */}
                  <Controller
                     name="needSupportPerson"
                     control={control}
                     rules={{ required: 'Please select an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Do You Want a Support Person Involved?"
                           options={[
                              {
                                 value: 'Yes',
                                 label: 'Yes, I would like someone to support me',
                              },
                              {
                                 value: 'No',
                                 label: "No, I'll handle this myself",
                              },
                           ]}
                           error={errors.needSupportPerson?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {needSupport === 'Yes' && (
                     <div className="space-y-6 border p-4 rounded-lg bg-gray-50">
                        <Controller
                           name="supportPerson.relation"
                           control={control}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Their relationship to you:"
                                 options={[
                                    {
                                       value: 'Family member',
                                       label: 'Family member',
                                    },
                                    { value: 'Friend', label: 'Friend' },
                                    {
                                       value: 'Paid advocate',
                                       label: 'Paid advocate',
                                    },
                                    {
                                       value: 'Disability advocate',
                                       label: 'Disability advocate',
                                    },
                                    {
                                       value: 'Legal representative',
                                       label: 'Legal representative',
                                    },
                                    {
                                       value: 'Guardian/Nominee',
                                       label: 'Guardian/Nominee',
                                    },
                                    {
                                       value: 'NDIS Support Coordinator',
                                       label: 'NDIS Support Coordinator',
                                    },
                                    { value: 'Other', label: 'Other' },
                                 ]}
                                 error={errors.supportPerson?.relation?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />
                        {supportPersonRelation === 'Other' && (
                           <Controller
                              name="supportPerson.relationOther"
                              control={control}
                              render={({ field }) => (
                                 <Text
                                    {...field}
                                    label="Please specify"
                                    placeholder="Please type another option here"
                                    error={
                                       errors.supportPerson?.relationOther
                                          ?.message
                                    }
                                 />
                              )}
                           />
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                           <h3 className="col-span-2 font-semibold text-gray-700 flex items-start">
                              Support Person Details
                           </h3>
                           <Controller
                              name="supportPerson.firstName"
                              control={control}
                              render={({ field }) => (
                                 <Text {...field} label="First Name" />
                              )}
                           />
                           <Controller
                              name="supportPerson.lastName"
                              control={control}
                              render={({ field }) => (
                                 <Text {...field} label="Last Name" />
                              )}
                           />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                           <Controller
                              name="supportPerson.phone"
                              control={control}
                              render={({ field }) => (
                                 <Text
                                    {...field}
                                    label="Support Person Phone"
                                 />
                              )}
                           />
                           <Controller
                              name="supportPerson.email"
                              control={control}
                              render={({ field }) => (
                                 <Text
                                    {...field}
                                    label="Support Person Email"
                                 />
                              )}
                           />
                        </div>
                     </div>
                  )}

                  <div>
                     <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-start">
                        Please tell us what happened.
                     </h3>
                     <h5 className="text-gray-700 text-base">
                        This is the most important part of your complaint.
                        Please provide as much as details as you can.
                     </h5>
                     <h5 className="text-gray-700 text-base font-bold">
                        Helpful Tips
                     </h5>
                     <ul className="list-disc list-inside text-gray-700 mb-6">
                        <li>Describe what happened step by step.</li>
                        <li>Include what was said and done.</li>
                        <li>Explain how it made you feel.</li>
                        <li>Mention if this has happened before.</li>
                        <li>Include any relevant background information.</li>
                     </ul>
                  </div>

                  {/* Complaint */}
                  <Controller
                     name="complain"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="What happened?"
                           placeholder="Describe your complaint here..."
                           error={errors.complain?.message}
                           required
                        />
                     )}
                  />

                  {/* Time & Date */}
                  <h3 className="text-gray-800 flex items-start">
                     When did this happen?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Controller
                        name="occurTime"
                        control={control}
                        render={({ field }) => (
                           <TimeInput
                              {...field}
                              label="Time"
                              placeholder="Select time"
                              error={errors.occurTime?.message}
                           />
                        )}
                     />
                     <Controller
                        name="occurDate"
                        control={control}
                        render={({ field }) => (
                           <DateSelection
                              {...field}
                              label="Date"
                              placeholder="Select date"
                              error={errors.occurDate?.message}
                           />
                        )}
                     />
                  </div>

                  {/* Address Group */}
                  <div className="space-y-4">
                     <h5 className="text-gray-800 flex items-start">
                        Where did this happen?
                     </h5>

                     <Controller
                        name="address.street"
                        control={control}
                        render={({ field }) => (
                           <Text {...field} label="Street" />
                        )}
                     />
                     <Controller
                        name="address.postcode"
                        control={control}
                        render={({ field }) => (
                           <Text {...field} label="Postcode" />
                        )}
                     />
                     <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                        <Controller
                           name="address.city"
                           control={control}
                           render={({ field }) => (
                              <Text
                                 {...field}
                                 label="City"
                                 error={errors.address?.city?.message}
                              />
                           )}
                        />
                        <Controller
                           name="address.state"
                           control={control}
                           render={({ field }) => (
                              <Text
                                 {...field}
                                 label="State / Province"
                                 error={errors.address?.state?.message}
                              />
                           )}
                        />
                     </div>
                  </div>

                  {/* Have Tried to Resolve */}
                  <Controller
                     name="haveTried"
                     control={control}
                     rules={{ required: 'Please select an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Before making this formal complaint, did you try to resolve the issue?"
                           options={[
                              {
                                 value: 'Yes',
                                 label: 'Yes - I tried to resolve it',
                              },
                              {
                                 value: 'No',
                                 label: "No - I haven't tried yet",
                              },
                              {
                                 value: "No - I didn't feel comfortable trying",
                                 label: "No - I didn't feel comfortable trying",
                              },
                           ]}
                           error={errors.haveTried?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {haveTried === 'Yes' && (
                     <div className="space-y-6 border p-4 rounded-lg bg-gray-50">
                        <Controller
                           name="attemptedAction"
                           control={control}
                           render={({ field }) => (
                              <Checkbox
                                 {...field}
                                 title="What Did You Try?"
                                 multiselect
                                 control={control}
                                 options={attemptedActionOptions}
                                 isOptionsAreVertical={true}
                                 error={errors.attemptedAction?.message}
                              />
                           )}
                        />
                        {attemptedAction.includes('Other') && (
                           <Controller
                              name="attemptedActionOther"
                              control={control}
                              render={({ field }) => (
                                 <Text
                                    {...field}
                                    label="Please specify"
                                    placeholder="Please type another option here"
                                    error={errors.attemptedActionOther?.message}
                                 />
                              )}
                           />
                        )}

                        <Controller
                           name="communicationOutcome"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="What hppend when you tried to communicate & what was the outcome?"
                                 placeholder="Enter details here"
                                 error={errors.communicationOutcome?.message}
                              />
                           )}
                        />

                        <Controller
                           name="outcomeDescription"
                           control={control}
                           render={({ field }) => (
                              <Checkbox
                                 {...field}
                                 title="How would you describe the outcome?"
                                 multiselect
                                 control={control}
                                 options={outcomeDescriptionOptions}
                                 isOptionsAreVertical={true}
                                 error={errors.outcomeDescription?.message}
                              />
                           )}
                        />
                     </div>
                  )}

                  {haveTried === 'No' && (
                     <div className="space-y-6 border p-4 rounded-lg bg-gray-50">
                        <Controller
                           name="reasonNotResolved"
                           control={control}
                           render={({ field }) => (
                              <Checkbox
                                 {...field}
                                 multiselect
                                 title="Why Haven't You Tried to Resolve It Yet?"
                                 control={control}
                                 options={reasonNotResolvedOptions}
                                 isOptionsAreVertical={true}
                                 error={errors.reasonNotResolved?.message}
                              />
                           )}
                        />
                        {reasonNotResolved.includes('Other') && (
                           <Controller
                              name="reasonNotResolvedOther"
                              control={control}
                              render={({ field }) => (
                                 <Text
                                    {...field}
                                    label="Please specify"
                                    placeholder="Please type another option here"
                                    error={
                                       errors.reasonNotResolvedOther?.message
                                    }
                                 />
                              )}
                           />
                        )}
                     </div>
                  )}

                  {/* Impact */}
                  <Controller
                     name="impact"
                     control={control}
                     rules={{ required: 'Please select level of impact' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Overall, how would you describe the impact of this situation on you?"
                           options={[
                              {
                                 value: 'Minor',
                                 label: 'Minor - Small inconvenience or brief upset',
                              },
                              {
                                 value: 'Moderate',
                                 label: 'Moderate - Caused some distress or disruption to my life/services',
                              },
                              {
                                 value: 'Significant',
                                 label: 'Significant - Caused considerable distress or major disruption',
                              },
                              {
                                 value: 'Severe',
                                 label: 'Severe - Caused serious harm or major ongoing impact',
                              },
                              {
                                 value: 'Critical',
                                 label: 'Critical - Caused severe harm, trauma, or danger to my safety',
                              },
                           ]}
                           error={errors.impact?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* Urgency */}
                  <Controller
                     name="urgency"
                     control={control}
                     rules={{ required: 'Please select urgency level' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="How Urgent Is This Complaint?"
                           options={[
                              {
                                 value: 'URGENT',
                                 label: 'URGENT - Immediate safety concern (I or others are at risk right now)',
                              },
                              {
                                 value: 'HIGH PRIORITY',
                                 label: 'HIGH PRIORITY - Serious ongoing concern or risk',
                              },
                              {
                                 value: 'STANDARD',
                                 label: 'STANDARD - Important but not urgent',
                              },
                              {
                                 value: 'LOW PRIORITY',
                                 label: 'LOW PRIORITY - Not urgent, but needs to be addressed',
                              },
                           ]}
                           error={errors.urgency?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* Resolution Suggestion */}
                  <Controller
                     name="resolveSuggestion"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="How do you feel this issue should be resolved?"
                           placeholder="Share your thoughts..."
                        />
                     )}
                  />

                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
                  >
                     {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                  </button>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default ComplaintForm;
