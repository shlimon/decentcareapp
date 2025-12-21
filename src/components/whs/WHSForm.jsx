import { Radio } from '@components/reusable/FormInputs';
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
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                     Conflict of Interest Form
                  </h2>

                  {/* Form fields go here */}
                  <Controller
                     name="conflictType"
                     control={control}
                     rules={{ required: 'Conflict type is required' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Type of Event"
                           options={[
                              {
                                 value: 'Incident',
                                 label: 'Incident (injury Occured)',
                              },
                              {
                                 value: 'Near Miss',
                                 label: 'Near Miss (no injury, but could have caused harm)',
                              },
                              {
                                 value: 'Hazard',
                                 label: 'Hazard (potential risk identified)',
                              },
                           ]}
                           error={errors.conflictType?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="hasWitness"
                     control={control}
                     rules={{
                        validate: (value) =>
                           (value !== undefined &&
                              value !== null &&
                              value !== '') ||
                           'Staff confirmation is required',
                     }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Were there any Witnesses?"
                           options={[
                              {
                                 value: true,
                                 label: 'Yes',
                              },
                              {
                                 value: false,
                                 label: 'No',
                              },
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
                        rules={{ required: 'Description is required' }}
                        render={({ field }) => (
                           <Textarea
                              {...field}
                              label="Witness names and contact Details?"
                              placeholder="Enter witness details"
                              error={errors.witnessDetails?.message}
                              required
                           />
                        )}
                     />
                  )}
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default WHSForm;
