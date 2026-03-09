import axiosInstance from '@api/axiosInstance';
import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import { Checkbox, Textarea } from '@components/reusable/FormInputs';
import GoogleMapSearchBox from '@components/reusable/GoogleMapSearchBox/GoogleMapSearchBox';
import SearchableSelect from '@components/reusable/SearchableSelect';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function ParticipantIncident() {
   const navigate = useNavigate();
   const navigation = () => navigate(`/forms`);

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
         incidentEvidences: null,

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
      register,
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

   const onSubmit = async (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const incidentDate = new Date(data.dateOfIncident);
      incidentDate.setHours(0, 0, 0, 0);

      // Validate department selection
      if (!data.departmentName) {
         toast.error('Please select a department');
         return;
      }

      try {
         const formattedData = {
            participant: data.participant,
            departmentName: data.departmentName, // Include department in payload
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
            witnesses: data.hasWitnesses === 'yes',
            witnessDetails: data.witnessDetails || '',
            descriptionOfIncident: data.incidentDescription,
            didInjured: data.resultedInInjury === 'yes',
            treatmentProvided: data.treatmentProvided || '',
            natureOfInjury: data.natureOfInjury || '',
            equipmentInvolved: data.equipmentInvolved === 'yes',
            equipmentDetails: data.equipmentDetails || '',
         };

         const response = await axiosInstance.post(
            '/incident-reports',
            formattedData,
         );

         const result = response.data;

         if (result.success) {
            toast.success('Your incident has been submitted successfully!');
            reset();
            window.scrollTo(0, 0);
            navigate('/forms');
         } else {
            toast.error(
               result.message || 'Failed to submit report. Please try again.',
            );
         }
      } catch (err) {
         console.error(err);
         toast.error(
            'Network error. Please check your connection and try again.',
         );
      }
   };

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
                  <form onSubmit={handleSubmit(onSubmit)}>
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

                     <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Did this incident occur during your visit with the
                           participant? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-6">
                           <label className="flex items-center cursor-pointer">
                              <input
                                 type="radio"
                                 value="yes"
                                 {...register('incidentOnProvisionOfService', {
                                    required: 'This field is required',
                                 })}
                                 className="mr-2"
                              />
                              <span>Yes</span>
                           </label>
                           <label className="flex items-center cursor-pointer">
                              <input
                                 type="radio"
                                 value="no"
                                 {...register('incidentOnProvisionOfService', {
                                    required: 'This field is required',
                                 })}
                                 className="mr-2"
                              />
                              <span>No</span>
                           </label>
                        </div>
                        {errors.incidentOnProvisionOfService && (
                           <p className="mt-1 text-sm text-red-600">
                              {errors.incidentOnProvisionOfService.message}
                           </p>
                        )}
                     </div>

                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Incident Details
                     </h3>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date of the Incident{' '}
                              <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="date"
                              {...register('dateOfIncident', {
                                 required: 'Date of incident is required',
                              })}
                              onKeyDown={(e) => e.preventDefault()}
                              max={new Date().toISOString().split('T')[0]}
                              className={`w-full px-4 py-2 border ${
                                 errors.dateOfIncident
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                           />
                           {errors.dateOfIncident && (
                              <p className="mt-1 text-sm text-red-600">
                                 {errors.dateOfIncident.message}
                              </p>
                           )}
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Time of the Incident{' '}
                              <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="time"
                              {...register('timeOfIncident', {
                                 required: 'Time of incident is required',
                              })}
                              className={`w-full px-4 py-2 border ${
                                 errors.timeOfIncident
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                           />
                           {errors.timeOfIncident && (
                              <p className="mt-1 text-sm text-red-600">
                                 {errors.timeOfIncident.message}
                              </p>
                           )}
                        </div>
                     </div>

                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Exact Location of the Incidentt
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
                              title="Did this incident involve behaviour from a staff member that may constitute exploitation, abuse, neglect, or sexual harassment? "
                              options={[
                                 {
                                    value: 'Yes',
                                    label: 'Yes',
                                 },
                                 {
                                    value: 'No',
                                    label: 'No',
                                 },
                                 {
                                    value: 'Unsure',
                                    label: 'Unsure',
                                 },
                              ]}
                              error={errors.isStaffBehaviourInvolved?.message}
                              isOptionsAreVertical={true}
                              required
                           />
                        )}
                     />

                     {
                        watchisStaffBehaviourInvolved === 'Yes' || watchisStaffBehaviourInvolved === 'Unsure' && (
                            <Controller
                                                name="typeOfConcern"
                                                control={control}
                                                rules={{
                                                   required: 'Please select at least one concern type',
                                                   validate: (value) =>
                                                      value.length > 0 ||
                                                      'Please select at least one concern type',
                                                }}
                                                render={({ field }) => (
                                                   <Checkbox
                                                      {...field}
                                                      title="please indicate the type of concern"
                                                      options={[
                                                         {
                                                            value: 'Exploitation',
                                                            label: 'Exploitation',
                                                         },
                                                         {
                                                            value: 'Abuse (physical, emotional, or psychological)',
                                                            label: 'Abuse (physical, emotional, or psychological)',
                                                         },
                                                         {
                                                            value: 'Neglect',
                                                            label: 'Neglect',
                                                         },
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
                                                      error={errors.categories?.message}
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
                                                      required: 'Please specify what "Other" refers to',
                                                   }}
                                                   render={({ field }) => (
                                                      <Text
                                                         label="Please specify the other type of concern"
                                                         placeholder="Specify what 'Other' refers to"
                                                         {...field}
                                                         error={errors.otherTypeOfConcern?.message}
                                                         required
                                                      />
                                                   )}
                                                />
                                             )}


                        )
                     }

                     {/* <div className="my-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Were there any witnesses?{' '}
                           <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-6">
                           <label className="flex items-center cursor-pointer">
                              <input
                                 type="radio"
                                 value="yes"
                                 {...register('hasWitnesses', {
                                    required: 'This field is required',
                                 })}
                                 className="mr-2"
                              />
                              <span>Yes</span>
                           </label>
                           <label className="flex items-center cursor-pointer">
                              <input
                                 type="radio"
                                 value="no"
                                 {...register('hasWitnesses', {
                                    required: 'This field is required',
                                 })}
                                 className="mr-2"
                              />
                              <span>No</span>
                           </label>
                        </div>
                        {errors.hasWitnesses && (
                           <p className="mt-1 text-sm text-red-600">
                              {errors.hasWitnesses.message}
                           </p>
                        )}
                     </div> */}
                     <Controller
                        name="hasWitnesses"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field }) => (
                           <Radio
                              {...field}
                              title="Were there any witnesses?"
                              options={[
                                 {
                                    value: 'Yes',
                                    label: 'Yes',
                                 },
                                 {
                                    value: 'No',
                                    label: 'No',
                                 },
                                 
                              ]}
                              error={errors.hasWitnesses?.message}
                              isOptionsAreVertical={true}
                              required
                           />
                        )}
                     />




                     {watchHasWitnesses === 'yes' && (
                        // <div className="mb-6">
                        //    <label className="block text-sm font-medium text-gray-700 mb-2">
                        //       Please List the witnesses full names as well as a
                        //       contact number for each{' '}
                        //       <span className="text-red-500">*</span>
                        //    </label>
                        //    <textarea
                        //       {...register('witnessDetails', {
                        //          required:
                        //             watchHasWitnesses === 'yes'
                        //                ? 'Witness details are required'
                        //                : false,
                        //       })}
                        //       placeholder="Witness details"
                        //       className={`w-full px-4 py-2 border ${
                        //          errors.witnessDetails
                        //             ? 'border-red-500'
                        //             : 'border-gray-300'
                        //       } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        //       rows="4"
                        //    />
                        //    {errors.witnessDetails && (
                        //       <p className="mt-1 text-sm text-red-600">
                        //          {errors.witnessDetails.message}
                        //       </p>
                        //    )}
                        // </div>
                        <Controller
                                                name="witnessDetails"
                                                control={control}
                                                rules={{ required: 'Please specify the witness details' }}
                                                render={({ field }) => (
                                                   <Textarea
                                                      {...field}
                                                      label="Please List the witnesses full names as well as a contact number for each"
                                                      placeholder="Enter details"
                                                      error={errors.witnessDetails?.message}
                                                      required
                                                   />
                                                )}
                                             />
                     )}

                     {/* <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Describe how the incident occurred and if there was
                           any damage to property or equipment{' '}
                           <span className="text-red-500">*</span>
                        </label>
                        <textarea
                           {...register('incidentDescription', {
                              required: 'Incident description is required',
                           })}
                           placeholder="Describe the incident in detail"
                           className={`w-full px-4 py-2 border ${
                              errors.incidentDescription
                                 ? 'border-red-500'
                                 : 'border-gray-300'
                           } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                           rows="6"
                        />
                        {errors.incidentDescription && (
                           <p className="mt-1 text-sm text-red-600">
                              {errors.incidentDescription.message}
                           </p>
                        )}
                     </div> */}

                      <Controller
                                                name="incidentDescription"
                                                control={control}
                                                rules={{ required: 'Please specify the incident description' }}
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

                     {/* <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Did this incident result in an injury?{' '}
                           <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-6">
                           <label className="flex items-center cursor-pointer">
                              <input
                                 type="radio"
                                 value="yes"
                                 {...register('resultedInInjury', {
                                    required: 'This field is required',
                                 })}
                                 className="mr-2"
                              />
                              <span>Yes</span>
                           </label>
                           <label className="flex items-center cursor-pointer">
                              <input
                                 type="radio"
                                 value="no"
                                 {...register('resultedInInjury', {
                                    required: 'This field is required',
                                 })}
                                 className="mr-2"
                              />
                              <span>No</span>
                           </label>
                        </div>
                        {errors.resultedInInjury && (
                           <p className="mt-1 text-sm text-red-600">
                              {errors.resultedInInjury.message}
                           </p>
                        )}
                     </div> */}

                     
                     <Controller
                        name="resultedInInjury"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field }) => (
                           <Radio
                              {...field}
                              title="Did this incident result in an injury?"
                              options={[
                                 {
                                    value: 'Yes',
                                    label: 'Yes',
                                 },
                                 {
                                    value: 'No',
                                    label: 'No',
                                 },
                                 
                              ]}
                              error={errors.resultedInInjury?.message}
                              isOptionsAreVertical={true}
                              required
                           />
                        )}
                     />


                     {watchResultedInInjury === 'yes' && (
                        <>
                           <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Nature of injury e.g., sprain, cut, burn{' '}
                                 <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                 {...register('natureOfInjury', {
                                    required:
                                       watchResultedInInjury === 'yes'
                                          ? 'Nature of injury is required'
                                          : false,
                                 })}
                                 placeholder="Nature of injury"
                                 className={`w-full px-4 py-2 border ${
                                    errors.natureOfInjury
                                       ? 'border-red-500'
                                       : 'border-gray-300'
                                 } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                 rows="3"
                              />
                              {errors.natureOfInjury && (
                                 <p className="mt-1 text-sm text-red-600">
                                    {errors.natureOfInjury.message}
                                 </p>
                              )}
                           </div>

                           <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Was any treatment provided?{' '}
                                 <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                 {...register('treatmentProvided', {
                                    required:
                                       watchResultedInInjury === 'yes'
                                          ? 'Treatment details are required'
                                          : false,
                                 })}
                                 placeholder="If yes, please provide details (e.g., first aid given by who, referred to e.g. GP)"
                                 className={`w-full px-4 py-2 border ${
                                    errors.treatmentProvided
                                       ? 'border-red-500'
                                       : 'border-gray-300'
                                 } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                 rows="3"
                              />
                              {errors.treatmentProvided && (
                                 <p className="mt-1 text-sm text-red-600">
                                    {errors.treatmentProvided.message}
                                 </p>
                              )}
                           </div>

                           {/* <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Was any equipment involved in the injury?{' '}
                                 <span className="text-red-500">*</span>
                              </label>
                              <div className="flex gap-6">
                                 <label className="flex items-center cursor-pointer">
                                    <input
                                       type="radio"
                                       value="yes"
                                       {...register('equipmentInvolved', {
                                          required:
                                             watchResultedInInjury === 'yes'
                                                ? 'This field is required'
                                                : false,
                                       })}
                                       className="mr-2"
                                    />
                                    <span>Yes</span>
                                 </label>
                                 <label className="flex items-center cursor-pointer">
                                    <input
                                       type="radio"
                                       value="no"
                                       {...register('equipmentInvolved', {
                                          required:
                                             watchResultedInInjury === 'yes'
                                                ? 'This field is required'
                                                : false,
                                       })}
                                       className="mr-2"
                                    />
                                    <span>No</span>
                                 </label>
                              </div>
                              {errors.equipmentInvolved && (
                                 <p className="mt-1 text-sm text-red-600">
                                    {errors.equipmentInvolved.message}
                                 </p>
                              )}
                           </div> */}

                           <Controller
                        name="equipmentInvolved"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field }) => (
                           <Radio
                              {...field}
                              title="Was any equipment involved in the injury?"
                              options={[
                                 {
                                    value: 'Yes',
                                    label: 'Yes',
                                 },
                                 {
                                    value: 'No',
                                    label: 'No',
                                 },
                                 
                              ]}
                              error={errors.equipmentInvolved?.message}
                              isOptionsAreVertical={true}
                              required
                           />
                        )}
                     />


                           {watchEquipmentInvolved === 'yes' && (
                              <div className="mb-6">
                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Provide Details{' '}
                                    <span className="text-red-500">*</span>
                                 </label>
                                 <textarea
                                    {...register('equipmentDetails', {
                                       required:
                                          watchEquipmentInvolved === 'yes'
                                             ? 'Equipment details are required'
                                             : false,
                                    })}
                                    placeholder="Details of the equipment involved"
                                    className={`w-full px-4 py-2 border ${
                                       errors.equipmentDetails
                                          ? 'border-red-500'
                                          : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    rows="3"
                                 />
                                 {errors.equipmentDetails && (
                                    <p className="mt-1 text-sm text-red-600">
                                       {errors.equipmentDetails.message}
                                    </p>
                                 )}
                              </div>
                           )}
                        </>
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
