import axiosInstance from '@api/axiosInstance';
import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import {
  DateSelection,
  Select,
  Text,
  Textarea,
} from '@components/reusable/FormInputs';
import FileInput from '@components/reusable/FormInputs/FileInput';
import Loading from '@components/reusable/loading/Loading';
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
  const { data, isLoading } = useGetLeaveBalance();

  const type = JSON.parse(localStorage.getItem('user_data'))?.user?.type;

  // ✅ Today date (YYYY-MM-DD)
  const today = useMemo(() => {
    const date = new Date();
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
  const watchHours = watch('hours');
  const leaveType = watch('leaveType');

  // ✅ Determine if manual check is needed
  const isSameDay = watchStartDate === watchEndDate && watchStartDate;
  const isManualCheckType = type === 'Support Worker' || isSameDay;

  const [isFileUploadNeeded, setIsFileUploadNeeded] = useState(false);
  const [isCheckClicked, setIsCheckClicked] = useState(false);
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [checkData, setCheckData] = useState(null);

  // ✅ Reset check button if any field changes
  useEffect(() => {
    setIsCheckClicked(false);
    setCheckData(null);
  }, [watchStartDate, watchEndDate, watchHours]);

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

  // ✅ Calculate max hours and validate
  const maxHours = useMemo(() => {
    if (!watchStartDate || !watchEndDate) return null;
    const start = new Date(watchStartDate);
    const end = new Date(watchEndDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start and end day
    return (diffDays * 7.6).toFixed(1);
  }, [watchStartDate, watchEndDate]);

  // ✅ Validate hours against max allowed
  useEffect(() => {
    if (watchHours && maxHours) {
      const hoursValue = parseFloat(watchHours);
      const maxValue = parseFloat(maxHours);
      if (hoursValue > maxValue) {
        setError('hours', {
          type: 'manual',
          message: `Maximum hours allowed for ${Math.ceil((new Date(watchEndDate) - new Date(watchStartDate)) / (1000 * 60 * 60 * 24)) + 1} day(s) is ${maxHours}h`,
        });
      } else {
        clearErrors('hours');
      }
    }
  }, [
    watchHours,
    maxHours,
    watchStartDate,
    watchEndDate,
    setError,
    clearErrors,
  ]);

  // ✅ Automatic API call for non-Support Worker types
  const { data: apiData, isLoading: isCanLeaveLoading } = useGetCanLeave(
    !isManualCheckType && watchStartDate && watchEndDate
      ? {
          start: watchStartDate,
          end: watchEndDate,
          hours: watchHours,
          type: 'Sick Leave',
        }
      : null,
  );

  // ✅ Manual check button handler for Support Worker or same day
  const handleCheckClick = async () => {
    if (!watchStartDate || !watchEndDate || !watchHours) return;

    // ✅ Validate hours before API call
    const hoursValue = parseFloat(watchHours);
    const maxValue = parseFloat(maxHours);
    if (hoursValue > maxValue) {
      toast.error(`Maximum hours allowed is ${maxHours}h`);
      return;
    }

    setIsCheckLoading(true);
    try {
      const response = await axiosInstance.get(
        `/leaves/can-leave?start=${watchStartDate}&end=${watchEndDate}&hours=${watchHours}&type=Sick Leave`,
      );

      if (response.data.success) {
        setCheckData(response.data.data);
        setIsCheckClicked(true);
      } else {
        toast.error(
          response.data.message || 'Failed to check leave availability',
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to check leave availability',
      );
    } finally {
      setIsCheckLoading(false);
    }
  };

  // ✅ Use checkData for manual check, apiData for automatic
  const finalData = isManualCheckType ? checkData : apiData;

  useEffect(() => {
    if (finalData) {
      setIsFileUploadNeeded(finalData.needEvidence || false);
    }
  }, [finalData]);

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

  if (isCanLeaveLoading) {
    return <Loading />;
  }

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
            {finalData?.leaveHours || 0} h Request
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

          {/* Start Date (FROM TODAY) */}
          <Controller
            name="startDate"
            control={control}
            rules={{ required: 'Start date is required' }}
            render={({ field }) => (
              <DateSelection
                {...field}
                label="Start Date"
                minDate={today} // ✅ allows today onwards
                error={errors.startDate?.message}
                required
              />
            )}
          />

          {/* End Date (FROM START DATE or TODAY) */}
          <Controller
            name="endDate"
            control={control}
            rules={{ required: 'End date is required' }}
            render={({ field }) => (
              <DateSelection
                {...field}
                label="End Date"
                minDate={watchStartDate || today} // ✅ cannot be before start or today
                error={errors.endDate?.message}
                required
              />
            )}
          />

          {/* Hours (always enabled) */}
          <Controller
            name="hours"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Text
                  {...field}
                  label="Hours"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter hours of leave required"
                  error={errors.hours?.message}
                />
                {maxHours && (
                  <p className="text-xs text-gray-600">
                    Maximum allowed: {maxHours}h
                  </p>
                )}
              </div>
            )}
          />

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

          {/* {data?.sickLeave?.available <= apiData?.leaveHours && (
                  <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 animate-pulse">
                     <span className="text-red-600 text-lg">⚠️</span>
                     <p className="text-sm font-semibold text-red-700">
                        Insufficient sick leave balance
                     </p>
                  </div>
               )} */}

          {finalData && (
            <LeaveValidationCard
              data={finalData}
              hasInsufficientBalance={
                data?.sickLeave?.available <= finalData?.leaveHours
              }
            />
          )}

          {/* Evidence */}
          {isFileUploadNeeded && (
            <Controller
              name="evidences"
              control={control}
              render={({ field }) => (
                <FileInput
                  {...field}
                  title={
                    leaveType === 'Sick Leave'
                      ? 'Upload Medical Certificate'
                      : 'Upload Evidence'
                  }
                  multiple
                  required
                />
              )}
            />
          )}

          {submitError && (
            <p className="text-red-600 font-medium">{submitError}</p>
          )}

          {/* Check Button (for Support Worker or same day) */}
          {isManualCheckType && (
            <>
              {!watchHours ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Please enter hours
                </button>
              ) : !isCheckClicked ? (
                <button
                  type="button"
                  onClick={handleCheckClick}
                  disabled={isCheckLoading || errors.hours}
                  className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isCheckLoading ? 'Checking...' : 'Check'}
                </button>
              ) : null}
            </>
          )}

          {/* Submit Button */}
          {isCheckClicked || !isManualCheckType ? (
            data?.sickLeave?.available > finalData?.leaveHours ? (
              <button
                type="submit"
                disabled={isSubmitting || errors.hours}
                className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
              </button>
            ) : null
          ) : null}
        </form>
      </div>
    </FormProvider>
  );
};

export default memo(SickLeaveForm);
