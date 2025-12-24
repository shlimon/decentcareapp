import axiosInstance from '@api/axiosInstance';
import {
   Checkbox,
   File,
   Radio,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import NavigateButton from '@components/ui/NavigateButton';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const StaffComplaintFeedbackForm = () => {
   const navigate = useNavigate();

   const methods = useForm({
      defaultValues: {
         remainAnonymous: '',
         categories: [],
         feedbackOtherText: '',
         feedbackText: '',
         hasEvidence: null,
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
   const hasEvidenceValue = watch('hasEvidence');

   const onSubmit = async (data) => {
      try {
         // Validate required fields
         if (
            !data.remainAnonymous ||
            data.categories.length === 0 ||
            !data.feedbackText
         ) {
            toast.error('Please fill in all required fields');
            return;
         }

         if (data.categories.includes('Other') && !data.feedbackOtherText) {
            toast.error('Please specify what "Other" refers to');
            return;
         }

         // Build base payload
         const payload = {
            type: 'Feedback',
            remainAnonymous: data.remainAnonymous === 'yes',
            categories: data.feedbackOtherText
               ? [
                  ...data.categories,
                  data.feedbackOtherText && data.feedbackOtherText,
               ]
               : data.categories,
            feedbackText: data.feedbackText,
            hasEvidence: data.hasEvidence,
         };

         // Decide request type
         const hasFiles =
            data.hasEvidence && data.evidenceFiles && data.evidenceFiles.length > 0;

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
            toast.success('Feedback submitted successfully');
            methods.reset();
            navigate('/work/staff-complaint');
         }
      } catch (error) {
         toast.error(
            error?.response?.data?.message || 'Submission Failed. Please try again.'
         );
         console.error('Error submitting feedback:', error);
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
                     Staff Feedback Form
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
                           title="What is your feedback about? (Select all that apply)"
                           options={[
                              {
                                 value: 'Workplace culture',
                                 label: 'Workplace culture',
                              },
                              {
                                 value: 'Systems or processes',
                                 label: 'Systems or processes',
                              },
                              {
                                 value: 'Communication',
                                 label: 'Communication',
                              },
                              { value: 'Management', label: 'Management' },
                              {
                                 value: 'Training or development',
                                 label: 'Training or development',
                              },
                              {
                                 value: 'Workload or rostering',
                                 label: 'Workload or rostering',
                              },
                              {
                                 value: 'Health, safety, or wellbeing',
                                 label: 'Health, safety, or wellbeing',
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
                        name="feedbackOtherText"
                        control={control}
                        rules={{
                           required: 'Please specify what "Other" refers to',
                        }}
                        render={({ field }) => (
                           <Text
                              label="Please specify the other feedback"
                              placeholder="Specify what 'Other' refers to"
                              {...field}
                              error={errors.feedbackOtherText?.message}
                              required
                           />
                        )}
                     />
                  )}

                  <Controller
                     name="feedbackText"
                     control={control}
                     rules={{ required: 'Feedback message is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Please share your feedback or suggestion"
                           placeholder="What's working well? What could be improved?"
                           error={errors.feedbackText?.message}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="hasEvidence"
                     control={control}
                     rules={{
                        validate: (value) =>
                           (value !== undefined && value !== null && value !== '') ||
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
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                     </button>
                  </div>
               </form>
            </FormProvider>
         </div>
      </div>
   );
};

export default StaffComplaintFeedbackForm;
