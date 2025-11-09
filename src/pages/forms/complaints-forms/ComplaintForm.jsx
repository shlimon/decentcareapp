import axiosInstance from '@api/axiosInstance';
import {
   Checkbox,
   DateSelection,
   Radio,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import TimeInput from '@components/reusable/FormInputs/TimeInput';
import GoogleMapSearchBox from '@components/reusable/GoogleMapSearchBox/GoogleMapSearchBox';
import {
   attemptedActionOptions,
   outcomeDescriptionOptions,
   reasonNotResolvedOptions,
} from '@utils/complaintFormsData/complaintFormsData';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';
import CommonFieldForm from './CommonFieldForm';

const ComplaintForm = () => {
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
         type: 'complaints',
         haveConsent: '',
         reporterAnonymous: '',
         participantAnonymous: '',

         contactTime: [],
         contactMethod: '',

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
         //   address
         fullAddress: '',
         street: '',
         suburb: '',
         state: '',
         postCode: '',
         city: '',
         country: '',
         lat: '',
         lng: '',

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

   const onSubmit = async (data) => {
      // Transform frontend data to match backend schema

      const payload = {
         // Base fields (required)
         type: data.type, // 'complaints'
         haveConsent: data.haveConsent === 'yes', // Convert string to boolean
         participant,
         departmentName,
         anonymous: data.participantAnonymous === 'yes', // Convert string to boolean

         // Contact information
         contact: {
            time: Array.isArray(data.contactTime)
               ? data.contactTime[0]
               : data.contactTime,
            method: data.contactMethod,
         },

         // Complaints-specific fields
         needSupportPerson: data.needSupportPerson === 'yes', // Convert string to boolean
         supportPerson:
            data.needSupportPerson === 'yes'
               ? {
                    relation: data.supportPerson.relation,
                    firstName: data.supportPerson.firstName,
                    lastName: data.supportPerson.lastName,
                    phone: data.supportPerson.phone,
                    email: data.supportPerson.email,
                 }
               : undefined,

         complain: data.complain,
         occurTime: data.occurTime,
         occurDate: data.occurDate ? new Date(data.occurDate) : new Date(),
         address: {
            fullAddress: data.fullAddress,
            street: data.street,
            suburb: data.suburb,
            state: data.state,
            postCode: data.postCode,
            city: data.city,
            country: data.country,
            lat: data.lat,
            lng: data.lng,
         },

         impact: data.impact,
         urgency: data.urgency,
         resolveSuggestion: data.resolveSuggestion,
         haveTried: data.haveTried,

         // Conditional fields based on haveTried
         ...(data.haveTried === 'no' && {
            reasonNotResolved:
               data.reasonNotResolved.includes('Others') &&
               data.reasonNotResolvedOther
                  ? data.reasonNotResolved
                       .filter((reason) => reason !== 'Others')
                       .concat(data.reasonNotResolvedOther)
                  : data.reasonNotResolved,
         }),

         ...(data.haveTried === 'yes' && {
            attemptedAction:
               data.attemptedAction.includes('Others') &&
               data.attemptedActionOther
                  ? data.attemptedAction
                       .filter((action) => action !== 'Others')
                       .concat(data.attemptedActionOther)
                  : data.attemptedAction,
            communicationOutcome: data.communicationOutcome,
            outcomeDescription: data.outcomeDescription,
         }),
      };

      try {
         const response = await axiosInstance.post(`/complaints`, payload);
         if (response?.data?.success) {
            toast.success('Formal Complaint Submitted Successfully');
            navigate('/forms/complaint');
         }
      } catch (error) {
         toast.error('Submission Failed');
         console.error('Error submitting complaint:', error);
         throw error;
      }
   };

   const needSupport = watch('needSupportPerson');
   const haveTried = watch('haveTried');
   const supportPersonRelation = watch('supportPerson.relation');
   const attemptedAction = watch('attemptedAction');
   const reasonNotResolved = watch('reasonNotResolved');

   return (
      <div>
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                  Formal Complaint
               </h2>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <CommonFieldForm />

                  <div>
                     <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-start">
                        Do you want to remain anonymous?
                     </h2>
                     <h5 className="text-gray-700 mb-2">
                        Anonymous complaints:{' '}
                     </h5>
                     <ul className="list-disc text-gray-700 mb-6 pl-6">
                        <li>
                           We can investigate anonymous complaints, but we may
                           not be able to update you on progress.
                        </li>
                        <li>
                           We recommend providing at least a way to contact you,
                           which we will keep confidential.
                        </li>
                        <li>
                           If your complaint involves serious safety concerns,
                           we may still need to take action even if anonymous.
                        </li>
                     </ul>
                  </div>

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
                     <div className="space-y-6  rounded-lg ">
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
                                    { value: 'Others', label: 'Others' },
                                 ]}
                                 error={errors.supportPerson?.relation?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />
                        {supportPersonRelation === 'Others' && (
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

                        <Controller
                           name="supportPerson.phone"
                           control={control}
                           render={({ field }) => (
                              <Text {...field} label="Support Person Phone" />
                           )}
                        />
                        <Controller
                           name="supportPerson.email"
                           control={control}
                           render={({ field }) => (
                              <Text {...field} label="Support Person Email" />
                           )}
                        />
                     </div>
                  )}

                  <div>
                     <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-start">
                        Please tell us what happened.
                     </h2>
                     <h5 className="text-gray-700 text-base">
                        This is the most important part of your complaint.
                        Please provide as much as details as you can.
                     </h5>
                     <h5 className="text-gray-700 text-base font-bold pt-4 pb-1">
                        Helpful Tips
                     </h5>
                     <ul className="list-disc pl-6 text-gray-700 mb-6">
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
                              showClock={false}
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
                              maxDate={new Date().toISOString()}
                           />
                        )}
                     />
                  </div>

                  {/* Address Group */}
                  <div className="space-y-4">
                     <h5 className="text-gray-800 flex items-start">
                        Where did this happen?
                     </h5>

                     <GoogleMapSearchBox label="Location of the incident" />
                     <div className="mt-5">
                        <div className="mb-4">
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unit Number & Street{' '}
                              <span className="text-red-500">*</span>
                           </label>
                           <Controller
                              name="street"
                              control={control}
                              rules={{
                                 required: 'Street address is required',
                              }}
                              render={({ field }) => (
                                 <>
                                    <input
                                       type="text"
                                       placeholder="Street address"
                                       value={field.value}
                                       onChange={field.onChange}
                                       onBlur={field.onBlur}
                                       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                          errors.street
                                             ? 'border-red-500 focus:ring-red-500'
                                             : 'border-gray-300 focus:ring-blue-500'
                                       }`}
                                    />
                                    {errors.street && (
                                       <p className="mt-1 text-sm text-red-600">
                                          {errors.street.message}
                                       </p>
                                    )}
                                 </>
                              )}
                           />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Suburb <span className="text-red-500">*</span>
                              </label>
                              <Controller
                                 name="suburb"
                                 control={control}
                                 rules={{
                                    required: 'Suburb is required',
                                 }}
                                 render={({ field }) => (
                                    <>
                                       <input
                                          type="text"
                                          placeholder="Suburb"
                                          value={field.value}
                                          onChange={field.onChange}
                                          onBlur={field.onBlur}
                                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                             errors.suburb
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                          }`}
                                       />
                                       {errors.suburb && (
                                          <p className="mt-1 text-sm text-red-600">
                                             {errors.suburb.message}
                                          </p>
                                       )}
                                    </>
                                 )}
                              />
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 State <span className="text-red-500">*</span>
                              </label>
                              <Controller
                                 name="state"
                                 control={control}
                                 rules={{
                                    required: 'State is required',
                                 }}
                                 render={({ field }) => (
                                    <>
                                       <input
                                          type="text"
                                          placeholder="State"
                                          value={field.value}
                                          onChange={field.onChange}
                                          onBlur={field.onBlur}
                                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                             errors.state
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                          }`}
                                       />
                                       {errors.state && (
                                          <p className="mt-1 text-sm text-red-600">
                                             {errors.state.message}
                                          </p>
                                       )}
                                    </>
                                 )}
                              />
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Postcode{' '}
                                 <span className="text-red-500">*</span>
                              </label>
                              <Controller
                                 name="postCode"
                                 control={control}
                                 rules={{
                                    required: 'Postcode is required',
                                    pattern: {
                                       value: /^\d{4}$/,
                                       message: 'Invalid Australian postcode',
                                    },
                                 }}
                                 render={({ field }) => (
                                    <>
                                       <input
                                          type="text"
                                          placeholder="Postcode"
                                          value={field.value}
                                          onChange={field.onChange}
                                          onBlur={field.onBlur}
                                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                             errors.postCode
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                          }`}
                                       />
                                       {errors.postCode && (
                                          <p className="mt-1 text-sm text-red-600">
                                             {errors.postCode.message}
                                          </p>
                                       )}
                                    </>
                                 )}
                              />
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Country <span className="text-red-500">*</span>
                              </label>
                              <Controller
                                 name="country"
                                 control={control}
                                 rules={{
                                    required: 'Country is required',
                                    validate: (value) =>
                                       value.toLowerCase() === 'australia' ||
                                       'Country must be Australia',
                                 }}
                                 render={({ field }) => (
                                    <>
                                       <input
                                          type="text"
                                          placeholder="Country"
                                          value={field.value}
                                          onChange={field.onChange}
                                          onBlur={field.onBlur}
                                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                             errors.country
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                          }`}
                                       />
                                       {errors.country && (
                                          <p className="mt-1 text-sm text-red-600">
                                             {errors.country.message}
                                          </p>
                                       )}
                                    </>
                                 )}
                              />
                           </div>
                        </div>
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
                                 value: 'yes',
                                 label: 'Yes - I tried to resolve it',
                              },
                              {
                                 value: 'no',
                                 label: "No - I haven't tried yet",
                              },
                              {
                                 value: 'notYet',
                                 label: "No - I didn't feel comfortable trying",
                              },
                           ]}
                           error={errors.haveTried?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {haveTried === 'yes' && (
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
                        {attemptedAction.includes('Others') && (
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

                  {haveTried === 'no' && (
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
                        {reasonNotResolved.includes('Others') && (
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
                                 value: 'Urgent',
                                 label: 'URGENT - Immediate safety concern (I or others are at risk right now)',
                              },
                              {
                                 value: 'High Priority',
                                 label: 'HIGH PRIORITY - Serious ongoing concern or risk',
                              },
                              {
                                 value: 'Standard',
                                 label: 'STANDARD - Important but not urgent',
                              },
                              {
                                 value: 'Low Priority',
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
