import axiosInstance from '@api/axiosInstance';
import { Checkbox, Radio, Textarea } from '@components/reusable/FormInputs';
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
         isAnonymous: '',
         name: '',
         position: '',
         department: '',
         contact: '',
         feedbackTopics: [],
         feedbackMessage: '',
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

   const isAnonymousValue = watch('isAnonymous');
   const declarationValue = watch('declaration');

   const onSubmit = async (data) => {
      if (!data.signature) {
         toast.error('Signature is required');
         return;
      }

      if (
         !data.isAnonymous ||
         data.feedbackTopics.length === 0 ||
         !data.feedbackMessage
      ) {
         toast.error('Please fill in all required fields');
         return;
      }

      if (data.isAnonymous === 'no') {
         if (
            !data.name ||
            !data.position ||
            !data.department ||
            !data.contact
         ) {
            toast.error('Please fill in your personal details');
            return;
         }
      }

      const formData = new FormData();

      formData.append('isAnonymous', data.isAnonymous === 'yes');

      if (data.isAnonymous === 'no') {
         formData.append('name', data.name);
         formData.append('position', data.position);
         formData.append('department', data.department);
         formData.append('contact', data.contact);
      }

      data.feedbackTopics.forEach((topic) => {
         formData.append('feedbackTopics[]', topic);
      });

      formData.append('feedbackMessage', data.feedbackMessage);
      formData.append('signature', data.signature);

      try {
         const response = await axiosInstance.post(
            '/staff-feedback',
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
                     name="isAnonymous"
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
                           error={errors.isAnonymous?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {isAnonymousValue === 'no' && (
                     <div className="border border-gray-200 px-4 py-4 rounded-md space-y-4">
                        <Controller
                           name="name"
                           control={control}
                           rules={{ required: 'Name is required' }}
                           render={({ field }) => (
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                 </label>
                                 <input
                                    {...field}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your name"
                                 />
                                 {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">
                                       {errors.name.message}
                                    </p>
                                 )}
                              </div>
                           )}
                        />

                        <Controller
                           name="position"
                           control={control}
                           rules={{ required: 'Position is required' }}
                           render={({ field }) => (
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Position{' '}
                                    <span className="text-red-500">*</span>
                                 </label>
                                 <input
                                    {...field}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your position"
                                 />
                                 {errors.position && (
                                    <p className="text-sm text-red-600 mt-1">
                                       {errors.position.message}
                                    </p>
                                 )}
                              </div>
                           )}
                        />

                        <Controller
                           name="department"
                           control={control}
                           rules={{ required: 'Department is required' }}
                           render={({ field }) => (
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department{' '}
                                    <span className="text-red-500">*</span>
                                 </label>
                                 <input
                                    {...field}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your department"
                                 />
                                 {errors.department && (
                                    <p className="text-sm text-red-600 mt-1">
                                       {errors.department.message}
                                    </p>
                                 )}
                              </div>
                           )}
                        />

                        <Controller
                           name="contact"
                           control={control}
                           rules={{ required: 'Contact details are required' }}
                           render={({ field }) => (
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Details{' '}
                                    <span className="text-red-500">*</span>
                                 </label>
                                 <input
                                    {...field}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your contact details"
                                 />
                                 {errors.contact && (
                                    <p className="text-sm text-red-600 mt-1">
                                       {errors.contact.message}
                                    </p>
                                 )}
                              </div>
                           )}
                        />
                     </div>
                  )}

                  <Controller
                     name="feedbackTopics"
                     control={control}
                     rules={{
                        required: 'Please select at least one topic',
                        validate: (value) =>
                           value.length > 0 ||
                           'Please select at least one topic',
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
                           error={errors.feedbackTopics?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="feedbackMessage"
                     control={control}
                     rules={{ required: 'Feedback message is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Please share your feedback or suggestion"
                           placeholder="What's working well? What could be improved?"
                           error={errors.feedbackMessage?.message}
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
