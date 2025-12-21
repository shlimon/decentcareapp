import { Checkbox, Radio } from '@components/reusable/FormInputs';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

const WHSForm = () => {
   const methods = useForm({
      defaultValues: {
         // Type of event
         eventType: '', // 'incident' | 'nearMiss' | 'hazard'

         // Event info
         eventDate: '',
         eventTime: '',
         location: '', // Google Maps link or address

         // Witness
         hasWitness: false,
         witnessDetails: '',

         // Description
         leadUp: '',
         whatHappened: '',

         // Equipment / task / work practice involved
         equipmentInvolved: false,
         equipmentDetails: '',

         // ========== INCIDENT ==========
         injuryNature: '',
         treatmentProvided: false,
         treatmentDetails: '',
         returnedToWork: false,
         returnToWorkDetails: '',

         // ========== NEAR MISS ==========
         potentialOutcome: '',
         preventionReason: '',
         couldHappenAgain: '', // 'yes' | 'no' | 'unsure'
         futurePreventionActions: '',

         // ========== HAZARD ==========
         hazardRiskLevel: '',
         // 'noInjury' | 'minorInjury' | 'majorInjury' | 'fatality'

         hierarchyOfControls: [],
         // e.g. ['eliminate', 'substitute', 'isolate', 'engineering', 'administrative', 'ppe']

         // ========== COMMON ==========
         hasEvidence: false,
         evidenceFiles: [], // File[] if using file input
      },
   });

   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = methods;

   const hasWitnessValue = watch('hasWitness');
   const eventTypeValue = watch('eventType');
   const equipmentInvolvedValue = watch('equipmentInvolved');
   const treatmentProvidedValue = watch('treatmentProvided');
   const returnedToWorkValue = watch('returnedToWork');
   const hasEvidenceValue = watch('hasEvidence');

   return (
      <div>
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                     Event Report Form
                  </h2>

                  {/* Type of Event */}
                  <Controller
                     name="eventType"
                     control={control}
                     rules={{ required: 'Type of event is required' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Type of Event"
                           options={[
                              {
                                 value: 'incident',
                                 label: 'Incident (injury Occurred)',
                              },
                              {
                                 value: 'nearMiss',
                                 label: 'Near Miss (no injury, but could have caused harm)',
                              },
                              {
                                 value: 'hazard',
                                 label: 'Hazard (potential risk identified)',
                              },
                           ]}
                           error={errors.eventType?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* Witness */}
                  <Controller
                     name="hasWitness"
                     control={control}
                     rules={{
                        validate: (value) =>
                           (value !== undefined &&
                              value !== null &&
                              value !== '') ||
                           'Please indicate if there were any witnesses',
                     }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Were there any witnesses?"
                           options={[
                              { value: true, label: 'Yes' },
                              { value: false, label: 'No' },
                           ]}
                           error={errors.hasWitness?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {hasWitnessValue && (
                     <Controller
                        name="witnessDetails"
                        control={control}
                        rules={{ required: 'Witness details are required' }}
                        render={({ field }) => (
                           <Textarea
                              {...field}
                              label="Witness names and contact details"
                              placeholder="Enter witness details"
                              error={errors.witnessDetails?.message}
                              required
                           />
                        )}
                     />
                  )}

                  {/* Description */}
                  <Controller
                     name="leadUp"
                     control={control}
                     rules={{ required: 'This field is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="What led up to the event?"
                           placeholder="Describe what led up to the event"
                           error={errors.leadUp?.message}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="whatHappened"
                     control={control}
                     rules={{ required: 'This field is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="What happened?"
                           placeholder="Describe what happened"
                           error={errors.whatHappened?.message}
                           required
                        />
                     )}
                  />

                  {/* Equipment involved */}
                  <Controller
                     name="equipmentInvolved"
                     control={control}
                     rules={{
                        validate: (value) =>
                           (value !== undefined &&
                              value !== null &&
                              value !== '') ||
                           'Please select an option',
                     }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Any equipment, tasks, or work practice involved?"
                           options={[
                              { value: true, label: 'Yes' },
                              { value: false, label: 'No' },
                           ]}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {equipmentInvolvedValue && (
                     <Controller
                        name="equipmentDetails"
                        control={control}
                        rules={{ required: 'Details are required' }}
                        render={({ field }) => (
                           <Textarea
                              {...field}
                              label="Provide details"
                              placeholder="Enter details"
                              error={errors.equipmentDetails?.message}
                              required
                           />
                        )}
                     />
                  )}

                  {/* ========== INCIDENT ========== */}
                  {eventTypeValue === 'incident' && (
                     <>
                        <Controller
                           name="injuryNature"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="Nature of the injury"
                                 placeholder="Describe the injury"
                                 error={errors.injuryNature?.message}
                              />
                           )}
                        />

                        <Controller
                           name="treatmentProvided"
                           control={control}
                           rules={{
                              validate: (value) =>
                                 (value !== undefined &&
                                    value !== null &&
                                    value !== '') ||
                                 'Please select an option',
                           }}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Was treatment provided?"
                                 options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                 ]}
                                 error={errors.treatmentProvided?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />

                        {treatmentProvidedValue && (
                           <Controller
                              name="treatmentDetails"
                              control={control}
                              render={({ field }) => (
                                 <Textarea
                                    {...field}
                                    label="Treatment details"
                                    placeholder="Provide treatment details"
                                    error={errors.treatmentDetails?.message}
                                 />
                              )}
                           />
                        )}

                        <Controller
                           name="returnedToWork"
                           control={control}
                           rules={{
                              validate: (value) =>
                                 (value !== undefined &&
                                    value !== null &&
                                    value !== '') ||
                                 'Please select an option',
                           }}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Did you return to work after the incident?"
                                 options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                 ]}
                                 error={errors.returnedToWork?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />

                        {returnedToWorkValue && (
                           <Controller
                              name="returnToWorkDetails"
                              control={control}
                              render={({ field }) => (
                                 <Textarea
                                    {...field}
                                    label="Return to work details"
                                    placeholder="Same shift or later?"
                                    error={errors.returnToWorkDetails?.message}
                                 />
                              )}
                           />
                        )}
                     </>
                  )}

                  {/* ========== NEAR MISS ========== */}
                  {eventTypeValue === 'nearMiss' && (
                     <>
                        <Controller
                           name="potentialOutcome"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="What could have happened?"
                                 placeholder="Potential injury or severity"
                                 error={errors.potentialOutcome?.message}
                              />
                           )}
                        />

                        <Controller
                           name="preventionReason"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="What prevented harm?"
                                 placeholder="Quick action, safety control, luck, etc."
                                 error={errors.preventionReason?.message}
                              />
                           )}
                        />

                        <Controller
                           name="couldHappenAgain"
                           control={control}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Do you believe this could happen again?"
                                 options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                    { value: 'unsure', label: 'Unsure' },
                                 ]}
                                 error={errors.couldHappenAgain?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />

                        <Controller
                           name="futurePreventionActions"
                           control={control}
                           render={({ field }) => (
                              <Textarea
                                 {...field}
                                 label="What actions could prevent this in future?"
                                 placeholder="Describe prevention actions"
                                 error={errors.futurePreventionActions?.message}
                              />
                           )}
                        />
                     </>
                  )}

                  {/* ========== HAZARD ========== */}
                  {eventTypeValue === 'hazard' && (
                     <>
                        <Controller
                           name="hazardRiskLevel"
                           control={control}
                           rules={{
                              validate: (value) =>
                                 (value !== undefined &&
                                    value !== null &&
                                    value !== '') ||
                                 'select a risk level',
                           }}
                           render={({ field }) => (
                              <Radio
                                 {...field}
                                 title="Risk level"
                                 options={[
                                    {
                                       value: 'noInjury',
                                       label: 'No injury or minimal discomfort',
                                    },
                                    {
                                       value: 'minorInjury',
                                       label: 'First aid required only - Minor Injury',
                                    },
                                    {
                                       value: 'majorInjury',
                                       label: 'Medical treatment or time off - Major Injury',
                                    },
                                    {
                                       value: 'fatality',
                                       label: 'Fatality - Death or permanent disability',
                                    },
                                 ]}
                                 error={errors.hazardRiskLevel?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />

                        <Controller
                           name="hierarchyOfControls"
                           control={control}
                           render={({ field }) => (
                              <Checkbox
                                 {...field}
                                 title="Hierarchy of Controls (select all that apply)"
                                 options={[
                                    {
                                       value: 'eliminate',
                                       label: 'Eliminate the hazard',
                                    },
                                    {
                                       value: 'substitute',
                                       label: 'Substitute with a safer option',
                                    },
                                    {
                                       value: 'isolate',
                                       label: 'Isolate the hazard',
                                    },
                                    {
                                       value: 'engineering',
                                       label: 'Engineering controls',
                                    },
                                    {
                                       value: 'administrative',
                                       label: 'Administrative controls',
                                    },
                                    {
                                       value: 'ppe',
                                       label: 'Personal Protective Equipment',
                                    },
                                 ]}
                                 isOptionsAreVertical={true}
                                 error={errors.hierarchyOfControls?.message}
                                 multiple={true}
                              />
                           )}
                        />
                     </>
                  )}

                  {/* ========== COMMON ========== */}
                  <Controller
                     name="hasEvidence"
                     control={control}
                     rules={{
                        validate: (value) =>
                           (value !== undefined &&
                              value !== null &&
                              value !== '') ||
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
                           error={errors.hasEvidence?.message}
                           isOptionsAreVertical={true}
                        />
                     )}
                  />

                  {hasEvidenceValue && (
                     <Controller
                        name="evidenceFiles"
                        control={control}
                        render={({ field }) => (
                           <FileUpload
                              {...field}
                              label="Upload files (PDF, image, video)"
                           />
                        )}
                     />
                  )}

                  <button
                     type="submit"
                     className="w-full bg-blue-600 text-white py-2 rounded-md"
                  >
                     Submit
                  </button>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default WHSForm;
