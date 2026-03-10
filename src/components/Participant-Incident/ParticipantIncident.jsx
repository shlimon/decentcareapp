import axiosInstance from '@api/axiosInstance';
import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import {
   Checkbox,
   File,
   Radio,
   Select,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import GoogleMapSearchBox from '@components/reusable/GoogleMapSearchBox/GoogleMapSearchBox';
import SearchableSelect from '@components/reusable/SearchableSelect';
import useAllStaffsQuery from '@hooks/useAllStaffsQuery';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function ParticipantIncident() {
   const navigate = useNavigate();
   const navigation = () => navigate(`/forms`);
   const { data: staffMembers, isLoading: isLoadingStaff } =
      useAllStaffsQuery();

   const methods = useForm({
      defaultValues: {
         participant: '',
         departmentName: '',
         dateOfIncident: '',
         timeOfIncident: '',

         incidentOnProvisionOfService: '',

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

         // new fields
         isStaffBehaviourInvolved: '',
         typeOfConcern: '',
         otherTypeOfConcern: '',
         involvedStaff: '',
         evidences: [],

         hasWitnesses: '',
         witnessDetails: '',
         incidentDescription: '',
         resultedInInjury: '',
         treatmentProvided: '',
         natureOfInjury: '',
         equipmentInvolved: '',
         equipmentDetails: '',
      },
   });

   const {
      handleSubmit,
      control,
      watch,
      reset,
      setValue,
      formState: { errors, isSubmitting },
   } = methods;

   const watchHasWitnesses = watch('hasWitnesses');
   const watchResultedInInjury = watch('resultedInInjury');
   const watchEquipmentInvolved = watch('equipmentInvolved');
   const watchisStaffBehaviourInvolved = watch('isStaffBehaviourInvolved');
   const watchTypeOfConcern = watch('typeOfConcern');
   const hasEvidenceValue = watch('hasEvidence');

   const onSubmit = async (data) => {
      // Validate department selection
      if (!data.departmentName) {
         toast.error('Please select a department');
         return;
      }

      try {
         const formattedData = {
            participant: data.participant,
            departmentName: data.departmentName,
            incidentOnProvisionOfService:
               data.incidentOnProvisionOfService === 'yes',
            incidentDetails: {
               dateOfIncident: data.dateOfIncident,
               timeOfIncident: data.timeOfIncident,
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
            },

            // new fields
            isStaffBehaviourInvolved: data.isStaffBehaviourInvolved,
            typeOfConcern: data.typeOfConcern,
            otherTypeOfConcern: data.otherTypeOfConcern,
            involvedStaff: data.involvedStaff,

            witnesses: data.hasWitnesses === 'Yes',
            witnessDetails: data.witnessDetails || '',
            descriptionOfIncident: data.incidentDescription,
            didInjured: data.resultedInInjury === 'Yes',
            treatmentProvided: data.treatmentProvided || '',
            natureOfInjury: data.natureOfInjury || '',
            equipmentInvolved: data.equipmentInvolved === 'Yes',
            equipmentDetails: data.equipmentDetails || '',
            // hasEvidence: data.hasEvidence,
         };

         const hasFiles =
            data.hasEvidence && data.evidences && data.evidences.length > 0;

         let response;

         // Clean or remove empty values
         const cleanPayload = removeEmptyValues(formattedData);

         if (hasFiles) {
            // multipart/form-data
            const formData = new FormData();

            Object.entries(cleanPayload).forEach(([key, value]) => {
               if (value === undefined || value === null) return;

               // stringify objects & arrays
               if (typeof value === 'object' && !Array.isArray(value)) {
                  formData.append(key, JSON.stringify(value));
               } else if (Array.isArray(value)) {
                  formData.append(key, JSON.stringify(value));
               } else {
                  formData.append(key, value);
               }
            });

            // append files separately
            data.evidences.forEach((file) => {
               formData.append('evidences', file);
            });

            response = await axiosInstance.post('/incident-reports', formData, {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            });
         } else {
            // application/json
            response = await axiosInstance.post(
               '/incident-reports',
               cleanPayload,
               {
                  headers: {
                     'Content-Type': 'application/json',
                  },
               },
            );
         }

         if (response?.data?.success) {
            toast.success('Your incident has been submitted successfully!');
            reset();
            window.scrollTo(0, 0);
            navigate('/forms');
         } else {
            toast.error(
               response?.data?.message ||
                  'Failed to submit report. Please try again.',
            );
         }
      } catch (err) {
         console.error(err);
         toast.error(
            err?.response?.data?.message ||
               'Network error. Please check your connection and try again.',
         );
      }
   };

   const staffOptions =
      staffMembers?.map((staff) => ({
         value: staff._id,
         label: staff.name,
      })) || [];

   return (
      <div className="mt-5">
         <BreadCrumb
            currentPage={`Incident Report`}
            prevPage={`Forms`}
            navigation={navigation}
         />
         <div className="pb-8 pt-4 px-4 max-w-xl mx-auto">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-8">
                  Incident Report
               </h1>
               <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Participant Details
                     </h3>

                     <Controller
                        name="participant"
                        control={control}
                        rules={{ required: 'Please select a participant' }}
                        render={({ field }) => (
                           <SearchableSelect
                              label="Select Participant"
                              value={field.value}
                              onChange={field.onChange}
                              onDepartmentChange={(dept) =>
                                 setValue('departmentName', dept)
                              }
                              showDepartment={true}
                              error={errors.participant?.message}
                           />
                        )}
                     />

                     <Controller
                        name="incidentOnProvisionOfService"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field }) => (
                           <Radio
                              {...field}
                              title="Did this incident occur during your visit with the participant?"
                              options={[
                                 { value: 'yes', label: 'Yes' },
                                 { value: 'no', label: 'No' },
                              ]}
                              error={
                                 errors.incidentOnProvisionOfService?.message
                              }
                              isOptionsAreVertical={false}
                              required
                           />
                        )}
                     />

                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Incident Details
                     </h3>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Controller
                           name="dateOfIncident"
                           control={control}
                           rules={{ required: 'Date of incident is required' }}
                           render={({ field }) => (
                              <Text
                                 {...field}
                                 type="date"
                                 label="Date of the Incident"
                                 onKeyDown={(e) => e.preventDefault()}
                                 max={new Date().toISOString().split('T')[0]}
                                 error={errors.dateOfIncident?.message}
                                 required
                              />
                           )}
                        />
                        <Controller
                           name="timeOfIncident"
                           control={control}
                           rules={{ required: 'Time of incident is required' }}
                           render={({ field }) => (
                              <Text
                                 {...field}
                                 type="time"
                                 label="Time of the Incident"
                                 error={errors.timeOfIncident?.message}
                                 required
                              />
                           )}
                        />
                     </div>

                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Exact Location of the Incident
                     </h3>

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

                     <Controller
                        name="isStaffBehaviourInvolved"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field }) => (
                           <Radio
                              {...field}
                              title="Did this incident involve behaviour from a staff member that may constitute exploitation, abuse, neglect, or sexual harassment?"
                              options={[
                                 { value: 'Yes', label: 'Yes' },
                                 { value: 'No', label: 'No' },
                                 { value: 'Unsure', label: 'Unsure' },
                              ]}
                              onExtraChange={() => {
                                 setValue('typeOfConcern', '');
                                 setValue('otherTypeOfConcern', '');
                              }}
                              error={errors.isStaffBehaviourInvolved?.message}
                              isOptionsAreVertical={true}
                              required
                           />
                        )}
                     />

                     {(watchisStaffBehaviourInvolved === 'Yes' ||
                        watchisStaffBehaviourInvolved === 'Unsure') && (
                        <>
                           <Controller
                              name="typeOfConcern"
                              control={control}
                              rules={{
                                 required:
                                    'Please select at least one concern type',
                                 validate: (value) =>
                                    (Array.isArray(value) &&
                                       value.length > 0) ||
                                    'Please select at least one concern type',
                              }}
                              render={({ field }) => (
                                 <Checkbox
                                    {...field}
                                    title="Please indicate the type of concern"
                                    options={[
                                       {
                                          value: 'Exploitation',
                                          label: 'Exploitation',
                                       },
                                       {
                                          value: 'Abuse (physical, emotional, or psychological)',
                                          label: 'Abuse (physical, emotional, or psychological)',
                                       },
                                       { value: 'Neglect', label: 'Neglect' },
                                       {
                                          value: 'Sexual harassment or sexual misconduct',
                                          label: 'Sexual harassment or sexual misconduct',
                                       },
                                       {
                                          value: 'Inappropriate conduct or behaviour',
                                          label: 'Inappropriate conduct or behaviour',
                                       },
                                       { value: 'Other', label: 'Other' },
                                    ]}
                                    error={errors.typeOfConcern?.message}
                                    isOptionsAreVertical={true}
                                    required
                                 />
                              )}
                           />

                           {watchTypeOfConcern?.includes('Other') && (
                              <Controller
                                 name="otherTypeOfConcern"
                                 control={control}
                                 rules={{
                                    required:
                                       'Please specify what "Other" refers to',
                                 }}
                                 render={({ field }) => (
                                    <Text
                                       label="Please specify the other type of concern"
                                       placeholder="Specify what 'Other' refers to"
                                       {...field}
                                       error={
                                          errors.otherTypeOfConcern?.message
                                       }
                                       required
                                    />
                                 )}
                              />
                           )}
                        </>
                     )}

                     <div className="border border-gray-200 px-2 py-1 rounded-md">
                        {isLoadingStaff ? (
                           <div className="text-sm text-gray-500 py-2">
                              Loading staff members...
                           </div>
                        ) : (
                           <Controller
                              name="involvedStaff"
                              control={control}
                              render={({ field }) => (
                                 <Select
                                    isSearchable
                                    {...field}
                                    onChange={(value) => {
                                       field.onChange(value);
                                    }}
                                    label="Select Staff Member(s)"
                                    options={staffOptions}
                                    error={errors?.relatedStaff?.message}
                                    multiple={false}
                                 />
                              )}
                           />
                        )}
                     </div>

                     <Controller
                        name="hasWitnesses"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field }) => (
                           <Radio
                              {...field}
                              title="Were there any witnesses?"
                              options={[
                                 { value: 'Yes', label: 'Yes' },
                                 { value: 'No', label: 'No' },
                              ]}
                              onExtraChange={() => {
                                 setValue('witnessDetails', '');
                              }}
                              error={errors.hasWitnesses?.message}
                              isOptionsAreVertical={true}
                              required
                           />
                        )}
                     />

                     {watchHasWitnesses === 'Yes' && (
                        <Controller
                           name="witnessDetails"
                           control={control}
                           rules={{
                              required: 'Please specify the witness details',
                           }}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="Please list the witnesses' full names as well as a contact number for each"
                                 placeholder="Enter details"
                                 error={errors.witnessDetails?.message}
                                 required
                              />
                           )}
                        />
                     )}

                     <Controller
                        name="incidentDescription"
                        control={control}
                        rules={{
                           required: 'Please specify the incident description',
                        }}
                        render={({ field }) => (
                           <Textarea
                              {...field}
                              label="Describe how the incident occurred and if there was any damage to property or equipment"
                              placeholder="Enter details"
                              error={errors.incidentDescription?.message}
                              required
                           />
                        )}
                     />

                     <Controller
                        name="resultedInInjury"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field }) => (
                           <Radio
                              {...field}
                              title="Did this incident result in an injury?"
                              options={[
                                 { value: 'Yes', label: 'Yes' },
                                 { value: 'No', label: 'No' },
                              ]}
                              onExtraChange={() => {
                                 setValue('natureOfInjury', '');
                                 setValue('treatmentProvided', '');
                                 setValue('equipmentInvolved', '');
                                 setValue('equipmentDetails', '');
                              }}
                              error={errors.resultedInInjury?.message}
                              isOptionsAreVertical={true}
                              required
                           />
                        )}
                     />

                     {watchResultedInInjury === 'Yes' && (
                        <>
                           <Controller
                              name="natureOfInjury"
                              control={control}
                              rules={{
                                 required: 'Nature of injury is required',
                              }}
                              render={({ field }) => (
                                 <Textarea
                                    {...field}
                                    label="Nature of injury e.g., sprain, cut, burn"
                                    placeholder="Enter details"
                                    error={errors.natureOfInjury?.message}
                                    required
                                 />
                              )}
                           />

                           <Controller
                              name="treatmentProvided"
                              control={control}
                              rules={{
                                 required: 'Treatment details are required',
                              }}
                              render={({ field }) => (
                                 <Textarea
                                    {...field}
                                    label="Was any treatment provided?"
                                    placeholder="If yes, please provide details (e.g., first aid given by who, referred to e.g. GP)"
                                    error={errors.treatmentProvided?.message}
                                    required
                                 />
                              )}
                           />

                           <Controller
                              name="equipmentInvolved"
                              control={control}
                              rules={{ required: 'This field is required' }}
                              render={({ field }) => (
                                 <Radio
                                    {...field}
                                    title="Was any equipment involved in the injury?"
                                    options={[
                                       { value: 'Yes', label: 'Yes' },
                                       { value: 'No', label: 'No' },
                                    ]}
                                    onExtraChange={() => {
                                       setValue('equipmentDetails', '');
                                    }}
                                    error={errors.equipmentInvolved?.message}
                                    isOptionsAreVertical={true}
                                    required
                                 />
                              )}
                           />

                           {watchEquipmentInvolved === 'Yes' && (
                              <Controller
                                 name="equipmentDetails"
                                 control={control}
                                 rules={{
                                    required: 'Equipment details are required',
                                 }}
                                 render={({ field }) => (
                                    <Textarea
                                       {...field}
                                       label="Provide Details"
                                       placeholder="Details of the equipment involved"
                                       error={errors.equipmentDetails?.message}
                                       required
                                    />
                                 )}
                              />
                           )}
                        </>
                     )}

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
                              onExtraChange={() => {
                                 setValue('evidences', '');
                              }}
                              error={errors.hasEvidence?.message}
                              isOptionsAreVertical={true}
                           />
                        )}
                     />

                     {hasEvidenceValue && (
                        <Controller
                           name="evidences"
                           control={control}
                           rules={{
                              required: 'At least one photo is required',
                           }}
                           render={({ field: { onChange, value } }) => (
                              <File
                                 value={value}
                                 onChange={onChange}
                                 title="Upload Photos"
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
                                 error={errors.evidences?.message}
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
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                        {isSubmitting
                           ? 'Submitting...'
                           : 'Submit Incident Report'}
                     </button>
                  </form>
               </FormProvider>
            </div>
         </div>
      </div>
   );
}
