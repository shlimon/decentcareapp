import axiosInstance from '@api/axiosInstance';
import { Text, Textarea } from '@components/reusable/FormInputs';
import Loading from '@components/reusable/loading/Loading';
import useGetPayRate from '@hooks/work-log/useGetPayRate';
import { useQueryClient } from '@tanstack/react-query';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

/* ========================================================= */

const PER_VISIT_TYPES = ['STA', 'Night Time Sleepover'];

const WorkLogEntryForm = ({
  week,
  date,
  setShowModal,
  isPublicHoliday,
  workLogs,
}) => {
  const { data, isLoading } = useGetPayRate();
  const payroll = useMemo(() => data?.data?.payroll || {}, [data]);
  const department = data?.data?.workInfo?.department;
  const position = data?.data?.workInfo?.position;
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      quantity: '',
      linkType: '',
      description: '',
    },
  });

  const dayName = useMemo(
    () => new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
    [date],
  );

  /* ================= WEEKLY HOURS (RATE ONLY) ================= */
  const weeklyRateHours = useMemo(() => {
    if (payroll.mode !== 'RATE') return 0;
    if (department === 'Support Coordination') return 0;

    return (
      workLogs?.reduce((total, day) => {
        return (
          total +
          day.entries.reduce((sum, entry) => {
            return sum + (Number(entry.quantity) || 0);
          }, 0)
        );
      }, 0) || 0
    );
  }, [workLogs, payroll.mode, department]);

  const remainingTo38 = Math.max(38 - weeklyRateHours, 0);
  const reached38 = weeklyRateHours >= 38;

  /* ================= WATCH ================= */
  const quantity = useWatch({ control, name: 'quantity' });
  const linkType = useWatch({ control, name: 'linkType' });

  /* ================= RATE ================= */
  const rateLinkTypes = useMemo(() => {
    if (department === 'Support Coordination') {
      return ['Non Billable', 'Ordinary Hours'];
    }

    let types = isPublicHoliday
      ? ['Public Holiday', 'Training', 'Overtime']
      : dayName === 'Saturday'
        ? ['Saturday', 'Training', 'Overtime']
        : dayName === 'Sunday'
          ? ['Sunday', 'Training', 'Overtime']
          : ['Ordinary Hours', 'Training', 'Overtime'];

    if (payroll.mode === 'RATE') {
      if (!reached38) {
        return types.filter((t) => t !== 'Overtime');
      } else {
        return types.filter((t) => t !== 'Ordinary Hours');
      }
    }

    return types;
  }, [dayName, isPublicHoliday, department, payroll.mode, reached38]);

  const rateAmount = useMemo(() => {
    if (payroll.mode !== 'RATE' || !linkType) return 0;

    const map = {
      'Ordinary Hours': 'ordinary',
      Saturday: 'saturday',
      Sunday: 'sunday',
      'Public Holiday': 'publicHoliday',
      Training: 'ordinary',
      Overtime: 'overtime',
    };

    const key = map[linkType];
    return payroll.items?.find((i) => i.type === key)?.rate || 0;
  }, [payroll, linkType]);

  const rateEarnable = Number(quantity || 0) * Number(rateAmount);

  /* ================= SERVICE ================= */
  const serviceLinkTypes = useMemo(() => {
    if (department === 'Support Coordination') {
      return ['Non Billable', 'Ordinary Hours'];
    }

    if (position === 'Senior Support Worker') {
      return [
        'Office Hours',
        'Ordinary Hours',
        'Weekday Evening',
        'Night Time Sleepover',
        'Over Night Hours',
        'STA',
        'Non Billable',
        'Training',
      ];
    }

    if (isPublicHoliday) {
      return ['Public Holiday', 'STA', 'Non Billable', 'Training'];
    }
    if (dayName === 'Saturday') {
      return ['Saturday', 'STA', 'Non Billable', 'Training'];
    }
    if (dayName === 'Sunday') {
      return ['Sunday', 'STA', 'Non Billable', 'Training'];
    }

    return [
      'Ordinary Hours',
      'Weekday Evening',
      'Night Time Sleepover',
      'Over Night Hours',
      'STA',
      'Non Billable',
      'Training',
    ];
  }, [department, position, isPublicHoliday, dayName]);

  const isPerVisit = useMemo(
    () => PER_VISIT_TYPES.includes(linkType),
    [linkType],
  );

  /* ================= SALARY ================= */
  const salaryLinkTypes = useMemo(() => {
    if (department === 'Support Coordination') {
      return ['Non Billable', 'Ordinary Hours'];
    }
    return ['Overtime'];
  }, [department]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      let payload = { forDate: date };

      if (payroll.mode === 'SALARY') {
        payload.quantity = Number(data.quantity);
        payload.linkType = data.linkType;
        payload.description = data.description;
      }

      if (payroll.mode === 'RATE') {
        payload.quantity = Number(data.quantity);
        payload.linkType = data.linkType;
        payload.totalEarnable = rateEarnable;
        payload.description = data.description;
      }

      if (payroll.mode === 'SERVICE') {
        payload.linkType = data.linkType;
        if (!PER_VISIT_TYPES.includes(data.linkType)) {
          payload.quantity = Number(data.quantity);
        }
      }

      const cleaned = removeEmptyValues(payload);

      const response = await axiosInstance.post(
        '/timesheets/my-timesheet',
        cleaned,
      );

      if (response?.data?.success) {
        toast.success('Work log entry submitted successfully');
        reset();
        queryClient.invalidateQueries(['my-timesheet', week]);
        setShowModal(false);
      } else {
        toast.error(response?.data?.message || 'Failed to submit');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-3">
      {/* ================= SERVICE MODE ================= */}
      {payroll.mode === 'SERVICE' && (
        <>
          <Controller
            name="linkType"
            control={control}
            rules={{ required: 'Type is required' }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="">Select Type</option>
                {serviceLinkTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          />

          {!isPerVisit && (
            <Controller
              name="quantity"
              control={control}
              rules={{
                required: 'Worked hours are required',
                validate: (v) =>
                  !isNaN(Number(v)) && Number(v) > 0
                    ? true
                    : 'Enter valid hours',
              }}
              render={({ field }) => (
                <Text
                  {...field}
                  label="Worked Hours"
                  placeholder="Enter hours worked"
                  type="number"
                  error={errors.quantity?.message}
                  required
                />
              )}
            />
          )}
        </>
      )}

      {/* ================= RATE MODE ================= */}
      {payroll.mode === 'RATE' && (
        <>
          <Controller
            name="linkType"
            control={control}
            rules={{ required: 'Type required' }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="">Select Type</option>
                {rateLinkTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          />

          <Controller
            name="quantity"
            control={control}
            rules={{
              required: 'Worked hours are required',
              validate: (v) => {
                const num = Number(v);
                if (isNaN(num) || num <= 0) return 'Enter valid hours';
                if (!reached38 && num > remainingTo38)
                  return `Maximum allowed is ${remainingTo38} hours`;
                if (num > 24) return 'Cannot exceed 24 hours per day';
                return true;
              },
            }}
            render={({ field }) => (
              <Text
                {...field}
                label="Worked Hours"
                type="number"
                error={errors.quantity?.message}
                required
                placeholder="Enter hours worked for the day"
                max={reached38 ? 24 : Math.min(24, remainingTo38)}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Work Details"
                error={errors.description?.message}
                required
                placeholder="Describe the work done during these hours"
              />
            )}
          />
        </>
      )}

      {/* ================= SALARY MODE ================= */}
      {payroll.mode === 'SALARY' && (
        <>
          <Controller
            name="linkType"
            control={control}
            rules={{ required: 'Type is required' }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="">Select Type</option>
                {salaryLinkTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          />

          <Controller
            name="quantity"
            control={control}
            rules={{ required: 'Hours required' }}
            render={({ field }) => (
              <Text
                {...field}
                label="Hours"
                type="number"
                error={errors.quantity?.message}
                required
                placeholder="Enter hours"
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Work Details"
                error={errors.description?.message}
                required
                placeholder="Describe the work done"
              />
            )}
          />
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold disabled:opacity-60 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
};

export default WorkLogEntryForm;
