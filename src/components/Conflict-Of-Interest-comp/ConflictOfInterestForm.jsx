import axiosInstance from '@api/axiosInstance';
import {
   DateSelection,
   Radio,
   Select,
   Textarea,
} from '@components/reusable/FormInputs';
import SearchableSelect from '@components/reusable/SearchableSelect';
import SignatureCanvas from '@components/travel-log/SignatureCanvas';
import useAllStaffsQuery from '@hooks/useAllStaffsQuery';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const ConflictOfInterestForm = () => {
   const navigate = useNavigate();
   const { data: staffMembers, isLoading: isLoadingStaff } =
      useAllStaffsQuery();

   const methods = useForm({
      defaultValues: {
         conflictType: '',

         staffRelations: [],

         participantRelations: [],
         description: '',
         involvement: '',
         timing: '',
         occurDate: '',
         declaration: false,
         signature: '',
      },
   });

   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = methods;

   const declarationValue = watch('declaration');
   const timingValue = watch('timing');

   const conflictTypeValue = watch('conflictType');

   const staffOptions =
      staffMembers?.map((staff) => ({
         value: staff._id,
         label: staff.name,
      })) || [];

   const onSubmit = async (data) => {
      // Validate signature
      if (!data.signature) {
         toast.error('Signature is required');
         return;
      }
      //    add other validation all fields
      if (
         !data.conflictType ||
         !data.description ||
         !data.involvement ||
         !data.timing
      ) {
         toast.error('Please fill in all required fields');
         return;
      }

      // Create FormData for file uploads
      const formData = new FormData();

      //    Append all form fields to FormData
      formData.append('conflictType', data.conflictType);
      formData.append('description', data.description);
      formData.append('involvement', data.involvement);
      formData.append('timing', data.timing);

      // Only append occurDate if it has a value
      if (data.occurDate) {
         formData.append('occurDate', data.occurDate);
      }

      if (data.staffRelations.length > 0) {
         data.staffRelations.forEach((staffId) => {
            formData.append('staffRelations[]', staffId);
         });
      }
      if (data.participantRelations.length > 0) {
         data.participantRelations.forEach((participantId) => {
            formData.append('participantRelations[]', participantId);
         });
      }

      formData.append('signature', data.signature);
      try {
         const response = await axiosInstance.post('/conflicts', formData, {
            headers: {
               conflicts: 'multipart/form-data',
            },
         });
         if (response?.data?.success) {
            toast.success('Conflict of Interest form submitted successfully');

            methods.reset();
            navigate('/forms');
         }
      } catch (error) {
         console.error('Error submitting form:', error);
         toast.error(
            'An error occurred while submitting the form. Please try again.'
         );
      }
   };

   return (
      <div>
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                     Conflict of Interest Form
                  </h2>
                  {/* Form Fields Here */}
                  {/* conflictType */}
                  <Controller
                     name="conflictType"
                     control={control}
                     rules={{ required: 'Conflict type is required' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Which of the following best describes the situation?"
                           onExtraChange={() => {
                              setValue('staffRelations', '');
                              setValue('participantRelations', '');
                           }}
                           options={[
                              {
                                 value: 'Outside employment or business interests',
                                 label: 'Outside employment or business interests',
                              },
                              {
                                 value: 'Financial interest in another organisation',
                                 label: 'Financial interest in another organisation',
                              },
                              {
                                 value: 'Personal or close relationships with staff',
                                 label: 'Personal or close relationships with staff',
                              },
                              {
                                 value: 'Personal or close relationships with Participant',
                                 label: 'Personal or close relationships with Participant',
                              },
                              {
                                 value: 'Supporting or managing someone you know',
                                 label: 'Supporting or managing someone you know',
                              },
                              {
                                 value: 'Gifts, benefits, or hospitality',
                                 label: 'Gifts, benefits, or hospitality',
                              },
                              {
                                 value: 'Confidentiality or information access',
                                 label: 'Confidentiality or information access',
                              },
                              {
                                 value: 'Decision making or use of authority',
                                 label: 'Decision making or use of authority',
                              },
                              { value: 'Others', label: 'Others' },
                           ]}
                           error={errors.conflictType?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {conflictTypeValue ===
                     'Personal or close relationships with staff' && (
                     <div className="border border-gray-200 px-2 py-1 rounded-md">
                        {isLoadingStaff ? (
                           <div className="text-sm text-gray-500 py-2">
                              Loading staff members...
                           </div>
                        ) : (
                           <Controller
                              name="staffRelations"
                              control={control}
                              rules={{
                                 required: 'Please select a Staff',
                                 validate: (value) => {
                                    if (!value) {
                                       return 'Staff selection is required';
                                    }
                                    return true;
                                 },
                              }}
                              render={({ field }) => (
                                 <Select
                                    {...field}
                                    onChange={(value) => {
                                       field.onChange(value);
                                    }}
                                    label="Select Staff"
                                    options={staffOptions}
                                    error={errors?.staffRelations?.message}
                                    required
                                    multiple={true}
                                 />
                              )}
                           />
                        )}
                     </div>
                  )}

                  {/* participantRelations */}
                  {conflictTypeValue ===
                     'Personal or close relationships with Participant' && (
                     <Controller
                        name="participantRelations"
                        control={control}
                        rules={{ required: 'Please select a participant' }}
                        render={({ field }) => (
                           <SearchableSelect
                              label="Select Participant"
                              value={field.value}
                              onChange={field.onChange}
                              error={errors.participantRelations?.message}
                              multipleSelect={true}
                           />
                        )}
                     />
                  )}
                  {/* description */}

                  <Controller
                     name="description"
                     control={control}
                     rules={{ required: 'Description is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Please describe the conflict in your own words."
                           placeholder="(What happened or what might happen?)"
                           error={errors.description?.message}
                           required
                        />
                     )}
                  />

                  {/* involvement */}
                  <Controller
                     name="involvement"
                     control={control}
                     rules={{ required: 'Involvement is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Who is involved in this situation?"
                           placeholder="(Names of people and/or organisations, if known)"
                           error={errors.involvement?.message}
                           required
                        />
                     )}
                  />
                  {/* timing */}

                  <Controller
                     name="timing"
                     control={control}
                     rules={{ required: 'Timing is required' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="When did this occur, or when might it occur?"
                           options={[
                              {
                                 value: 'already occurred',
                                 label: 'Already occurred',
                              },
                              {
                                 value: 'currently ongoing',
                                 label: 'Currently ongoing',
                              },
                              {
                                 value: 'may occur',
                                 label: 'May occur in the future',
                              },
                           ]}
                           error={errors.timing?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* occurDate */}

                  {(timingValue === 'already occurred' ||
                     timingValue === 'currently ongoing') && (
                     <Controller
                        name="occurDate"
                        control={control}
                        rules={{ required: 'Occur date is required' }}
                        render={({ field }) => (
                           <DateSelection
                              label="Date"
                              {...field}
                              placeholder="Select date"
                              error={errors.occurDate?.message}
                              maxDate={new Date().toISOString()}
                              required
                           />
                        )}
                     />
                  )}
                  {/* declaration */}
                  <Controller
                     name="declaration"
                     control={control}
                     rules={{ required: 'Declaration is required' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Declaration Statement "
                           options={[
                              {
                                 value: true,
                                 label: 'I confirm that the information provided is true and complete to the best of my knowledge. I understand that I must notify Decent Care if this situation changes.',
                              },
                           ]}
                           error={errors.declaration?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* signature */}
                  {declarationValue && (
                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                           Signature <span className="text-red-500">*</span>
                        </label>
                        <SignatureCanvas
                           onSignatureChange={(signatureData) =>
                              setValue('signature', signatureData)
                           }
                        />
                        {errors.signature && (
                           <p className="text-sm text-red-600">
                              {errors.signature.message}
                           </p>
                        )}
                     </div>
                  )}
                  <div className="pt-4">
                     <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                     >
                        Submit Conflict of Interest Form
                     </button>
                  </div>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default ConflictOfInterestForm;
