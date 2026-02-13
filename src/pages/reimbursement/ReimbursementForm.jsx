import axiosInstance from '@api/axiosInstance';
import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import { File, Select, Text, Textarea } from '@components/reusable/FormInputs';
import SearchableSelect from '@components/reusable/SearchableSelect';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const ReimbursementForm = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      reimbursementType: '',
      participantId: '',
      amount: '',
      description: '',
      evidenceFile: null, // ✅ file default null
    },
  });

  const reimbursementType = watch('reimbursementType');

  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      console.log('Form Data:', data);
      setLoading(true);

      const formData = new FormData();

      formData.append('reimbursementType', data.reimbursementType);

      if (data.reimbursementType === 'Participant') {
        formData.append('participantId', data.participantId);
      }

      formData.append('amount', Number(data.amount));
      formData.append('description', data.description);

      if (data.evidenceFile) {
        formData.append('evidenceFile', data.evidenceFile);
      }

      const response = await axiosInstance.post(
        '/reimbursements/my',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response?.status === 201) {
        toast.success('Reimbursement submitted successfully!');
        reset(); // resets to defaultValues
        setSelectedParticipant(null);
        navigate('/work/reimbursement');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit reimbursement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5 pb-8">
      <BreadCrumb
        currentPage="Reimbursement form"
        prevPage="Reimbursement"
        navigation={() => navigate('/work/reimbursement')}
      />
      {/* Link To */}
      <Controller
        name="reimbursementType"
        control={control}
        rules={{ required: 'Link To is required' }}
        render={({ field }) => (
          <Select
            {...field}
            label="Link To"
            options={[
              { value: 'Participant', label: 'Participant' },
              { value: 'Self', label: 'Myself' },
              { value: 'Company', label: 'Company' },
            ]}
            error={errors.reimbursementType?.message}
            required
          />
        )}
      />

      {/* Participant (Only When Selected) */}
      {reimbursementType === 'Participant' && (
        <div>
          <SearchableSelect
            label="Select Participant"
            value={selectedParticipant}
            onChange={(value) => {
              setSelectedParticipant(value);
              setValue('participantId', value || '');
            }}
            placeholder="Participant Name"
            displayField="name"
            valueField="_id"
            extraField="community"
          />

          <Controller
            name="participantId"
            control={control}
            rules={{
              required:
                reimbursementType === 'Participant'
                  ? 'Participant is required'
                  : false,
            }}
            render={({ field }) => <input type="hidden" {...field} />}
          />

          {errors.participantId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.participantId.message}
            </p>
          )}
        </div>
      )}

      {/* Amount */}
      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'Amount is required',
          validate: (value) => {
            const num = Number(value);
            if (isNaN(num) || num <= 0) {
              return 'Please enter a valid amount';
            }
            return true;
          },
        }}
        render={({ field }) => (
          <Text
            label="Amount"
            placeholder="Enter amount"
            type="number"
            {...field}
            error={errors.amount?.message}
            required
          />
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        rules={{ required: 'Description is required' }}
        render={({ field }) => (
          <Textarea
            {...field}
            label="Description"
            placeholder="Enter reimbursement details"
            error={errors.description?.message}
            required
          />
        )}
      />

      {/* Evidence File (Single File, default null) */}
      <Controller
        name="evidenceFile"
        control={control}
        rules={{
          required: 'At least one evidence file is required',
        }}
        render={({ field: { onChange, value } }) => (
          <File
            value={value}
            onChange={onChange}
            title="Upload Evidence"
            description="Upload photos or PDFs"
            accept={[
              'image/*',
              'application/pdf',
              '.jpg',
              '.jpeg',
              '.png',
              '.pdf',
            ]}
            supportedFormats={['JPG', 'JPEG', 'PNG', 'PDF']}
            maxSize={10 * 1024 * 1024}
            error={errors.evidenceFile?.message}
            enableImageCropping={true}
            required
          />
        )}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Reimbursement'}
      </button>
    </form>
  );
};

export default React.memo(ReimbursementForm);
