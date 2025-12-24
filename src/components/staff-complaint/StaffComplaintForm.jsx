import axiosInstance from '@api/axiosInstance';
import {
   Checkbox,
   DateSelection,
   Radio,
   Select,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import SignatureCanvas from '@components/travel-log/SignatureCanvas';
import NavigateButton from '@components/ui/NavigateButton';

import useAllStaffsQuery from '@hooks/useAllStaffsQuery';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const StaffComplaintForm = () => {
   const navigate = useNavigate();
   const { data: staffMembers, isLoading: isLoadingStaff } =
      useAllStaffsQuery();

   const methods = useForm({
      defaultValues: {
         remainAnonymous: '',
         complaintCategories: [],
         complaintOtherText: '',
         relatedStaff: [],
         complaintDescription: '',
         incidentDate: '',
         incidentTime: '',
         witnessAvailable: '',
         witnessDetails: '',
         hasEvidence: '',
         evidenceFiles: [],
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

   const remainAnonymousValue = watch('remainAnonymous');
   const declarationValue = watch('declaration');
   const complaintCategoriesValue = watch('complaintCategories');
   const witnessAvailableValue = watch('witnessAvailable');
   const hasEvidenceValue = watch('hasEvidence');

   const staffOptions =
      staffMembers?.map((staff) => ({
         value: staff._id,
         label: staff.name,
      })) || [];

   const onSubmit = async (data) => {
      if (!data.signature) {
         toast.error('Signature is required');
         return;
      }

      if (
         !data.remainAnonymous ||
         data.complaintCategories.length === 0 ||
         !data.complaintDescription ||
         !data.incidentDate ||
         !data.witnessAvailable ||
         !data.hasEvidence
      ) {
         toast.error('Please fill in all required fields');
         return;
      }

      if (
         data.complaintCategories.includes('Other') &&
         !data.complaintOtherText
      ) {
         toast.error('Please specify what "Other" refers to');
         return;
      }

      if (data.witnessAvailable === 'yes' && !data.witnessDetails) {
         toast.error('Please provide witness details');
         return;
      }

      const formData = new FormData();

      formData.append('type', 'Complaint');
      formData.append('remainAnonymous', data.remainAnonymous === 'yes');

      data.complaintCategories.forEach((category) => {
         formData.append('complaintCategories[]', category);
      });

      if (data.complaintOtherText) {
         formData.append('complaintOtherText', data.complaintOtherText);
      }

      if (data.relatedStaff.length > 0) {
         data.relatedStaff.forEach((staffId) => {
            formData.append('relatedStaff[]', staffId);
         });
      }

      formData.append('complaintDescription', data.complaintDescription);
      formData.append('incidentDate', data.incidentDate);

      if (data.incidentTime) {
         formData.append('incidentTime', data.incidentTime);
      }

      formData.append('witnessAvailable', data.witnessAvailable === 'yes');
      if (data.witnessAvailable === 'yes' && data.witnessDetails) {
         formData.append('witnessDetails', data.witnessDetails);
      }

      formData.append('hasEvidence', data.hasEvidence === 'yes');
      if (data.hasEvidence === 'yes' && data.evidenceFiles.length > 0) {
         data.evidenceFiles.forEach((file) => {
            formData.append('evidenceFiles', file);
         });
      }

      formData.append('signature', data.signature);

      try {
         const response = await axiosInstance.post(
            '/staff-complaints',
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         );

         if (response?.data?.success) {
            toast.success('Complaint submitted successfully');
            methods.reset();
            navigate('/work/staff-complaint');
         }
      } catch (error) {
         console.error('Error submitting form:', error);
         toast.error(
            'An error occurred while submitting the form. Please try again.'
         );
      }
   };

   return (
      <div className="py-8 px-4 max-w-xl mx-auto">
         <NavigateButton
            navigateUrl="/work/staff-complaint"
            title="Back to staff complaint page"
            icon={ArrowLeft}
            iconPosition="left"
         />
         <div>
            <FormProvider {...methods}>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                     Staff Complaint Form
                  </h2>

                  <Controller
                     name="remainAnonymous"
                     control={control}
                     rules={{ required: 'Please select an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Do you wish to remain anonymous?"
                           options={[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' },
                           ]}
                           error={errors.remainAnonymous?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="complaintCategories"
                     control={control}
                     rules={{
                        required: 'Please select at least one category',
                        validate: (value) =>
                           value.length > 0 ||
                           'Please select at least one category',
                     }}
                     render={({ field }) => (
                        <Checkbox
                           {...field}
                           title="What is your complaint related to? (Select all that apply)"
                           options={[
                              {
                                 value: 'Workplace behaviour or conduct',
                                 label: 'Workplace behaviour or conduct',
                              },
                              {
                                 value: 'Bullying, harassment, or discrimination',
                                 label: 'Bullying, harassment, or discrimination',
                              },
                              {
                                 value: 'Management or supervision',
                                 label: 'Management or supervision',
                              },
                              {
                                 value: 'Workload, rostering, or fatigue',
                                 label: 'Workload, rostering, or fatigue',
                              },
                              {
                                 value: 'Policy or procedure breach',
                                 label: 'Policy or procedure breach',
                              },
                              {
                                 value: 'Health and safety concern',
                                 label: 'Health and safety concern',
                              },
                              {
                                 value: 'Ethical concern or conflict of interest',
                                 label: 'Ethical concern or conflict of interest',
                              },
                              {
                                 value: 'Regarding a team member, manager or any member in the company',
                                 label: 'Regarding a team member, manager or any member in the company',
                              },
                              { value: 'Other', label: 'Other' },
                           ]}
                           error={errors.complaintCategories?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {complaintCategoriesValue.includes('Other') && (
                     <Controller
                        name="complaintOtherText"
                        control={control}
                        rules={{
                           required: 'Please specify what "Other" refers to',
                        }}
                        render={({ field }) => (
                           <Text
                              label="Please specify the other feedback"
                              placeholder="Specify what 'Other' refers to"
                              {...field}
                              error={errors.complaintOtherText?.message}
                              required
                           />
                        )}
                     />
                  )}

                  {complaintCategoriesValue.includes(
                     'Regarding a team member, manager or any member in the company'
                  ) && (
                     <div className="border border-gray-200 px-2 py-1 rounded-md">
                        {isLoadingStaff ? (
                           <div className="text-sm text-gray-500 py-2">
                              Loading staff members...
                           </div>
                        ) : (
                           <Controller
                              name="relatedStaff"
                              control={control}
                              render={({ field }) => (
                                 <Select
                                    {...field}
                                    onChange={(value) => {
                                       field.onChange(value);
                                    }}
                                    label="Select Staff Member(s)"
                                    options={staffOptions}
                                    error={errors?.relatedStaff?.message}
                                    multiple={true}
                                 />
                              )}
                           />
                        )}
                     </div>
                  )}

                  <Controller
                     name="complaintDescription"
                     control={control}
                     rules={{ required: 'Complaint description is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Please describe the complaint in detail"
                           placeholder="Include what happened, who was involved, and any relevant context."
                           error={errors.complaintDescription?.message}
                           required
                        />
                     )}
                  />

                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        When did this occur?{' '}
                        <span className="text-red-500">*</span>
                     </label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                           name="incidentDate"
                           control={control}
                           rules={{ required: 'Date is required' }}
                           render={({ field }) => (
                              <DateSelection
                                 label="Date"
                                 {...field}
                                 placeholder="Select date"
                                 error={errors.incidentDate?.message}
                                 maxDate={new Date().toISOString()}
                                 required
                              />
                           )}
                        />

                        <Controller
                           name="incidentTime"
                           control={control}
                           render={({ field }) => (
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time (optional)
                                 </label>
                                 <input
                                    {...field}
                                    type="time"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 />
                              </div>
                           )}
                        />
                     </div>
                  </div>

                  <Controller
                     name="witnessAvailable"
                     control={control}
                     rules={{ required: 'Please select an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Were there any witnesses?"
                           options={[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' },
                           ]}
                           error={errors.witnessAvailable?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {witnessAvailableValue === 'yes' && (
                     <Controller
                        name="witnessDetails"
                        control={control}
                        rules={{ required: 'Witness details are required' }}
                        render={({ field }) => (
                           <Textarea
                              {...field}
                              label="Provide the details of the witnesses"
                              placeholder="Names and contact information of witnesses"
                              error={errors.witnessDetails?.message}
                              required
                           />
                        )}
                     />
                  )}

                  <Controller
                     name="hasEvidence"
                     control={control}
                     rules={{ required: 'Please select an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Do you have any evidence to upload?"
                           options={[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' },
                           ]}
                           error={errors.hasEvidence?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {hasEvidenceValue === 'yes' && (
                     <Controller
                        name="evidenceFiles"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Upload Evidence
                              </label>
                              <input
                                 {...field}
                                 type="file"
                                 multiple
                                 onChange={(e) => {
                                    const files = Array.from(
                                       e.target.files || []
                                    );
                                    onChange(files);
                                 }}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {value && value.length > 0 && (
                                 <p className="text-sm text-gray-600 mt-1">
                                    {value.length} file(s) selected
                                 </p>
                              )}
                           </div>
                        )}
                     />
                  )}

                  <Controller
                     name="declaration"
                     control={control}
                     rules={{ required: 'Declaration is required' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Declaration Statement"
                           options={[
                              {
                                 value: true,
                                 label: 'I confirm that the information provided is true and complete to the best of my knowledge.',
                              },
                           ]}
                           error={errors.declaration?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

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
                        Submit Complaint
                     </button>
                  </div>
               </form>
            </FormProvider>
         </div>
      </div>
   );
};

export default StaffComplaintForm;
