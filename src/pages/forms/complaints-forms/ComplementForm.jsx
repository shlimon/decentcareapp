import axiosInstance from '@api/axiosInstance';
import {
  DateSelection,
  Radio,
  Textarea,
} from '@components/reusable/FormInputs';

import { SearchableSelect } from '@components/reusable/FormInputs/_components/SearchableSelect';
import useAllStaffsQuery from '@hooks/useAllStaffsQuery';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';
import CommonFieldForm from './CommonFieldForm';

const ComplementForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState('');
  const [departmentName, setDepartmentName] = useState('');

  // Add ref for SearchableSelect
  const staffSelectRef = useRef(null);

  const { data: staffMembers, isLoading: isLoadingStaff } = useAllStaffsQuery();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const participantParam = queryParams.get('participant');
    const departmentParam = queryParams.get('department');

    if (participantParam) setParticipant(participantParam);
    if (departmentParam) setDepartmentName(decodeURIComponent(departmentParam));
  }, [location.search]);

  const methods = useForm({
    defaultValues: {
      type: 'feedback',
      haveConsent: '',
      reporterAnonymous: '',
      participantAnonymous: '',
      contactTime: [],
      contactMethod: [],

      feedback: '',
      happenTime: '',
      recogniseStaff: '',
      staff: '',
      shareFeedback: '',
      publicity: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const reporterAnonymous = methods.watch('reporterAnonymous');

  const onSubmit = async (data) => {
    try {
      const payload = {
        type: data.type,
        haveConsent: data.haveConsent === 'yes',
        // Add participant and departmentName from CommonFieldForm
        participant,
        departmentName,
        anonymous: data.participantAnonymous === 'yes',
        reporterAnonymous: data.reporterAnonymous,

        // Contact information
        contact: {
          time: Array.isArray(data.contactTime)
            ? data.contactTime
            : [data.contactTime],
          method: Array.isArray(data.contactMethod)
            ? data.contactMethod
            : [data.contactMethod],
        },

        // FeedbackSchema fields matching schema
        feedback: data.feedback,
        happenTime: new Date(data.happenTime), // Convert to Date object
        recogniseStaff: data.recogniseStaff === 'Yes', // Convert to boolean
        staff: data.staff || undefined, // ObjectId or undefined (if not recognising staff)
        shareFeedback: data.shareFeedback === 'Yes', // Convert to boolean
        publicity: data.publicity === 'Yes', // Convert to boolean
      };

      // Clean or remove empty values
      const cleanedPayload = removeEmptyValues(payload);

      const response = await axiosInstance.post(`/complaints`, cleanedPayload);
      if (response?.data?.success) {
        toast.success('Feedback Submitted Successfully');
        navigate('/forms/complaint');
      }
    } catch (error) {
      toast.error('Submission Failed');
      console.error('Error submitting feedback:', error);
    }
  };

  // Fix staffOptions to handle undefined
  const staffOptions =
    staffMembers?.map((staff) => ({
      value: staff._id,
      label: staff.name,
    })) || [];

  return (
    <div>
      <FormProvider {...methods}>
        <div className="py-8 px-4 max-w-xl mx-auto bg-white">
          <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
            Compliment or positive feedback
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CommonFieldForm from="compliments" />

            {reporterAnonymous === 'fully-anonymous' && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-start">
                  Do you want to remain anonymous?
                </h2>
                <h5 className="text-gray-700 mb-2">Anonymous Compliment: </h5>
                <ul className="list-disc text-gray-700 mb-6 pl-6">
                  <li>
                    We can investigate anonymous
                    compliment/suggestion/compliment, but we may not be able to
                    update you on progress.
                  </li>
                  <li>
                    We recommend providing at least a way to contact you, which
                    we will keep confidential.
                  </li>
                  <li>
                    If your complaint involves serious safety concerns, we may
                    still need to take actions even if anonymous.
                  </li>
                </ul>
              </div>
            )}

            {/* Feedback */}

            <Controller
              name="feedback"
              control={control}
              rules={{ required: 'Please enter your feedback' }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="What did we do well?"
                  placeholder="Share your positive experience here..."
                  error={errors.feedback?.message}
                  required
                />
              )}
            />

            {/* When did it happen */}
            <Controller
              name="happenTime"
              control={control}
              rules={{ required: 'Please select a date' }}
              render={({ field }) => (
                <DateSelection
                  {...field}
                  label="When did this happen?"
                  placeholder="Select date"
                  error={errors.happenTime?.message}
                  maxDate={new Date().toISOString()}
                  required
                />
              )}
            />

            {/* Should we recognise a staff */}
            <Controller
              name="recogniseStaff"
              control={control}
              rules={{ required: 'Please choose an option' }}
              render={({ field }) => (
                <Radio
                  {...field}
                  title="Should we recognise a staff member?"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' },
                  ]}
                  error={errors.recogniseStaff?.message}
                  isOptionsAreVertical={true}
                  required
                />
              )}
            />

            {/* Staff Selection - Only show if recogniseStaff is Yes */}
            {methods.watch('recogniseStaff') === 'Yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select staff member
                  <span className="text-red-500 ml-1">*</span>
                </label>

                {isLoadingStaff ? (
                  <div className="text-sm text-gray-500 py-2">
                    Loading staff members...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Controller
                      name="staff"
                      control={control}
                      rules={{
                        required: 'Please select a staff member',
                      }}
                      render={({ field }) => (
                        <div ref={staffSelectRef}>
                          <SearchableSelect
                            {...field}
                            options={staffOptions}
                            placeholder="Type to search staff member..."
                            isSearchable={true}
                            baseInputRef={staffSelectRef}
                          />
                          {errors.staff && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.staff.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    {/* Share Feedback Privately or Directly */}
                    <Controller
                      name="shareFeedback"
                      control={control}
                      rules={{ required: 'Please choose an option' }}
                      render={({ field }) => (
                        <Radio
                          {...field}
                          title="Would you like us to share your feedback with the staff member?"
                          options={[
                            { value: 'Yes', label: 'Yes, please share' },
                            {
                              value: 'No',
                              label: 'No, keep it confidential',
                            },
                          ]}
                          error={errors.shareFeedback?.message}
                          isOptionsAreVertical={true}
                          required
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Publicity Permission */}
            <Controller
              name="publicity"
              control={control}
              rules={{ required: 'Please choose an option' }}
              render={({ field }) => (
                <Radio
                  {...field}
                  title="Can we use your feedback publicly?"
                  options={[
                    { value: 'Yes', label: 'Yes, please share' },
                    {
                      value: 'No',
                      label: 'No, keep it confidential',
                    },
                  ]}
                  error={errors.publicity?.message}
                  isOptionsAreVertical={true}
                  required
                />
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Compliment'}
            </button>
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default ComplementForm;
