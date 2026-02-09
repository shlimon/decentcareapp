import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Checkbox, Text, Textarea } from '@components/reusable/FormInputs';

const WorkLogEntryForm = ({ payroll }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceId: '',
      workedHours: '',
      expenditure: '',
      workDetails: '',
      expenditureDetails: '',
      expenditureOnly: false,
    },
  });

  const expenditureOnly = useWatch({ control, name: 'expenditureOnly' });
  const serviceId = useWatch({ control, name: 'serviceId' });
  const workedHours = useWatch({ control, name: 'workedHours' });

  const selectedService = useMemo(() => {
    if (payroll.mode !== 'SERVICE') return null;
    return payroll.items.find((i) => i._id === serviceId);
  }, [serviceId, payroll]);

  const totalEarnable = useMemo(() => {
    if (!selectedService || expenditureOnly) return 0;

    if (selectedService.rate.pricingType === 'Hour') {
      return Number(selectedService.earnable) * Number(workedHours || 0);
    }

    return Number(selectedService.earnable);
  }, [selectedService, workedHours, expenditureOnly]);

  const onSubmit = (data) => {
    if (payroll.mode === 'SALARY' || data.expenditureOnly) {
      console.log({
        expenditure: Number(data.expenditure),
        expenditureDetails: data.expenditureDetails,
      });
      return;
    }

    if (payroll.mode === 'SERVICE') {
      console.log({
        serviceItemId: selectedService?._id,
        workedHours:
          selectedService?.rate.pricingType === 'Hour'
            ? Number(data.workedHours)
            : null,
        totalEarnable,
      });
    }

    if (payroll.mode === 'RATE') {
      console.log({
        workedHours: Number(data.workedHours),
        workDetails: data.workDetails,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ===== EXPENDITURE ONLY CHECKBOX ===== */}
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
              value={field.value ? true : false}
            />
          )}
        />
      )}

      {/* ================= SERVICE MODE ================= */}
      {payroll.mode === 'SERVICE' && !expenditureOnly && (
        <>
          {/* SERVICE LIST (before selection) */}
          {!selectedService && (
            <ServiceRatesSection
              items={payroll.items}
              control={control}
              errors={errors}
            />
          )}

          {/* SELECTED SERVICE SUMMARY */}
          {selectedService && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
              <p className="text-sm font-semibold">
                {selectedService.rate.itemName}
              </p>

              <div className="flex justify-between text-sm">
                <span>{selectedService.rate.pricingType}</span>
                <span className="font-medium">${selectedService.earnable}</span>
              </div>

              <p className="text-xs text-gray-500">
                {selectedService.rate.startTime} –{' '}
                {selectedService.rate.endTime}
              </p>
            </div>
          )}

          {/* WORKED HOURS (Hour only) */}
          {selectedService?.rate.pricingType === 'Hour' && (
            <WorkedHoursField control={control} errors={errors} />
          )}

          {/* EARNABLE */}
          {selectedService &&
            (selectedService.rate.pricingType === 'Per Visit' ||
              Number(workedHours) > 0) && (
              <div className="text-base font-semibold">
                Earnable Amount:{' '}
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
                placeholder="Describe the work performed"
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
            rules={{
              required: 'Expenditure is required',
              validate: (v) =>
                !isNaN(Number(v)) && Number(v) >= 0
                  ? true
                  : 'Enter valid amount',
            }}
            render={({ field }) => (
              <Text
                {...field}
                label="Expenditure"
                type="number"
                placeholder="Enter expenditure"
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
                placeholder="Describe the expenditure"
                error={errors.expenditureDetails?.message}
                required
              />
            )}
          />
        </>
      )}

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

/* ================================================================= */

const ServiceRatesSection = ({ items, control, errors }) => (
  <Controller
    name="serviceId"
    control={control}
    rules={{ required: 'Please select a service' }}
    render={({ field }) => (
      <div className="space-y-3">
        <p className="text-sm font-semibold">Select Service</p>

        <div className="max-h-[65vh] overflow-y-auto space-y-3">
          {items.map((item) => {
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
                  <div>
                    <p className="text-sm font-medium">{item.rate.itemName}</p>
                    <p className="text-xs text-gray-500">
                      {item.rate.supportType}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">${item.earnable}</p>
                    <span className="text-xs">{item.rate.pricingType}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {errors.serviceId && (
          <p className="text-sm text-red-500">{errors.serviceId.message}</p>
        )}
      </div>
    )}
  />
);

/* ================================================================= */

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
        placeholder="Enter worked hours"
        error={errors.workedHours?.message}
        required
      />
    )}
  />
);
