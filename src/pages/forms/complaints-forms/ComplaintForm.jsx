import axiosInstance from '@api/axiosInstance';
import {
  Checkbox,
  DateSelection,
  File,
  Radio,
  Select,
  Text,
  Textarea,
} from '@components/reusable/FormInputs';
import TimeInput from '@components/reusable/FormInputs/TimeInput';
import GoogleMapSearchBox from '@components/reusable/GoogleMapSearchBox/GoogleMapSearchBox';
import useAllStaffsQuery from '@hooks/useAllStaffsQuery';
import { cleanPhoneNumber } from '@utils/cleanPhoneNumber';
import { removeEmptyValues } from '@utils/removeEmptyValues';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';
import CommonFieldForm from './CommonFieldForm';

const ComplaintForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: staffMembers, isLoading: isLoadingStaff } = useAllStaffsQuery();

  const [participant, setParticipant] = useState('');
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const participantParam = queryParams.get('participant');
    const departmentParam = queryParams.get('department');

    if (participantParam) setParticipant(participantParam);
    if (departmentParam) setDepartmentName(decodeURIComponent(departmentParam));
  }, [location.search]);

  const methods = useForm({
    defaultValues: {
      type: 'complaints',
      haveConsent: '',
      reporterAnonymous: '',
      participantAnonymous: '',

      contactTime: [],
      contactMethod: [],

      needSupportPerson: '',
      supportPerson: {
        relation: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
      },

      // new fields for complaint
      isStaffBehaviourInvolved: '',
      concernToStaffMember: '',
      otherConcernToStaffMember: '',
      involvedStaffMember: '',
      evidences: [],

      complain: '',
      occurTime: '',
      occurDate: '',
      //   address
      fullAddress: '',
      street: '',
      suburb: '',
      state: '',
      postCode: '',
      city: '',
      country: '',
      lat: '',
      lng: '',

      resolveSuggestion: '',
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const reporterAnonymous = watch('reporterAnonymous');
  const isStaffBehaviourInvolved = watch('isStaffBehaviourInvolved');
  const concernToStaffMember = watch('concernToStaffMember');
  const hasEvidenceValue = watch('hasEvidence');

  const onSubmit = async (data) => {
    const payload = {
      // Base fields
      type: data.type,
      haveConsent: data.haveConsent === 'yes',
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

      // Support person
      needSupportPerson: data.needSupportPerson === 'Yes',
      supportPerson:
        data.needSupportPerson === 'Yes'
          ? {
              relation: data.supportPerson.relation,
              firstName: data.supportPerson.firstName,
              lastName: data.supportPerson.lastName,
              phone: cleanPhoneNumber(data.supportPerson.phone),
              email: data.supportPerson.email,
            }
          : undefined,

      // Staff behaviour fields
      isStaffBehaviourInvolved: data.isStaffBehaviourInvolved === 'Yes',
      concernToStaffMember: data.concernToStaffMember,
      otherConcernToStaffMember: data.otherConcernToStaffMember,
      involvedStaffMember: data.involvedStaffMember,

      // Complaint details
      complain: data.complain,
      occurTime: data.occurTime,
      occurDate: data.occurDate ? new Date(data.occurDate) : new Date(),
      address: {
        fullAddress: data.fullAddress,
        street: data.street,
        suburb: data.suburb,
        state: data.state,
        postCode: data.postCode,
        city: data.city,
        country: data.country,
        lat: data.lat,
        lng: data.lng,
      },

      resolveSuggestion: data.resolveSuggestion,
      // hasEvidence: data.hasEvidence,
    };

    const hasFiles =
      data.hasEvidence && data.evidences && data.evidences.length > 0;

    try {
      let response;

      const cleanPayload = removeEmptyValues(payload);

      if (hasFiles) {
        // multipart/form-data
        const formData = new FormData();

        Object.entries(cleanPayload).forEach(([key, value]) => {
          if (value === undefined || value === null) return;

          if (typeof value === 'object' && !Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });

        data.evidences.forEach((file) => {
          formData.append('evidences', file);
        });

        response = await axiosInstance.post('/complaints', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // application/json
        response = await axiosInstance.post('/complaints', cleanPayload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (response?.data?.success) {
        toast.success('Formal Complaint Submitted Successfully');
        navigate('/forms/complaint');
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Submission Failed. Please try again.',
      );
      console.error('Error submitting complaint:', error);
    }
  };

  const needSupport = watch('needSupportPerson');

  // const supportPersonRelation = watch('supportPerson.relation');

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
            Formal Complaint
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <CommonFieldForm />

            {reporterAnonymous === 'fully-anonymous' && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-start">
                  Do you want to remain anonymous?
                </h2>
                <h5 className="text-gray-700 mb-2">Anonymous Complaints: </h5>
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
            {/* Support Person Section */}
            <Controller
              name="needSupportPerson"
              control={control}
              rules={{ required: 'Please select an option' }}
              render={({ field }) => (
                <Radio
                  {...field}
                  title="Do You Want a Support Person Involved?"
                  options={[
                    {
                      value: 'Yes',
                      label: 'Yes, I would like someone to support me',
                    },
                    {
                      value: 'No',
                      label: "No, I'll handle this myself",
                    },
                  ]}
                  onExtraChange={() => {
                    setValue('supportPerson.relation', '');
                    setValue('supportPerson.firstName', '');
                    setValue('supportPerson.lastName', '');
                    setValue('supportPerson.phone', '');
                    setValue('supportPerson.email', '');
                  }}
                  error={errors.needSupportPerson?.message}
                  isOptionsAreVertical={true}
                  required
                />
              )}
            />

            {needSupport === 'Yes' && (
              <div className="space-y-6  rounded-lg ">
                <Controller
                  name="supportPerson.relation"
                  control={control}
                  render={({ field }) => (
                    <Radio
                      {...field}
                      title="Their relationship to you:"
                      options={[
                        {
                          value: 'Family member',
                          label: 'Family member',
                        },
                        { value: 'Friend', label: 'Friend' },
                        {
                          value: 'Paid advocate',
                          label: 'Paid advocate',
                        },
                        {
                          value: 'Disability advocate',
                          label: 'Disability advocate',
                        },
                        {
                          value: 'Legal representative',
                          label: 'Legal representative',
                        },
                        {
                          value: 'Guardian/Nominee',
                          label: 'Guardian/Nominee',
                        },
                        {
                          value: 'NDIS Support Coordinator',
                          label: 'NDIS Support Coordinator',
                        },
                        { value: 'Others', label: 'Others' },
                      ]}
                      error={errors.supportPerson?.relation?.message}
                      isOptionsAreVertical={true}
                    />
                  )}
                />
                {/* {supportPersonRelation === 'Others' && (
                           <Controller
                              name="supportPerson.relationOther"
                              control={control}
                              render={({ field }) => (
                                 <Text
                                    {...field}
                                    label="Please specify"
                                    placeholder="Please type another option here"
                                    error={
                                       errors.supportPerson?.relationOther
                                          ?.message
                                    }
                                 />
                              )}
                           />
                        )} */}

                <h3 className="col-span-2 font-semibold text-gray-700 flex items-start">
                  Support Person Details
                </h3>
                <Controller
                  name="supportPerson.firstName"
                  control={control}
                  render={({ field }) => <Text {...field} label="First Name" />}
                />
                <Controller
                  name="supportPerson.lastName"
                  control={control}
                  render={({ field }) => <Text {...field} label="Last Name" />}
                />

                <Controller
                  name="supportPerson.phone"
                  control={control}
                  render={({ field }) => (
                    <Text {...field} label="Support Person Phone" />
                  )}
                />
                <Controller
                  name="supportPerson.email"
                  control={control}
                  render={({ field }) => (
                    <Text {...field} label="Support Person Email" />
                  )}
                />
              </div>
            )}

            <Controller
              name="isStaffBehaviourInvolved"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <Radio
                  {...field}
                  title="Does this complaint relate to the conduct or behaviour of a staff member?"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' },
                  ]}
                  onExtraChange={() => {
                    setValue('concernToStaffMember', '');
                    setValue('otherConcernToStaffMember', '');
                  }}
                  error={errors.isStaffBehaviourInvolved?.message}
                  isOptionsAreVertical={true}
                  required
                />
              )}
            />
            {isStaffBehaviourInvolved === 'Yes' && (
              <>
                <Controller
                  name="concernToStaffMember"
                  control={control}
                  rules={{
                    required: 'Please select at least one concern type',
                    validate: (value) =>
                      (Array.isArray(value) && value.length > 0) ||
                      'Please select at least one concern type',
                  }}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      title="How would you describe the concern regarding the staff member?"
                      options={[
                        {
                          value: 'Communication or responsiveness',
                          label: 'Communication or responsiveness',
                        },
                        {
                          value: 'Professional behaviour',
                          label: 'Professional behaviour',
                        },
                        {
                          value: 'Respect or attitude',
                          label: 'Respect or attitude',
                        },
                        {
                          value: 'Reliability or punctuality',
                          label: 'Reliability or punctuality',
                        },
                        {
                          value: 'Quality of support provided',
                          label: 'Quality of support provided',
                        },
                        { value: 'Other', label: 'Other' },
                      ]}
                      error={errors.concernToStaffMember?.message}
                      isOptionsAreVertical={true}
                      required
                    />
                  )}
                />

                {concernToStaffMember?.includes('Other') && (
                  <Controller
                    name="otherConcernToStaffMember"
                    control={control}
                    rules={{
                      required: 'Please specify what "Other" refers to',
                    }}
                    render={({ field }) => (
                      <Text
                        label="Please specify the other type of concern"
                        placeholder="Specify what 'Other' refers to"
                        {...field}
                        error={errors.otherConcernToStaffMember?.message}
                        required
                      />
                    )}
                  />
                )}
              </>
            )}

            <div className="border border-gray-200 px-2 py-1 rounded-md">
              {isLoadingStaff ? (
                <div className="text-sm text-gray-500 py-2">
                  Loading staff members...
                </div>
              ) : (
                <Controller
                  name="involvedStaff"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isSearchable
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      label="Select Staff Member Involved"
                      options={staffOptions}
                      error={errors?.relatedStaff?.message}
                      multiple={false}
                    />
                  )}
                />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-start">
                Please tell us what happened.
              </h2>
              <h5 className="text-gray-700 text-base">
                This is the most important part of your complaint. Please
                provide as much as details as you can.
              </h5>
              <h5 className="text-gray-700 text-base font-bold pt-4 pb-1">
                Helpful Tips
              </h5>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Describe what happened step by step.</li>
                <li>Include what was said and done.</li>
                <li>Explain how it made you feel.</li>
                <li>Mention if this has happened before.</li>
                <li>Include any relevant background information.</li>
              </ul>
            </div>

            {/* Complaint */}
            <Controller
              name="complain"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="What happened?"
                  placeholder="Describe your complaint here..."
                  error={errors.complain?.message}
                  required
                />
              )}
            />

            {/* Time & Date */}
            <h3 className="text-gray-800 flex items-start">
              When did this happen?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="occurTime"
                control={control}
                render={({ field }) => (
                  <TimeInput
                    {...field}
                    label="Time"
                    placeholder="Select time"
                    error={errors.occurTime?.message}
                    showClock={false}
                  />
                )}
              />
              <Controller
                name="occurDate"
                control={control}
                render={({ field }) => (
                  <DateSelection
                    {...field}
                    label="Date"
                    placeholder="Select date"
                    error={errors.occurDate?.message}
                    maxDate={new Date().toISOString()}
                  />
                )}
              />
            </div>

            {/* Address Group */}
            <div className="space-y-4">
              <h5 className="text-gray-800 flex items-start">
                Where did this happen?
              </h5>

              <GoogleMapSearchBox label="Location of the incident" />
              <div className="mt-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Number & Street <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="street"
                    control={control}
                    rules={{
                      required: 'Street address is required',
                    }}
                    render={({ field }) => (
                      <>
                        <input
                          type="text"
                          placeholder="Street address"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            errors.street
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        {errors.street && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.street.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suburb <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="suburb"
                      control={control}
                      rules={{
                        required: 'Suburb is required',
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            placeholder="Suburb"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.suburb
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {errors.suburb && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.suburb.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="state"
                      control={control}
                      rules={{
                        required: 'State is required',
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            placeholder="State"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.state
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {errors.state && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.state.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="postCode"
                      control={control}
                      rules={{
                        required: 'Postcode is required',
                        pattern: {
                          value: /^\d{4}$/,
                          message: 'Invalid Australian postcode',
                        },
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            placeholder="Postcode"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.postCode
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {errors.postCode && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.postCode.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="country"
                      control={control}
                      rules={{
                        required: 'Country is required',
                        validate: (value) =>
                          value.toLowerCase() === 'australia' ||
                          'Country must be Australia',
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            type="text"
                            placeholder="Country"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                              errors.country
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {errors.country && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.country.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Suggestion */}
            <Controller
              name="resolveSuggestion"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="How do you feel this issue should be resolved?"
                  placeholder="Share your thoughts..."
                />
              )}
            />

            <Controller
              name="hasEvidence"
              control={control}
              rules={{
                validate: (value) =>
                  (value !== undefined && value !== null && value !== '') ||
                  'Please select an option',
              }}
              render={({ field }) => (
                <Radio
                  {...field}
                  title="Upload evidence or documentation?"
                  options={[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' },
                  ]}
                  onExtraChange={() => {
                    setValue('evidences', '');
                  }}
                  error={errors.hasEvidence?.message}
                  isOptionsAreVertical={true}
                />
              )}
            />

            {hasEvidenceValue && (
              <Controller
                name="evidences"
                control={control}
                rules={{
                  required: 'At least one photo/video is required',
                }}
                render={({ field: { onChange, value } }) => (
                  <File
                    value={value}
                    onChange={onChange}
                    title="Upload files"
                    description="Upload media files for release"
                    accept={[
                      'image/*',
                      'application/pdf',
                      'pdf',
                      'docs/*',
                      '.jpg',
                      '.jpeg',
                      '.png',
                    ]}
                    supportedFormats={['JPG', 'JPEG', 'PNG', 'PDF', 'DOCS']}
                    maxSize={10 * 1024 * 1024}
                    error={errors.evidences?.message}
                    multiple={true}
                    enableImageCropping={true}
                    required
                  />
                )}
              />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default ComplaintForm;
