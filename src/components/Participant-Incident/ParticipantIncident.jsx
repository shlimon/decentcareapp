import axiosInstance from '@api/axiosInstance';
import GoogleMapSearchBox from '@components/reusable/GoogleMapSearchBox/GoogleMapSearchBox';
import SearchableSelect from '@components/reusable/SearchableSelect';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ParticipantIncident() {
  const methods = useForm({
    defaultValues: {
      participant: '',
      dateRecorded: '',
      dateOfIncident: '',
      timeOfIncident: '',

      incidentOnProvisionOfService: '',
      incidentOnStaffPresence: '',

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

      hasWitnesses: '',
      witnessDetails: '',
      incidentDescription: '',
      resultedInInjury: '',
      treatmentProvided: '',
      natureOfInjury: '',
      equipmentInvolved: '',
      equipmentDetails: '',
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const watchDateRecorded = watch('dateRecorded');
  const watchDateOfIncident = watch('dateOfIncident');
  const watchHasWitnesses = watch('hasWitnesses');
  const watchResultedInInjury = watch('resultedInInjury');
  const watchEquipmentInvolved = watch('equipmentInvolved');

  const onSubmit = async (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recordedDate = new Date(data.dateRecorded);
    recordedDate.setHours(0, 0, 0, 0);

    const incidentDate = new Date(data.dateOfIncident);
    incidentDate.setHours(0, 0, 0, 0);

    if (recordedDate > today) {
      toast.error(
        'Date that the incident was recorded on cannot be in the future.'
      );
      return;
    }

    if (incidentDate > recordedDate) {
      toast.error(
        'Date of the Incident must be before or equal to the date it was recorded.'
      );
      return;
    }

    try {
      const formattedData = {
        participant: data.participant,
        incidentOnProvisionOfService:
          data.incidentOnProvisionOfService === 'yes',
        incidentOnStaffPresence: data.incidentOnStaffPresence === 'yes',
        incidentDetails: {
          dateOfIncident: data.dateOfIncident,
          timeOfIncident: data.timeOfIncident,
          incidentRecordDate:
            data.dateRecorded || new Date().toISOString().split('T')[0],
          location: {
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
        },
        witnesses: data.hasWitnesses === 'yes',
        witnessDetails: data.witnessDetails || '',
        descriptionOfIncident: data.incidentDescription,
        didInjured: data.resultedInInjury === 'yes',
        treatmentProvided: data.treatmentProvided || '',
        natureOfInjury: data.natureOfInjury || '',
        equipmentInvolved: data.equipmentInvolved === 'yes',
        equipmentDetails: data.equipmentDetails || '',
      };

      const response = await axiosInstance.post(
        '/incident-reports',
        formattedData
      );

      const result = response.data;

      if (result.success) {
        toast.success('Incident report submitted successfully!');
        reset();
        window.scrollTo(0, 0);
      } else {
        toast.error(
          result.message || 'Failed to submit report. Please try again.'
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="py-8 px-4 max-w-xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-8">
          Incident Report
        </h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Participant Details
            </h3>

            <Controller
              name="participant"
              control={control}
              rules={{ required: 'Please select a participant' }}
              render={({ field }) => (
                <SearchableSelect
                  label="Select Participant"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Did the incident occur under our provision of Services?{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="yes"
                    {...register('incidentOnProvisionOfService', {
                      required: 'This field is required',
                    })}
                    className="mr-2"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="no"
                    {...register('incidentOnProvisionOfService', {
                      required: 'This field is required',
                    })}
                    className="mr-2"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors.incidentOnProvisionOfService && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.incidentOnProvisionOfService.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Did this incident occur during your visit with the participant?{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="yes"
                    {...register('incidentOnStaffPresence', {
                      required: 'This field is required',
                    })}
                    className="mr-2"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="no"
                    {...register('incidentOnStaffPresence', {
                      required: 'This field is required',
                    })}
                    className="mr-2"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors.incidentOnStaffPresence && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.incidentOnStaffPresence.message}
                </p>
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Incident Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of the Incident <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('dateOfIncident', {
                    required: 'Date of incident is required',
                  })}
                  onKeyDown={(e) => e.preventDefault()}
                  max={
                    watchDateRecorded || new Date().toISOString().split('T')[0]
                  }
                  className={`w-full px-4 py-2 border ${
                    errors.dateOfIncident ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.dateOfIncident && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfIncident.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date that the incident was recorded on{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('dateRecorded', {
                    required: 'Date recorded is required',
                  })}
                  onKeyDown={(e) => e.preventDefault()}
                  min={watchDateOfIncident || undefined}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={!watchDateOfIncident}
                  className={`w-full px-4 py-2 border ${
                    errors.dateRecorded ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100`}
                />
                {errors.dateRecorded && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateRecorded.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time of the Incident <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                {...register('timeOfIncident', {
                  required: 'Time of incident is required',
                })}
                className={`w-full px-4 py-2 border ${
                  errors.timeOfIncident ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.timeOfIncident && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.timeOfIncident.message}
                </p>
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Exact Location of the Incident
            </h3>

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

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Were there any witnesses?{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="yes"
                    {...register('hasWitnesses', {
                      required: 'This field is required',
                    })}
                    className="mr-2"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="no"
                    {...register('hasWitnesses', {
                      required: 'This field is required',
                    })}
                    className="mr-2"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors.hasWitnesses && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.hasWitnesses.message}
                </p>
              )}
            </div>

            {watchHasWitnesses === 'yes' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please List the witnesses full names as well as a contact
                  number for each <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('witnessDetails', {
                    required:
                      watchHasWitnesses === 'yes'
                        ? 'Witness details are required'
                        : false,
                  })}
                  placeholder="Witness details"
                  className={`w-full px-4 py-2 border ${
                    errors.witnessDetails ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  rows="4"
                />
                {errors.witnessDetails && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.witnessDetails.message}
                  </p>
                )}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe how the incident occurred and if there was any damage
                to property or equipment <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('incidentDescription', {
                  required: 'Incident description is required',
                })}
                placeholder="Describe the incident in detail"
                className={`w-full px-4 py-2 border ${
                  errors.incidentDescription
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                rows="6"
              />
              {errors.incidentDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.incidentDescription.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Did this incident result in an injury?{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="yes"
                    {...register('resultedInInjury', {
                      required: 'This field is required',
                    })}
                    className="mr-2"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="no"
                    {...register('resultedInInjury', {
                      required: 'This field is required',
                    })}
                    className="mr-2"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors.resultedInInjury && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.resultedInInjury.message}
                </p>
              )}
            </div>

            {watchResultedInInjury === 'yes' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nature of injury e.g., sprain, cut, burn{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('natureOfInjury', {
                      required:
                        watchResultedInInjury === 'yes'
                          ? 'Nature of injury is required'
                          : false,
                    })}
                    placeholder="Nature of injury"
                    className={`w-full px-4 py-2 border ${
                      errors.natureOfInjury
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    rows="3"
                  />
                  {errors.natureOfInjury && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.natureOfInjury.message}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Was any treatment provided?{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('treatmentProvided', {
                      required:
                        watchResultedInInjury === 'yes'
                          ? 'Treatment details are required'
                          : false,
                    })}
                    placeholder="If yes, please provide details (e.g., first aid given by who, referred to e.g. GP)"
                    className={`w-full px-4 py-2 border ${
                      errors.treatmentProvided
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    rows="3"
                  />
                  {errors.treatmentProvided && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.treatmentProvided.message}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Was any equipment involved in the injury?{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="yes"
                        {...register('equipmentInvolved', {
                          required:
                            watchResultedInInjury === 'yes'
                              ? 'This field is required'
                              : false,
                        })}
                        className="mr-2"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="no"
                        {...register('equipmentInvolved', {
                          required:
                            watchResultedInInjury === 'yes'
                              ? 'This field is required'
                              : false,
                        })}
                        className="mr-2"
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {errors.equipmentInvolved && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.equipmentInvolved.message}
                    </p>
                  )}
                </div>

                {watchEquipmentInvolved === 'yes' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provide Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('equipmentDetails', {
                        required:
                          watchEquipmentInvolved === 'yes'
                            ? 'Equipment details are required'
                            : false,
                      })}
                      placeholder="Details of the equipment involved"
                      className={`w-full px-4 py-2 border ${
                        errors.equipmentDetails
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      rows="3"
                    />
                    {errors.equipmentDetails && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.equipmentDetails.message}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Incident Report'}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
