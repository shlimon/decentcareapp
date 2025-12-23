import axiosInstance from '@api/axiosInstance';
import {
   Checkbox,
   DateSelection,
   File,
   Radio,
   Textarea,
} from '@components/reusable/FormInputs';
import TimeInput from '@components/reusable/FormInputs/TimeInput';
import GoogleMapSearchBox from '@components/reusable/GoogleMapSearchBox/GoogleMapSearchBox';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const WHSForm = () => {
   const navigate = useNavigate();

   const methods = useForm({
      defaultValues: {
         // Type of event
         eventType: '', // 'incident' | 'nearMiss' | 'hazard'

         // Event info
         eventDate: '',
         eventTime: '',
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

         // Witness
         hasWitness: false,
         witnessDetails: '',

         // Description
         leadUp: '',
         whatHappened: '',

         // Equipment / task / work practice involved
         equipmentInvolved: false,
         equipmentDetails: '',

         // ========== INCIDENT ==========
         injuryNature: '',
         treatmentProvided: false,
         treatmentDetails: '',
         returnedToWork: false,
         returnToWorkDetails: '',

         // ========== NEAR MISS ==========
         potentialOutcome: '',
         preventionReason: '',
         couldHappenAgain: '', // 'yes' | 'no' | 'unsure'
         futurePreventionActions: '',

         // ========== HAZARD ==========
         hazardRiskLevel: '',
         // 'noInjury' | 'minorInjury' | 'majorInjury' | 'fatality'

         hierarchyOfControls: [],
         // e.g. ['eliminate', 'substitute', 'isolate', 'engineering', 'administrative', 'ppe']

         // ========== COMMON ==========
         hasEvidence: false,
         evidenceFiles: [], // File[] if using file input
      },
   });

   const {
      handleSubmit,
      control,
      watch,
      formState: { errors, isSubmitting },
   } = methods;

   const hasWitnessValue = watch('hasWitness');
   const eventTypeValue = watch('eventType');
   const equipmentInvolvedValue = watch('equipmentInvolved');
   const treatmentProvidedValue = watch('treatmentProvided');
   const returnedToWorkValue = watch('returnedToWork');
   const hasEvidenceValue = watch('hasEvidence');

   const onSubmit = async (data) => {
      try {
         // build base payload
         const payload = {
            eventType: data.eventType,
            eventDate: data.eventDate
               ? new Date(data.eventDate).toISOString()
               : null,
            eventTime: data.eventTime,

            location: {
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

            hasWitness: data.hasWitness,
            witnessDetails: data.hasWitness ? data.witnessDetails : null,

            leadUp: data.leadUp,
            whatHappened: data.whatHappened,

            equipmentInvolved: data.equipmentInvolved,
            equipmentDetails: data.equipmentInvolved
               ? data.equipmentDetails
               : null,

            hasEvidence: data.hasEvidence,
         };

         // event-specific fields 
         if (data.eventType === 'Incident') {
            payload.injuryNature = data.injuryNature;
            payload.treatmentProvided = data.treatmentProvided;
            payload.treatmentDetails = data.treatmentProvided
               ? data.treatmentDetails
               : null;
            payload.returnedToWork = data.returnedToWork;
            payload.returnToWorkDetails = data.returnedToWork
               ? data.returnToWorkDetails
               : null;
         }

         if (data.eventType === 'Near Miss') {
            payload.potentialOutcome = data.potentialOutcome;
            payload.preventionReason = data.preventionReason;
            payload.couldHappenAgain = data.couldHappenAgain;
            payload.futurePreventionActions = data.futurePreventionActions;
         }

         if (data.eventType === 'Hazard') {
            payload.hazardRiskLevel = data.hazardRiskLevel;
            payload.hierarchyOfControls = data.hierarchyOfControls || [];
         }

         // decide request type 
         const hasFiles =
            data.hasEvidence &&
            data.evidenceFiles &&
            data.evidenceFiles.length > 0;

         let response;

         // clean or remove empty values
         const cleanPayload = removeEmptyValues(payload)

         if (hasFiles) {
            //  multipart/form-data 
            const formData = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
               if (value === undefined || value === null) return;

               // stringify objects & arrays
               if (typeof value === "object") {
                  formData.append(key, JSON.stringify(value));
               } else {
                  formData.append(key, value);
               }
            });

            // append files separately
            data.evidenceFiles.forEach((file) => {
               formData.append("evidenceFiles", file);
            });


            response = await axiosInstance.post('/whs', formData, {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            });
         } else {
            //  application/json 
            response = await axiosInstance.post('/whs', cleanPayload, {
               headers: {
                  'Content-Type': 'application/json',
               },
            });
         }

         //  success handling 
         if (response?.data?.success) {
            toast.success('Formal WHS Report Submitted Successfully');
            methods.reset();
            navigate('/work');
         }
      } catch (error) {
         toast.error(
            error?.response?.data?.message ||
            'Submission Failed. Please try again.'
         );
         console.error('Error submitting whs report:', error);
      }
   };


   return (
      <div>
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                     Event Report Form
                  </h2>

                  {/* Type of Event */}
                  <Controller
                     name="eventType"
                     control={control}
                     rules={{ required: 'Type of event is required' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Type of Event"
                           options={[
                              {
                                 value: 'Incident',
                                 label: 'Incident (injury Occurred)',
                              },
                              {
                                 value: 'Near Miss',
                                 label: 'Near Miss (no injury, but could have caused harm)',
                              },
                              {
                                 value: 'Hazard',
                                 label: 'Hazard (potential risk identified)',
                              },
                           ]}
                           error={errors.eventType?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* eventDate */}
                  <Controller
                     name="eventDate"
                     control={control}
                     rules={{ required: 'Event date is required' }}
                     render={({ field }) => (
                        <DateSelection
                           label="Date"
                           {...field}
                           placeholder="Select date"
                           error={errors.eventDate?.message}
                           maxDate={new Date().toISOString()}
                           required
                        />
                     )}
                  />
                  {/* eventTime */}
                  <Controller
                     name="eventTime"
                     control={control}
                     rules={{ required: 'Event time is required' }}
                     render={({ field }) => (
                        <TimeInput
                           label="Time"
                           {...field}
                           placeholder="Select time"
                           error={errors.eventTime?.message}
                           required
                        />
                     )}
                  />
                  {/* Location */}
                  {/* Address Group */}
                  <div className="space-y-4">
                     <h5 className="text-gray-800 flex items-start">
                        Location
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
                                       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.street
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
                                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.suburb
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
                                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.state
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
                                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.postCode
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
                                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.country
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

                  {/* Witness */}
                  <Controller
                     name="hasWitness"
                     control={control}
                     rules={{
                        validate: (value) =>
                           (value !== undefined &&
                              value !== null &&
                              value !== '') ||
                           'Please indicate if there were any witnesses',
                     }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Were there any witnesses?"
                           options={[
                              { value: true, label: 'Yes' },
                              { value: false, label: 'No' },
                           ]}
                           error={errors.hasWitness?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {hasWitnessValue && (
                     <Controller
                        name="witnessDetails"
                        control={control}
                        rules={{ required: 'Witness details are required' }}
                        render={({ field }) => (
                           <Textarea
                              {...field}
                              label="Witness names and contact details"
                              placeholder="Enter witness details"
                              error={errors.witnessDetails?.message}
                              required
                           />
                        )}
                     />
                  )}

                  {/* Description */}
                  <Controller
                     name="leadUp"
                     control={control}
                     rules={{ required: 'This field is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="What led up to the event?"
                           placeholder="Describe what led up to the event"
                           error={errors.leadUp?.message}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="whatHappened"
                     control={control}
                     rules={{ required: 'This field is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="What happened?"
                           placeholder="Describe what happened"
                           error={errors.whatHappened?.message}
                           required
                        />
                     )}
                  />

                  {/* Equipment involved */}
                  <Controller
                     name="equipmentInvolved"
                     control={control}
                     rules={{
                        validate: (value) =>
                           (value !== undefined &&
                              value !== null &&
                              value !== '') ||
                           'Please select an option',
                     }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Any equipment, tasks, or work practice involved?"
                           options={[
                              { value: true, label: 'Yes' },
                              { value: false, label: 'No' },
                           ]}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {equipmentInvolvedValue && (
                     <Controller
                        name="equipmentDetails"
                        control={control}
                        rules={{ required: 'Details are required' }}
                        render={({ field }) => (
                           <Textarea
                              {...field}
                              label="Provide details"
                              placeholder="Enter details"
                              error={errors.equipmentDetails?.message}
                              required
                           />
                        )}
                     />
                  )}

                  {/* incident */}
                  {eventTypeValue === 'Incident' && (
                     <>
                        <Controller
                           name="injuryNature"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="Nature of the injury"
                                 placeholder="Describe the injury"
                                 error={errors.injuryNature?.message}
                              />
                           )}
                        />

                        <Controller
                           name="treatmentProvided"
                           control={control}
                           rules={{
                              validate: (value) =>
                                 (value !== undefined &&
                                    value !== null &&
                                    value !== '') ||
                                 'Please select an option',
                           }}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Was treatment provided?"
                                 options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                 ]}
                                 error={errors.treatmentProvided?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />

                        {treatmentProvidedValue && (
                           <Controller
                              name="treatmentDetails"
                              control={control}
                              render={({ field }) => (
                                 <Textarea
                                    {...field}
                                    label="Treatment details"
                                    placeholder="Provide treatment details"
                                    error={errors.treatmentDetails?.message}
                                 />
                              )}
                           />
                        )}

                        <Controller
                           name="returnedToWork"
                           control={control}
                           rules={{
                              validate: (value) =>
                                 (value !== undefined &&
                                    value !== null &&
                                    value !== '') ||
                                 'Please select an option',
                           }}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Did you return to work after the incident?"
                                 options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                 ]}
                                 error={errors.returnedToWork?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />

                        {returnedToWorkValue && (
                           <Controller
                              name="returnToWorkDetails"
                              control={control}
                              render={({ field }) => (
                                 <Textarea
                                    {...field}
                                    label="Return to work details"
                                    placeholder="Same shift or later?"
                                    error={errors.returnToWorkDetails?.message}
                                 />
                              )}
                           />
                        )}
                     </>
                  )}

                  {/*  NEAR MISS */}
                  {eventTypeValue === 'Near Miss' && (
                     <>
                        <Controller
                           name="potentialOutcome"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="What could have happened?"
                                 placeholder="Potential injury or severity"
                                 error={errors.potentialOutcome?.message}
                              />
                           )}
                        />

                        <Controller
                           name="preventionReason"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="What prevented harm?"
                                 placeholder="Quick action, safety control, luck, etc."
                                 error={errors.preventionReason?.message}
                              />
                           )}
                        />

                        <Controller
                           name="couldHappenAgain"
                           control={control}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Do you believe this could happen again?"
                                 options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                    { value: 'unsure', label: 'Unsure' },
                                 ]}
                                 error={errors.couldHappenAgain?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />

                        <Controller
                           name="futurePreventionActions"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="What actions could prevent this in future?"
                                 placeholder="Describe prevention actions"
                                 error={errors.futurePreventionActions?.message}
                              />
                           )}
                        />
                     </>
                  )}

                  {/* ========== HAZARD ========== */}
                  {eventTypeValue === 'Hazard' && (
                     <>
                        <Controller
                           name="hazardRiskLevel"
                           control={control}
                           rules={{
                              validate: (value) =>
                                 (value !== undefined &&
                                    value !== null &&
                                    value !== '') ||
                                 'select a risk level',
                           }}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Risk level"
                                 options={[
                                    {
                                       value: 'noInjury',
                                       label: 'No injury or minimal discomfort',
                                    },
                                    {
                                       value: 'minorInjury',
                                       label: 'First aid required only - Minor Injury',
                                    },
                                    {
                                       value: 'majorInjury',
                                       label: 'Medical treatment or time off - Major Injury',
                                    },
                                    {
                                       value: 'fatality',
                                       label: 'Fatality - Death or permanent disability',
                                    },
                                 ]}
                                 error={errors.hazardRiskLevel?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />

                        <Controller
                           name="hierarchyOfControls"
                           control={control}
                           render={({ field }) => (
                              <Checkbox
                                 {...field}
                                 title="Hierarchy of Controls (select all that apply)"
                                 options={[
                                    {
                                       value: 'eliminate',
                                       label: 'Eliminate the hazard',
                                    },
                                    {
                                       value: 'substitute',
                                       label: 'Substitute with a safer option',
                                    },
                                    {
                                       value: 'isolate',
                                       label: 'Isolate the hazard',
                                    },
                                    {
                                       value: 'engineering',
                                       label: 'Engineering controls',
                                    },
                                    {
                                       value: 'administrative',
                                       label: 'Administrative controls',
                                    },
                                    {
                                       value: 'ppe',
                                       label: 'Personal Protective Equipment',
                                    },
                                 ]}
                                 isOptionsAreVertical={true}
                                 error={errors.hierarchyOfControls?.message}
                                 multiple={true}
                              />
                           )}
                        />
                     </>
                  )}

                  {/* ========== COMMON ========== */}
                  <Controller
                     name="hasEvidence"
                     control={control}
                     rules={{
                        validate: (value) =>
                           (value !== undefined &&
                              value !== null &&
                              value !== '') ||
                           'Please select an option',
                     }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Upload evidence or documentation?"
                           options={[
                              { value: true, label: 'Yes' },
                              { value: false, label: 'No' },
                           ]}
                           error={errors.hasEvidence?.message}
                           isOptionsAreVertical={true}
                        />
                     )}
                  />

                  {hasEvidenceValue && (
                     <Controller
                        name="evidenceFiles"
                        control={control}
                        rules={{
                           required: 'At least one photo/video is required',
                        }}
                        render={({ field: { onChange, value } }) => (
                           <File
                              value={value}
                              onChange={onChange}
                              title="Upload Photos/Videos"
                              description="Upload media files for release"
                              accept={[
                                 'image/*',
                                 'application/pdf',
                                 'docs/*',
                                 '.jpg',
                                 '.jpeg',
                                 '.png',
                              ]}
                              supportedFormats={[
                                 'JPG',
                                 'JPEG',
                                 'PNG',
                                 'PDF',
                                 'DOCS',
                              ]}
                              maxSize={10 * 1024 * 1024}
                              error={errors.evidenceFiles?.message}
                              multiple={true}
                              enableImageCropping={true}
                              required
                           />
                        )}
                     />
                  )}

                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
                  >
                     {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default WHSForm;
