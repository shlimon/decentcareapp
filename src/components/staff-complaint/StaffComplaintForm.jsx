import axiosInstance from '@api/axiosInstance';
import {
   Checkbox,
   DateSelection,
   File,
   Radio,
   Select,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import NavigateButton from '@components/ui/NavigateButton';
import useAllStaffsQuery from '@hooks/useAllStaffsQuery';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const StaffComplaintForm = () => {
   const navigate = useNavigate();
   const { data: staffMembers, isLoading: isLoadingStaff } = useAllStaffsQuery();

   const methods = useForm({
      defaultValues: {
         remainAnonymous: '',
         categories: [],
         complaintOtherText: '',
         relatedStaff: [],
         complaintDescription: '',
         occurDate: '',
         occurTime: '',
         witnessAvailable: '',
         witnessDetails: '',
         hasEvidence: '',
         evidenceFiles: [],
      },
   });

   const {
      handleSubmit,
      control,
      watch,
      formState: { errors, isSubmitting },
   } = methods;

   const categoriesValue = watch('categories');
   const witnessAvailableValue = watch('witnessAvailable');
   const hasEvidenceValue = watch('hasEvidence');

   const staffOptions =
      staffMembers?.map((staff) => ({
         value: staff._id,
         label: staff.name,
      })) || [];

   const onSubmit = async (data) => {
      try {
         // Validate required fields
         if (
            !data.remainAnonymous ||
            data.categories.length === 0 ||
            !data.complaintDescription ||
            !data.occurDate ||
            !data.witnessAvailable ||
            !data.hasEvidence
         ) {
            toast.error('Please fill in all required fields');
            return;
         }

         if (data.categories.includes('Other') && !data.complaintOtherText) {
            toast.error('Please specify what "Other" refers to');
            return;
         }

         if (data.witnessAvailable === 'yes' && !data.witnessDetails) {
            toast.error('Please provide witness details');
            return;
         }

         // Build base payload
         const payload = {
            type: 'Complaint',
            remainAnonymous: data.remainAnonymous === 'yes',
            categories: data.complaintOtherText
               ? [
                  ...data.categories,
                  data.complaintOtherText && data.complaintOtherText,
               ]
               : data.categories,
            relatedStaff: data.relatedStaff.length > 0 ? data.relatedStaff : null,
            complaintDescription: data.complaintDescription,
            occurDate: data.occurDate
               ? new Date(data.occurDate).toISOString()
               : null,
            occurTime: data.occurTime || null,
            witnessAvailable: data.witnessAvailable === 'yes',
            witnessDetails:
               data.witnessAvailable === 'yes' ? data.witnessDetails : null,
            hasEvidence: data.hasEvidence === 'yes',
         };

         // Decide request type
         const hasFiles =
            data.hasEvidence === 'yes' &&
            data.evidenceFiles &&
            data.evidenceFiles.length > 0;

         let response;

         // Clean or remove empty values
         const cleanPayload = removeEmptyValues(payload);

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
            data.evidenceFiles.forEach((file) => {
               formData.append('evidenceFiles', file);
            });

            response = await axiosInstance.post('/staff-complaints', formData, {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            });
         } else {
            // application/json
            response = await axiosInstance.post('/staff-complaints', cleanPayload, {
               headers: {
                  'Content-Type': 'application/json',
               },
            });
         }

         // success handling
         if (response?.data?.success) {
            toast.success('Complaint submitted successfully');
            methods.reset();
            navigate('/work/staff-complaint');
         }
      } catch (error) {
         toast.error(
            error?.response?.data?.message || 'Submission Failed. Please try again.'
         );
         console.error('Error submitting complaint:', error);
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
                     name="categories"
                     control={control}
                     rules={{
                        required: 'Please select at least one category',
                        validate: (value) =>
                           value.length > 0 || 'Please select at least one category',
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
                                 value:
                                    'Regarding a team member, manager or any member in the company',
                                 label:
                                    'Regarding a team member, manager or any member in the company',
                              },
                              { value: 'Other', label: 'Other' },
                           ]}
                           error={errors.categories?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {categoriesValue.includes('Other') && (
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

                  {categoriesValue.includes(
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
                                       isSearchable
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
                        When did this occur? <span className="text-red-500">*</span>
                     </label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                           name="occurDate"
                           control={control}
                           rules={{ required: 'Date is required' }}
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

                        <Controller
                           name="occurTime"
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
                                 'pdf',
                                 'application/pdf',
                                 'docs/*',
                                 '.jpg',
                                 '.jpeg',
                                 '.png',
                              ]}
                              supportedFormats={['JPG', 'JPEG', 'PNG', 'PDF', 'DOCS']}
                              maxSize={10 * 1024 * 1024}
                              error={errors.evidenceFiles?.message}
                              multiple={true}
                              enableImageCropping={true}
                              required
                           />
                        )}
                     />
                  )}

                  <div className="pt-4">
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-60"
                     >
                        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                     </button>
                  </div>
               </form>
            </FormProvider>
         </div>
      </div>
   );
};

export default StaffComplaintForm;
