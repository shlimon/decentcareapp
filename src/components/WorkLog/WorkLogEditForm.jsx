import { Text } from '@components/reusable/FormInputs';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

const WorkLogEditForm = ({ defaultHours = 0, onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { quantity: defaultHours },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.quantity))}
      className="p-4 space-y-4"
    >
      <Controller
        name="quantity"
        control={control}
        rules={{
          required: 'Hours are required',
          min: { value: 0, message: 'Hours must be >= 0' },
        }}
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

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Update
      </button>
    </form>
  );
};

export default WorkLogEditForm;
