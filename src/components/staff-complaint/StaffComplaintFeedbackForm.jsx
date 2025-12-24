import axiosInstance from '@api/axiosInstance';
import {
   Checkbox,
   File,
   Radio,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import SignatureCanvas from '@components/travel-log/SignatureCanvas';
import NavigateButton from '@components/ui/NavigateButton';

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
         feedbackCategories: [],
         feedbackOtherText: '',
         feedbackText: '',
         declaration: false,
         hasEvidence: false,
         evidenceFiles: [],
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
   const feedbackCategoriesValue = watch('feedbackCategories');
   const hasEvidenceValue = watch('hasEvidence');

   const onSubmit = async (data) => {
      if (!data.signature) {
         toast.error('Signature is required');
         return;
      }

      if (
         !data.remainAnonymous ||
         data.feedbackCategories.length === 0 ||
         !data.feedbackText
      ) {
         toast.error('Please fill in all required fields');
         return;
      }

      if (
         data.feedbackCategories.includes('Other') &&
         !data.feedbackOtherText
      ) {
         toast.error('Please specify what "Other" refers to');
         return;
      }

      const formData = new FormData();

      formData.append('type', 'Feedback');
      formData.append('remainAnonymous', data.remainAnonymous === 'yes');

      data.feedbackCategories.forEach((category) => {
         formData.append('feedbackCategories[]', category);
      });

      if (data.feedbackOtherText) {
         formData.append('feedbackOtherText', data.feedbackOtherText);
      }

      formData.append('feedbackText', data.feedbackText);
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
            toast.success('Feedback submitted successfully');
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
                     name="feedbackCategories"
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
                           error={errors.feedbackCategories?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {feedbackCategoriesValue.includes('Other') && (
                     <Controller
                        name="feedbackOtherText"
                        control={control}
                        rules={{
                           required: 'Please specify what "Other" refers to',
                        }}
                        render={({ field }) => (
                           <Text
                              label="Please specify  the other feedback"
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

                  <div className="pt-4">
                     <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                     >
                        Submit Feedback
                     </button>
                  </div>
               </form>
            </FormProvider>
         </div>
      </div>
   );
};

export default StaffComplaintFeedbackForm;
