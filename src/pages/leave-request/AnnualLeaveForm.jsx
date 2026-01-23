import axiosInstance from '@api/axiosInstance';
import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import { DateSelection, Text } from '@components/reusable/FormInputs';
import useGetCanLeave from '@hooks/leave/useGetCanLeave';
import useGetLeaveBalance from '@hooks/leave/useGetLeaveBalance';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const AnnualLeaveForm = () => {
   const navigate = useNavigate();
   const [submitError, setSubmitError] = useState('');

   const {
      data: leaveBalanceData,
      isLoading,
      error: leaveBalanceError,
   } = useGetLeaveBalance();

   const navigation = () => navigate(`/work/leave-request/annual`);

   const methods = useForm({
      defaultValues: {
         leaveType: 'Annual Leave',
         startDate: '',
         endDate: '',
         hours: '',
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
         const response = await axiosInstance.post('/leaves', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         if (response.data.success) {
            toast.success('Annual leave request submitted successfully');
            reset();
            navigate('/work/leave-request/annual');
         } else {
            toast.error(
               response.data.message || 'Failed to submit annual leave request',
            );
         }
      } catch (error) {
         console.error('Error submitting annual leave request:', error);
         toast.error(
            error.response?.data?.message ||
               'An error occurred while submitting the request',
         );
         setSubmitError(
            error.response?.data?.message ||
               'An error occurred while submitting the request',
         );
      }
   };

   const watchStartDate = watch('startDate');
   const watchEndDate = watch('endDate');

   // ✅ API only runs when both dates selected
   const { data: apiData, isLoading: isCanLeaveLoading } = useGetCanLeave({
      start: watchStartDate,
      end: watchEndDate,
      type: 'Annual Leave',
   });

   return (
      <div className="">
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white space-y-4">
               <BreadCrumb
                  currentPage="Annual Leave Form"
                  prevPage="Annual Leave"
                  navigation={navigation}
               />
               <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4 my-4 ">
                  {JSON.parse(localStorage.getItem('user_data'))?.user?.name ||
                     'User Name'}
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="text-base font-semibold text-[#3086F3] bg-[#C7DFFF] border border-[#3086F3] rounded-lg p-4 text-center">
                     {leaveBalanceData?.annualLeave?.available || 0} h Balance
                  </div>
                  <div className="text-base font-semibold text-[#C7DFFF] bg-[#3086F3] border border-[#3086F3] rounded-lg p-4 text-center">
                     {apiData?.leaveHours || 0} h Used
                  </div>
               </div>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Controller
                     name="startDate"
                     control={control}
                     rules={{ required: 'Start date is required' }}
                     render={({ field }) => (
                        <DateSelection
                           label="Start Date"
                           {...field}
                           placeholder="Select date"
                           error={errors.startDate?.message}
                           minDate={
                              new Date(
                                 new Date().setMonth(new Date().getMonth() + 1),
                              )
                           }
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
                           label="End Date"
                           {...field}
                           placeholder="Select date"
                           error={errors.endDate?.message}
                           minDate={
                              new Date(
                                 new Date().setMonth(new Date().getMonth() + 1),
                              )
                           }
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

                  {/* after post request from the post error error.response?.data?.message can show here */}
                  {submitError && (
                     <p className="text-red-600 font-medium">{submitError}</p>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {isSubmitting
                           ? 'Submitting...'
                           : 'Submit Annual Leave Request'}
                     </button>
                  </div>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default AnnualLeaveForm;
