import axiosInstance from '@api/axiosInstance';
import { Text } from '@components/reusable/FormInputs';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const WorkLogEditForm = ({
  defaultHours = 0,
  selectedEntry,
  weekString,
  setEditModalOpen,
}) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { quantity: defaultHours },
  });

  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (hours) => {
    try {
      setSubmitting(true);

      const payload = {
        quantity: Number(hours), // ensure number
        description: '',
      };

      await axiosInstance.put(`/timesheets/${selectedEntry._id}`, payload);

      queryClient.invalidateQueries({
        queryKey: ['my-timesheet', weekString],
      });

      setEditModalOpen(false);
      toast.success('Hours updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update hours.');
    } finally {
      setSubmitting(false);
    }
  };

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
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default WorkLogEditForm;
