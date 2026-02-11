import axiosInstance from '@api/axiosInstance';
import { Text, Textarea } from '@components/reusable/FormInputs';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import to12HourFormat from '@utils/to12HourFormat';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

/* ========================================================= */

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ApplicableDays = ({ applicableDays = [], isPublicHoliday }) => {
  if (isPublicHoliday) {
    return (
      <span className="inline-block px-3 py-1 text-xs font-medium border border-blue-200 rounded-full bg-blue-50 text-blue-600">
        Public Holiday
      </span>
    );
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {WEEK_DAYS.map((day) => {
        const active = applicableDays.includes(day);
        return (
          <span
            key={day}
            className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold border
              ${
                active
                  ? 'bg-blue-50 text-blue-600 border-blue-300'
                  : 'bg-gray-100 text-gray-400 border-gray-300'
              }`}
          >
            {day[0]}
          </span>
        );
      })}
    </div>
  );
};

/* ========================================================= */

const toMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const isPublicHolidayService = (service) =>
  service?.rate?.itemName?.toLowerCase()?.includes('public holiday');

/* ========================================================= */

const WorkLogEntryForm = ({ payroll, date, setShowModal, isPublicHoliday }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      serviceId: '',
      workedHours: '',
      extraHours: '',
      linkType: '',
      description: '',
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

  const serviceId = useWatch({ control, name: 'serviceId' });

  const selectedService = useMemo(() => {
    if (payroll.mode !== 'SERVICE') return null;
    return payroll.items.find((i) => i._id === serviceId);
  }, [serviceId, payroll]);

  const totalEarnable = useMemo(() => {
    if (!selectedService) return 0;
    if (selectedService.rate.pricingType === 'Hour') {
      return Number(selectedService.earnable) * Number(workedHours || 0);
    }
    return Number(selectedService.earnable);
  }, [selectedService, workedHours]);

  const detectedServiceLinkType = useMemo(() => {
    if (!selectedService) return '';

    const start = toMinutes(selectedService.rate.startTime);
    const end = toMinutes(selectedService.rate.endTime);

    if (isPublicHolidayService(selectedService)) return 'Public Holiday';
    if (dayName === 'Saturday') return 'Saturday';
    if (dayName === 'Sunday') return 'Sunday';
    if (selectedService.rate.pricingType === 'Per Visit') return 'STA';

    if (start >= 6 * 60 && end <= 20 * 60) return 'Ordinary Hours';
    if (start >= 20 * 60 && end <= 24 * 60) return 'Weekday Evening';
    if (start >= 0 && end <= 6 * 60) return 'Night Time Sleepover';

    return 'Ordinary Hours';
  }, [selectedService, dayName]);

  /* ================= SUBMIT ================= */

  const onSubmit = async (data) => {
    try {
      let payload = { date };

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
        payload.serviceItemId = selectedService?._id;

        if (selectedService?.rate.pricingType === 'Hour') {
          payload.workedHours = Number(data.workedHours);
        }

        payload.totalEarnable = totalEarnable;
        payload.linkType = detectedServiceLinkType;
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-3">
      {/* ================= SERVICE MODE ================= */}
      {payroll.mode === 'SERVICE' && (
        <>
          {!selectedService && (
            <ServiceRatesSection
              items={payroll.items}
              control={control}
              errors={errors}
              dayName={dayName}
              isPublicHoliday={isPublicHoliday}
            />
          )}

          {selectedService && (
            <div className="relative rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <button
                type="button"
                onClick={() => setValue('serviceId', '')}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <X size={16} />
              </button>

              <p className="text-sm font-semibold">
                {selectedService.rate.itemName}{' '}
                {selectedService.rate.itemNumber}
              </p>

              <ApplicableDays
                applicableDays={selectedService.rate.applicableDays}
                isPublicHoliday={isPublicHolidayService(selectedService)}
              />

              <p className="text-xs text-gray-500">
                {to12HourFormat(selectedService.rate.startTime)} –{' '}
                {to12HourFormat(selectedService.rate.endTime)}
              </p>

              <p className="text-xs font-medium text-primary">
                Type: {detectedServiceLinkType}
              </p>
            </div>
          )}

          {selectedService?.rate.pricingType === 'Hour' && (
            <WorkedHoursField control={control} errors={errors} />
          )}

          {selectedService && (
            <div className="text-base font-semibold">
              Earnable:{' '}
              <span className="text-primary">${totalEarnable.toFixed(2)}</span>
            </div>
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

          <WorkedHoursField control={control} errors={errors} />

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
                placeholder="Describe the work performed"
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
                placeholder="Describe the work performed"
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

/* ================== WorkedHoursField ================== */

const WorkedHoursField = ({ control, errors }) => (
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
        placeholder="How much you have worked"
        required
      />
    )}
  />
);

/* ================== ServiceRatesSection ================== */

const ServiceRatesSection = ({
  items,
  control,
  errors,
  dayName,
  isPublicHoliday,
}) => {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const name = item.rate.itemName?.toLowerCase() || '';
      const number = item.rate.itemNumber?.toLowerCase() || '';
      return name.includes(q) || number.includes(q);
    });
  }, [items, search]);

  return (
    <Controller
      name="serviceId"
      control={control}
      rules={{ required: 'Please select a service' }}
      render={({ field }) => (
        <div className="space-y-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by service name or number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full !pl-8 pr-3 py-2 text-sm border rounded-lg"
            />
          </div>

          {filteredItems.map((item) => {
            const applicableDays = item.rate.applicableDays || [];
            const isPH = isPublicHolidayService(item);

            const matchesDay = isPublicHoliday
              ? isPH
              : isPH || applicableDays.includes(dayName);

            return (
              <button
                key={item._id}
                type="button"
                disabled={!matchesDay}
                onClick={() => matchesDay && field.onChange(item._id)}
                className={`w-full text-left rounded-xl border p-4 transition
                  ${
                    !matchesDay
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-primary'
                  }
                `}
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold">{item.rate.itemName}</p>
                  <p className="text-xs text-gray-500">
                    {item.rate.itemNumber}
                  </p>

                  <div className="flex justify-between text-sm">
                    <span>{item.rate.pricingType}</span>
                    <span className="font-medium">${item.earnable}</span>
                  </div>

                  <p className="text-xs text-gray-500">
                    {to12HourFormat(item.rate.startTime)} –{' '}
                    {to12HourFormat(item.rate.endTime)}
                  </p>

                  <ApplicableDays
                    applicableDays={applicableDays}
                    isPublicHoliday={isPH}
                  />

                  {!matchesDay && (
                    <p className="text-[10px] text-red-400">
                      Not available on {dayName}
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {errors.serviceId && (
            <p className="text-sm text-red-500">{errors.serviceId.message}</p>
          )}
        </div>
      )}
    />
  );
};
