import axiosInstance from '@api/axiosInstance';
import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import {
   DateSelection,
   Select,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import FileInput from '@components/reusable/FormInputs/FileInput';
import useGetCanLeave from '@hooks/leave/useGetCanLeave';
import useGetLeaveBalance from '@hooks/leave/useGetLeaveBalance';
import { useQueryClient } from '@tanstack/react-query';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import LeaveValidationCard from './LeaveValidationCard';

const SickLeaveForm = () => {
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const [submitError, setSubmitError] = useState('');
   const navigation = () => navigate('/work/leave-request/sick');
   const { data, isLoading, error } = useGetLeaveBalance();

   // ✅ Tomorrow date (YYYY-MM-DD)
   const tomorrow = useMemo(() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date.toISOString().split('T')[0];
   }, []);

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
      setError,
      clearErrors,
      formState: { errors, isSubmitting },
   } = methods;

   const watchStartDate = watch('startDate');
   const watchEndDate = watch('endDate');

   // ✅ Prevent startDate > endDate
   useEffect(() => {
      if (watchStartDate && watchEndDate) {
         if (new Date(watchStartDate) > new Date(watchEndDate)) {
            setError('endDate', {
               type: 'manual',
               message: 'End date cannot be before start date',
            });
         } else {
            clearErrors('endDate');
         }
      }
   }, [watchStartDate, watchEndDate, setError, clearErrors]);

   // ✅ API only runs when both dates selected
   const { data: apiData, isLoading: isCanLeaveLoading } = useGetCanLeave({
      start: watchStartDate,
      end: watchEndDate,
   });

   const [isFileUploadNeeded, setIsFileUploadNeeded] = useState(false);

   useEffect(() => {
      if (apiData) {
         setIsFileUploadNeeded(apiData.needEvidence || false);
      }
   }, [apiData]);

   const onSubmit = async (data) => {
      try {
         if (
            isFileUploadNeeded &&
            (!data.evidences || data.evidences.length === 0)
         ) {
            toast.error('Please upload at least one evidence file.');
            return;
         }

         const formData = new FormData();

         Object.entries(data).forEach(([key, value]) => {
            if (!value) return;

            if (key === 'evidences') {
               value.forEach((file) => formData.append('evidences', file));
            } else {
               formData.append(key, value);
            }
         });

         const response = await axiosInstance.post('/leaves', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
         });

         if (response.data.success) {
            await queryClient.invalidateQueries({
               queryKey: ['my-leaves'],
            });
            toast.success('Sick leave request submitted successfully!');
            reset();
            navigate('/work/leave-request/sick');
         } else {
            toast.error('Failed to submit sick leave request.');
         }
      } catch (error) {
         toast.error(
            error?.response?.data?.message || 'Failed to submit the form.',
         );
         setSubmitError(
            error?.response?.data?.message || 'Failed to submit the form.',
         );
      }
   };

   return (
      <FormProvider {...methods}>
         <div className="py-8 px-4 max-w-xl mx-auto bg-white space-y-4">
            <BreadCrumb
               currentPage="Sick Leave Form"
               prevPage="Sick Leave"
               navigation={navigation}
            />

            <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4 mt-2">
               {JSON.parse(localStorage.getItem('user_data'))?.user?.name ||
                  'User Name'}
            </div>

            <div className="">
               <div className="text-base font-semibold text-[#C7DFFF] bg-[#3086F3] border border-[#3086F3] rounded-lg p-4 text-center">
                  {apiData?.leaveHours || 0} h Request
               </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               {/* Leave Type */}
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
                           { value: 'Personal Leave', label: 'Personal Leave' },
                        ]}
                        error={errors.leaveType?.message}
                        required
                     />
                  )}
               />

               {/* Start Date (FROM TOMORROW) */}
               <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                     <DateSelection
                        {...field}
                        label="Start Date"
                        minDate={tomorrow} // ✅ disables today & past
                        error={errors.startDate?.message}
                        required
                     />
                  )}
               />

               {/* End Date (FROM START DATE) */}
               <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: 'End date is required' }}
                  render={({ field }) => (
                     <DateSelection
                        {...field}
                        label="End Date"
                        minDate={watchStartDate || tomorrow} // ✅ cannot be before start
                        error={errors.endDate?.message}
                        required
                     />
                  )}
               />

               {/* Hours (same day only) */}
               {watchStartDate === watchEndDate && watchStartDate && (
                  <Controller
                     name="hours"
                     control={control}
                     render={({ field }) => (
                        <Text
                           {...field}
                           label="Hours"
                           type="number"
                           min="0"
                           step="0.1"
                        />
                     )}
                  />
               )}

               {/* Reason */}
               <Controller
                  name="reason"
                  control={control}
                  rules={{ required: 'Reason is required' }}
                  render={({ field }) => (
                     <Textarea
                        {...field}
                        label="Reason for sick leave"
                        error={errors.reason?.message}
                        required
                     />
                  )}
               />

               {/* Leave info */}
               {isLoading && watchStartDate && watchEndDate && (
                  <div className="text-sm bg-blue-50 p-3 rounded">
                     Checking leave requirements...
                  </div>
               )}

               {data?.sickLeave?.available <= apiData?.leaveHours && (
                  <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 animate-pulse">
                     <span className="text-red-600 text-lg">⚠️</span>
                     <p className="text-sm font-semibold text-red-700">
                        Insufficient sick leave balance
                     </p>
                  </div>
               )}

               {apiData && <LeaveValidationCard data={apiData} />}

               {/* Evidence */}
               {isFileUploadNeeded && (
                  <Controller
                     name="evidences"
                     control={control}
                     render={({ field }) => (
                        <FileInput
                           {...field}
                           title="Upload Evidence"
                           multiple
                           required
                        />
                     )}
                  />
               )}

               {submitError && (
                  <p className="text-red-600 font-medium">{submitError}</p>
               )}

               {/*  */}
               {data?.sickLeave?.available > apiData?.leaveHours && (
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
                  >
                     {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
                  </button>
               )}
            </form>
         </div>
      </FormProvider>
   );
};

export default memo(SickLeaveForm);
