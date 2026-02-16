import axiosInstance from '@api/axiosInstance';
import { Radio, Textarea } from '@components/reusable/FormInputs';
import SignatureCanvas from '@components/travel-log/SignatureCanvas';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const TrainingEvaluationForm = ({ training, onCancel }) => {
   const [submitting, setSubmitting] = useState(false);
   const queryClient = useQueryClient();

   const {
      control,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm({
      defaultValues: {
         usefulness: '',
         structure: '',
         pace: '',
         explanation: '',
         questionsAnswered: '',
         feedback: '',
         signature: '',
      },
   });

   const ratingOptions = [
      { value: 'Good', label: 'Good' },
      { value: 'Average', label: 'Average' },
      { value: 'Poor', label: 'Poor' },
   ];

   const handleFormSubmit = async (data) => {
      try {
         setSubmitting(true);

         const payload = {
            ...data,
         };

         await axiosInstance.post(
            `/staff-trainings/evaluate/${training._id}/submit`,
            payload,
         );

         // optional success handling
         await queryClient.invalidateQueries({
            queryKey: ['my-trainings'],
         });
         toast.success('Evaluation submitted successfully');
         onCancel();
      } catch (error) {
         console.error(error);
         // toast.error('Failed to submit evaluation');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="space-y-6">
         <Controller
            name="usefulness"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
               <Radio
                  {...field}
                  title="The usefulness of the information received in training."
                  options={ratingOptions}
                  error={errors.usefulness?.message}
                  required
               />
            )}
         />

         <Controller
            name="structure"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
               <Radio
                  {...field}
                  title="The structure of the training session."
                  options={ratingOptions}
                  error={errors.structure?.message}
                  required
               />
            )}
         />

         <Controller
            name="pace"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
               <Radio
                  {...field}
                  title="The pace of the training session."
                  options={ratingOptions}
                  error={errors.pace?.message}
                  required
               />
            )}
         />

         <Controller
            name="explanation"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
               <Radio
                  {...field}
                  title="Trainers ability to explain and illustrate concepts."
                  options={ratingOptions}
                  error={errors.explanation?.message}
                  required
               />
            )}
         />

         <Controller
            name="questionsAnswered"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
               <Radio
                  {...field}
                  title="Trainers ability to answer questions completely."
                  options={ratingOptions}
                  error={errors.questionsAnswered?.message}
                  required
               />
            )}
         />

         <Controller
            name="feedback"
            control={control}
            rules={{ required: 'Feedback is required' }}
            render={({ field }) => (
               <Textarea
                  {...field}
                  label="What did you most like about the training and were there any areas that can be improved?"
                  placeholder="Enter your feedback here..."
                  error={errors.feedback?.message}
                  required
               />
            )}
         />

         <Controller
            name="signature"
            control={control}
            rules={{ required: 'Signature is required' }}
            render={({ field }) => (
               <SignatureCanvas
                  onSignatureChange={(signatureData) => {
                     field.onChange(signatureData);
                     setValue('signature', signatureData);
                  }}
               />
            )}
         />

         <div className="flex justify-end gap-3 pt-4 border-t">
            <button
               type="button"
               onClick={onCancel}
               className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md"
            >
               Cancel
            </button>

            <button
               type="button"
               disabled={submitting}
               onClick={handleSubmit(handleFormSubmit)}
               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:opacity-50"
            >
               {submitting ? 'Submitting...' : 'Submit Evaluation'}
            </button>
         </div>
      </div>
   );
};

export default React.memo(TrainingEvaluationForm);
