import { Checkbox, Radio } from '@components/reusable/FormInputs';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const CommonFieldForm = ({ from }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const reporterAnonymousOptions = [
    {
      value: 'no-anonymous',
      label:
        'No, you can have my details (Recommended - allows us to update you)',
    },
    {
      value: 'partially-anonymous',
      label:
        'Partially anonymous (Contact me, but keep my identity confidential from others)',
    },
    {
      value: 'fully-anonymous',
      label: 'Fully anonymous (I understand you may not be able to update me)',
    },
  ];

  const contactTimeOptions = [
    {
      value: 'Weekday morning (09am - 12pm)',
      label: 'Weekday mornings (9am-12pm)',
    },
    {
      value: 'Weekday afternoons (12pm - 05pm)',
      label: 'Weekday afternoons (12pm-5pm)',
    },
    { value: 'Weekends', label: 'Weekends' },
    { value: 'Anytime', label: 'Anytime' },
  ];

  const contactMethodOptions = [
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'video call', label: 'Video Call' },
  ];

  return (
    <div className="pt-5 space-y-8">
      {from !== 'compliments' && (
        <div>
          {/* Have Consent */}
          <Controller
            name="haveConsent"
            control={control}
            rules={{ required: 'Please select an option' }}
            render={({ field }) => (
              <Radio
                {...field}
                title="Do you have consent to make this complaint/provide feedback on behalf of the participant?"
                options={[
                  {
                    value: 'Yes',
                    label: 'Yes, I have verbal consent',
                  },
                  {
                    value: 'No',
                    label:
                      "No, but I'm raising this in the participant's best interest",
                  },
                ]}
                error={errors.haveConsent?.message}
                isOptionsAreVertical={true}
                required
              />
            )}
          />

          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-start">
            About the participant
          </h3>
          {/* Reporter Anonymous */}
          <Controller
            name="reporterAnonymous"
            control={control}
            rules={{ required: 'Please select an option' }}
            render={({ field }) => (
              <Radio
                {...field}
                title="Would the participant like to remain anonymous?"
                options={reporterAnonymousOptions}
                error={errors.reporterAnonymous?.message}
                isOptionsAreVertical={true}
                required
              />
            )}
          />
        </div>
      )}

      {/* Contact Preferences */}
      {/* Contact Time */}
      <Controller
        name="contactTime"
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            multiselect
            title="Best time to contact the participant"
            options={contactTimeOptions}
            isOptionsAreVertical={true}
            error={errors?.contactTime?.message}
          />
        )}
      />

      {/* Contact Method */}
      <Controller
        name="contactMethod"
        control={control}
        rules={{ required: 'Please select a method' }}
        render={({ field }) => (
          <Checkbox
            {...field}
            multiselect
            title="Preferred contact method"
            options={contactMethodOptions}
            error={errors?.contactMethod?.message}
            isOptionsAreVertical={true}
            required
          />
        )}
      />
    </div>
  );
};

export default CommonFieldForm;
