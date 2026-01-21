import axiosInstance from '@api/axiosInstance';
import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import {
   DateSelection,
   Select,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import FileInput from '@components/reusable/FormInputs/FileInput';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const SickLeaveForm = () => {
   const navigate = useNavigate();
   const navigation = () => navigate(`/work/leave-request/sick`);

   const methods = useForm({
      defaultValues: {
         leaveType: '',
         startDate: '',
         endDate: '',
         hours: '',
         reason: '',
         evidences: null,
      },
   });

   const {
      control,
      handleSubmit,
      reset,
      watch,
      formState: { errors, isSubmitting },
   } = methods;

   const onSubmit = async (data) => {
      try {
         if (!data.evidences || data.evidences.length === 0) {
            toast.error('Please upload at least one evidences file.');
            return;
         }

         const formData = new FormData();

         if (data.leaveType) {
            formData.append('leaveType', data.leaveType);
         }
         if (data.startDate) {
            formData.append('startDate', data.startDate);
         }
         if (data.endDate) {
            formData.append('endDate', data.endDate);
         }
         if (data.hours) {
            formData.append('hours', data.hours);
         }
         if (data.reason) {
            formData.append('reason', data.reason);
         }
         if (data.evidences && data.evidences.length > 0) {
            data.evidences.forEach((file) => {
               formData.append('evidences', file);
            });
         }

         const response = await axiosInstance.post('/leaves', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         if (response.data.success) {
            toast.success('Sick leave request submitted successfully!');
            reset();
            navigate('/work/leave-request/sick');
         } else {
            toast.error(
               'Failed to submit sick leave request. Please try again.',
            );
         }
      } catch (error) {
         console.error('Error submitting sick leave request:', error);
         toast.error('Failed to submit the form. Please try again.');
      }
   };

   const watchStartDate = watch('startDate');
   const watchEndDate = watch('endDate');

   return (
      <div className="">
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white space-y-4">
               <BreadCrumb
                  currentPage="Sick Leave Form"
                  prevPage="Sick Leave"
                  navigation={navigation}
               />

               <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                  {JSON.parse(localStorage.getItem('user_data'))?.user?.name ||
                     'User Name'}
               </div>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Controller
                     name="leaveType"
                     control={control}
                     rules={{ required: 'Leave type is required' }}
                     render={({ field }) => (
                        <Select
                           {...field}
                           label="Leave Type"
                           options={[
                              { value: 'Sick Leave', label: 'Sick Leave' },
                              {
                                 value: 'Personal Leave',
                                 label: 'Personal Leave',
                              },
                           ]}
                           error={errors.leaveType?.message}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="startDate"
                     control={control}
                     rules={{ required: 'Start date is required' }}
                     render={({ field }) => (
                        <DateSelection
                           label="Start date"
                           {...field}
                           placeholder="Select date"
                           error={errors.startDate?.message}
                           required
                        />
                     )}
                  />
                  <Controller
                     name="endDate"
                     control={control}
                     rules={{ required: 'End date is required' }}
                     render={({ field }) => (
                        <DateSelection
                           label="End date"
                           {...field}
                           placeholder="Select date"
                           error={errors.endDate?.message}
                           required
                        />
                     )}
                  />

                  {/* if watchStartDate and watchEndDate are same date then show hours input */}

                  {watchStartDate === watchEndDate && watchStartDate && (
                     <Controller
                        name="hours"
                        control={control}
                        rules={{
                           required: false,
                           validate: (value) => {
                              if (!value) return true; // allow empty
                              const num = Number(value);
                              if (isNaN(num) || num < 0) {
                                 return 'Please enter a valid number';
                              }
                              return true;
                           },
                        }}
                        render={({ field }) => (
                           <Text
                              label="Hours"
                              placeholder="Enter hours"
                              type="number"
                              min="0"
                              step="0.1"
                              {...field}
                              error={errors.hours?.message}
                           />
                        )}
                     />
                  )}
                  <Controller
                     name="reason"
                     control={control}
                     rules={{ required: 'Reason is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Reason for sick leave"
                           placeholder="Enter reason"
                           error={errors.reason?.message}
                           required
                        />
                     )}
                  />

                  {/* evidences */}
                  <Controller
                     name="evidences"
                     control={control}
                     rules={{ required: 'evidences is required' }}
                     render={({ field: { onChange, value } }) => (
                        <FileInput
                           value={value}
                           onChange={(file) => {
                              onChange(file);
                           }}
                           title="Upload Evidences"
                           description="Upload staff evidences (will be cropped)"
                           accept={['image/*', '.jpg', '.jpeg', '.png', '.pdf']}
                           supportedFormats={['JPG', 'JPEG', 'PNG', 'PDF']}
                           maxSize={10 * 1024 * 1024}
                           error={errors.evidences?.message}
                           multiple={true}
                           enableImageCropping={true}
                           required
                           disabled={isSubmitting}
                        />
                     )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {isSubmitting
                           ? 'Submitting...'
                           : 'Submit Leave Request'}
                     </button>
                  </div>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default SickLeaveForm;
