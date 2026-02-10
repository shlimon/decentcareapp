import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import axiosInstance from '@api/axiosInstance';
import {
  Checkbox,
  File,
  Text,
  Textarea,
} from '@components/reusable/FormInputs';
import to12HourFormat from '@utils/to12HourFormat';

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

/* ================= APPLICABLE DAYS ================= */

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

/* ================= MAIN COMPONENT ================= */

const WorkLogEntryForm = ({ payroll }) => {
  const {
    control,
    handleSubmit,
    resetField,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceId: '',
      workedHours: '',
      workDetails: '',
      expenditure: '',
      expenditureDetails: '',
      evidenceFiles: [],
      expenditureOnly: false,
    },
  });

  const expenditureOnly = useWatch({ control, name: 'expenditureOnly' });
  const serviceId = useWatch({ control, name: 'serviceId' });
  const workedHours = useWatch({ control, name: 'workedHours' });

  /* ===== CLEAR OTHER DATA WHEN EXPENDITURE TOGGLED ===== */
  useEffect(() => {
    resetField('serviceId');
    resetField('workedHours');
    resetField('workDetails');
  }, [expenditureOnly, resetField]);

  /* ===== SELECTED SERVICE ===== */
  const selectedService = useMemo(() => {
    if (payroll.mode !== 'SERVICE') return null;
    return payroll.items.find((i) => i._id === serviceId);
  }, [serviceId, payroll]);

  /* ===== EARNABLE ===== */
  const totalEarnable = useMemo(() => {
    if (!selectedService || expenditureOnly) return 0;

    if (selectedService.rate.pricingType === 'Hour') {
      return Number(selectedService.earnable) * Number(workedHours || 0);
    }
    return Number(selectedService.earnable);
  }, [selectedService, workedHours, expenditureOnly]);

  /* ===== SUBMIT ===== */
  const onSubmit = async (data) => {
    let payload = {};

    if (payroll.mode === 'SALARY' || data.expenditureOnly) {
      payload = {
        expenditure: Number(data.expenditure),
        expenditureDetails: data.expenditureDetails,
        evidenceFiles: data.evidenceFiles,
      };
    }

    if (payroll.mode === 'SERVICE' && !data.expenditureOnly) {
      payload = {
        serviceItemId: selectedService._id,
        workedHours:
          selectedService.rate.pricingType === 'Hour'
            ? Number(data.workedHours)
            : null,
        totalEarnable,
      };
    }

    if (payroll.mode === 'RATE' && !data.expenditureOnly) {
      payload = {
        workedHours: Number(data.workedHours),
        workDetails: data.workDetails,
      };
    }

    await axiosInstance.post('', payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-3">
      {/* ================= EXPENDITURE ONLY ================= */}
      {payroll.mode !== 'SALARY' && (
        <Controller
          name="expenditureOnly"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              multiple={false}
              options={[
                { label: 'This entry is expenditure only', value: true },
              ]}
              value={!!field.value}
            />
          )}
        />
      )}

      {/* ================= SERVICE MODE ================= */}
      {payroll.mode === 'SERVICE' && !expenditureOnly && (
        <>
          {!selectedService && (
            <ServiceRatesSection
              items={payroll.items}
              control={control}
              errors={errors}
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

              <p className="text-sm">{selectedService.rate.supportType}</p>

              <ApplicableDays
                applicableDays={selectedService.rate.applicableDays}
                isPublicHoliday={selectedService.rate.itemName
                  ?.toLowerCase()
                  .includes('public holiday')}
              />

              <div className="flex justify-between text-sm">
                <span>{selectedService.rate.pricingType}</span>
                <span className="font-medium">${selectedService.earnable}</span>
              </div>

              <p className="text-xs text-gray-500">
                {to12HourFormat(selectedService.rate.startTime)} –{' '}
                {to12HourFormat(selectedService.rate.endTime)}
              </p>
            </div>
          )}

          {selectedService?.rate.pricingType === 'Hour' && (
            <WorkedHoursField control={control} errors={errors} />
          )}

          {selectedService &&
            (selectedService.rate.pricingType === 'Per Visit' ||
              Number(workedHours) > 0) && (
              <div className="text-base font-semibold">
                Earnable:{' '}
                <span className="text-primary">
                  ${totalEarnable.toFixed(2)}
                </span>
              </div>
            )}
        </>
      )}

      {/* ================= RATE MODE ================= */}
      {payroll.mode === 'RATE' && !expenditureOnly && (
        <>
          <WorkedHoursField control={control} errors={errors} />

          <Controller
            name="workDetails"
            control={control}
            rules={{ required: 'Work details are required' }}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Work Details"
                error={errors.workDetails?.message}
                required
              />
            )}
          />
        </>
      )}

      {/* ================= EXPENDITURE ================= */}
      {(payroll.mode === 'SALARY' || expenditureOnly) && (
        <>
          <Controller
            name="expenditure"
            control={control}
            rules={{ required: 'Expenditure is required' }}
            render={({ field }) => (
              <Text
                {...field}
                label="Expenditure"
                type="number"
                error={errors.expenditure?.message}
                required
              />
            )}
          />

          <Controller
            name="expenditureDetails"
            control={control}
            rules={{ required: 'Expenditure details are required' }}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Expenditure Details"
                error={errors.expenditureDetails?.message}
                required
              />
            )}
          />

          <Controller
            name="evidenceFiles"
            control={control}
            rules={{ required: 'At least one file is required' }}
            render={({ field }) => (
              <File
                {...field}
                title="Upload Evidence"
                accept={['PDF', 'JPG', 'JPEG', 'PNG']}
                supportedFormats={['PDF', 'JPG', 'JPEG', 'PNG']}
                multiple
                maxSize={10 * 1024 * 1024}
                error={errors.evidenceFiles?.message}
                required
              />
            )}
          />
        </>
      )}

      {/* ================= SUBMIT ================= */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-primary text-white font-medium"
      >
        Submit
      </button>
    </form>
  );
};

export default WorkLogEntryForm;

/* ========================================================= */
/* ================= SERVICE LIST WITH SEARCH =============== */

const ServiceRatesSection = ({ items, control, errors }) => {
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
          <p className="text-sm font-semibold">Select Service</p>

          {/* Search */}
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
              className="w-full !pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {filteredItems.length === 0 && (
            <p className="text-sm text-gray-500">No services found</p>
          )}

          {filteredItems.map((item) => {
            const selected = field.value === item._id;

            return (
              <button
                key={item._id}
                type="button"
                onClick={() => field.onChange(item._id)}
                className={`w-full text-left rounded-xl border p-4 transition
                  ${
                    selected ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
              >
                <div className="flex justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {item.rate.itemName} {item.rate.itemNumber}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.rate.supportType}
                    </p>

                    <p className="text-xs text-gray-500">
                      {to12HourFormat(item.rate.startTime)} –{' '}
                      {to12HourFormat(item.rate.endTime)}
                    </p>

                    <ApplicableDays
                      applicableDays={item.rate.applicableDays}
                      isPublicHoliday={item.rate.itemName
                        ?.toLowerCase()
                        .includes('public holiday')}
                    />
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">${item.earnable}</p>
                    <span className="text-xs">{item.rate.pricingType}</span>
                  </div>
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

/* ========================================================= */

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
        required
      />
    )}
  />
);
