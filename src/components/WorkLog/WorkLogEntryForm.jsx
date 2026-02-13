import axiosInstance from '@api/axiosInstance';
import { Text, Textarea } from '@components/reusable/FormInputs';
import Loading from '@components/reusable/loading/Loading';
import useGetPayRate from '@hooks/work-log/useGetPayRate';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

/* ========================================================= */

const WorkLogEntryForm = ({ date, setShowModal, isPublicHoliday }) => {
  const { data, isLoading } = useGetPayRate();
  const payroll = useMemo(() => data?.data?.payroll || {}, [data]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      workedHours: '',
      linkType: '',
      description: '',
      extraHours: '',
    },
  });

  const dayName = useMemo(
    () => new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
    [date],
  );

  /* ================= SALARY ================= */

  const extraHours = useWatch({ control, name: 'extraHours' });

  const overtimeRate = useMemo(() => {
    if (payroll.mode !== 'SALARY') return 0;
    return payroll.items.find((i) => i.type === 'overtimeRate')?.amount || 0;
  }, [payroll]);

  const salaryEarnable = Number(extraHours || 0) * Number(overtimeRate);

  /* ================= RATE ================= */

  const workedHours = useWatch({ control, name: 'workedHours' });
  const linkType = useWatch({ control, name: 'linkType' });

  const rateLinkTypes = useMemo(() => {
    if (isPublicHoliday) return ['Public Holiday'];
    if (dayName === 'Saturday') return ['Saturday'];
    if (dayName === 'Sunday') return ['Sunday'];
    return ['Ordinary Hours', 'Training'];
  }, [dayName, isPublicHoliday]);

  const rateAmount = useMemo(() => {
    if (payroll.mode !== 'RATE' || !linkType) return 0;

    const map = {
      'Ordinary Hours': 'ordinary',
      Saturday: 'saturday',
      Sunday: 'sunday',
      'Public Holiday': 'publicHoliday',
      Training: 'ordinary',
    };

    const key = map[linkType];
    return payroll.items.find((i) => i.type === key)?.rate || 0;
  }, [payroll, linkType]);

  const rateEarnable = Number(workedHours || 0) * Number(rateAmount);

  /* ================= SERVICE ================= */

  const serviceLinkTypes = useMemo(() => {
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
      'STA',
      'Non Billable',
      'Training',
    ];
  }, [dayName, isPublicHoliday]);

  /* ================= SUBMIT ================= */

  const onSubmit = async (data) => {
    try {
      let payload = { forDate: date };

      if (payroll.mode === 'SALARY') {
        payload.extraHours = Number(data.extraHours);
        payload.totalEarnable = salaryEarnable;
        payload.linkType = 'Overtime';
        payload.description = data.description;
      }

      if (payroll.mode === 'RATE') {
        payload.workedHours = Number(data.workedHours);
        payload.linkType = data.linkType;
        payload.totalEarnable = rateEarnable;
        payload.description = data.description;
      }

      if (payroll.mode === 'SERVICE') {
        payload.workedHours = Number(data.workedHours);
        payload.linkType = data.linkType;
      }

      const cleaned = removeEmptyValues(payload);

      const response = await axiosInstance.post(
        '/timesheets/my-timesheet',
        cleaned,
      );

      if (response?.data?.success) {
        toast.success('Work log entry submitted successfully');
        reset();
        setShowModal(false);
      } else {
        toast.error(response?.data?.message || 'Failed to submit');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  /* ================= UI ================= */

  if (isLoading) {
    return <Loading />;
  }

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

          <Controller
            name="workedHours"
            control={control}
            rules={{
              required: 'Worked hours are required',
              validate: (v) =>
                !isNaN(Number(v)) && Number(v) > 0 ? true : 'Enter valid hours',
            }}
            render={({ field }) => (
              <Text
                {...field}
                label="Worked Hours"
                placeholder="Enter hours worked"
                type="number"
                error={errors.workedHours?.message}
                required
              />
            )}
          />
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
            name="workedHours"
            control={control}
            rules={{
              required: 'Worked hours are required',
              validate: (v) =>
                !isNaN(Number(v)) && Number(v) > 0 ? true : 'Enter valid hours',
            }}
            render={({ field }) => (
              <Text
                {...field}
                label="Worked Hours"
                type="number"
                error={errors.workedHours?.message}
                required
              />
            )}
          />

          <div className="text-base font-semibold">
            Earnable:{' '}
            <span className="text-primary">${rateEarnable.toFixed(2)}</span>
          </div>

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
              />
            )}
          />
        </>
      )}

      {/* ================= SALARY MODE ================= */}
      {payroll.mode === 'SALARY' && (
        <>
          <Controller
            name="extraHours"
            control={control}
            rules={{ required: 'Extra hours required' }}
            render={({ field }) => (
              <Text
                {...field}
                label="Extra Hours"
                type="number"
                error={errors.extraHours?.message}
                required
              />
            )}
          />

          <div className="text-base font-semibold">
            Earnable:{' '}
            <span className="text-primary">${salaryEarnable.toFixed(2)}</span>
          </div>

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
              />
            )}
          />
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
};

export default WorkLogEntryForm;
