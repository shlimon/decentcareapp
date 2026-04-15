import axiosInstance from '@api/axiosInstance';
import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import {
  DateSelection,
  Select,
  Text,
  Textarea,
} from '@components/reusable/FormInputs';
import FileInput from '@components/reusable/FormInputs/FileInput';
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
  const { data } = useGetLeaveBalance();

  const employmentType = JSON.parse(localStorage.getItem('user_data'))?.user
    ?.employmentType;

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

  // ✅ Determine employment / date logic
  const isMultiDay =
    watchStartDate && watchEndDate && watchStartDate !== watchEndDate;
  const isFullTime = employmentType === 'Full Time';
  const showHoursField = !(isFullTime && isMultiDay);

  const [isFileUploadNeeded, setIsFileUploadNeeded] = useState(false);
  const [isCheckClicked, setIsCheckClicked] = useState(false);
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [checkData, setCheckData] = useState(null);

  // ✅ Reset check state whenever relevant fields change
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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

  // ✅ Manual check button handler — always used regardless of employment type
  const handleCheckClick = async () => {
    const needsHours = showHoursField;

    if (!watchStartDate || !watchEndDate) return;
    if (needsHours && !watchHours) return;

    // ✅ Validate hours before API call
    if (needsHours) {
      const hoursValue = parseFloat(watchHours);
      const maxValue = parseFloat(maxHours);
      if (hoursValue > maxValue) {
        toast.error(`Maximum hours allowed is ${maxHours}h`);
        return;
      }
    }

    setIsCheckLoading(true);
    try {
      const hoursParam = needsHours ? `&hours=${watchHours}` : '';
      const response = await axiosInstance.get(
        `/leaves/can-leave?start=${watchStartDate}&end=${watchEndDate}${hoursParam}&type=Sick Leave`,
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

  useEffect(() => {
    if (checkData) {
      setIsFileUploadNeeded(checkData.needEvidence || false);
    }
  }, [checkData]);

  // ✅ Determine if Check button should be shown
  const canCheck = watchStartDate && watchEndDate && !errors.endDate;
  const checkRequiresHours = showHoursField;
  const isCheckDisabled =
    isCheckLoading || !!errors.hours || (checkRequiresHours && !watchHours);

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
            {checkData?.leaveHours?.toFixed(2) || 0} h Request
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
                minDate={today}
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
                minDate={watchStartDate || today}
                error={errors.endDate?.message}
                required
              />
            )}
          />

          {/* Hours (hidden for Full Time multi-day) */}
          {showHoursField && (
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

          {/* Leave validation result */}
          {checkData && (
            <LeaveValidationCard
              data={checkData}
              hasInsufficientBalance={
                data?.sickLeave?.available <= checkData?.leaveHours
              }
            />
          )}

          {/* Evidence upload */}
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

          {/* ✅ Check Leave button — always shown when dates are filled, resets after field changes */}
          {canCheck &&
            !isCheckClicked &&
            (checkRequiresHours && !watchHours ? (
              <button
                type="button"
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Please enter hours
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckClick}
                disabled={isCheckDisabled}
                className="w-full bg-green-600 text-white py-3 rounded-lg disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCheckLoading ? 'Checking...' : 'Check Leave'}
              </button>
            ))}

          {/* ✅ Submit button — shown after successful check with sufficient balance */}
          {isCheckClicked &&
            data?.sickLeave?.available > checkData?.leaveHours && (
              <button
                type="submit"
                disabled={
                  isSubmitting || !!errors.hours || !checkData?.canTakeLeave
                }
                className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
