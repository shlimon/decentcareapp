import axiosInstance from '@api/axiosInstance';
import {
   DateSelection,
   File,
   Radio,
   Text,
} from '@components/reusable/FormInputs';
import SignatureCanvas from '@components/travel-log/SignatureCanvas';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';

const MediaReleaseForm = () => {
   const location = useLocation();
   const navigate = useNavigate();

   const [participant, setParticipant] = useState('');

   useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const participantParam = queryParams.get('participant');

      if (participantParam) setParticipant(participantParam);
   }, [location.search]);

   const methods = useForm({
      defaultValues: {
         participant: participant,
         submissionDate: '',
         description: '',
         planNominee: '',
         name: '',
         relation: '',
         signer: '',
         signature: '',
         galleries: [],
      },
   });

   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = methods;

   const planNominee = watch('planNominee');
   const relation = watch('relation');
   const signer = watch('signer');
   /* 
    ---backend Schema here---
    const ADMediaReleaseSchema = new Schema(
	{
		participant: { type: Schema.Types.ObjectId, ref: "ADParticipant", required: true },
		staff: { type: Schema.Types.ObjectId, ref: "ADStaff" },
		submissionDate: { type: Date },
		description: { type: String },
		planNominee: { type: Boolean, default: false },
		name: { type: String },
		relation: { type: String },
		signer: { type: String, enum: ["Participant", "Nominee"] },
		signature: { type: String },
		galleries: [{ type: String }]
	},
	
    );

    */

   // if (relation === 'Others')   then  relation = relationOther value can be sent to backend
   const onSubmit = async (data) => {
      try {
         // Validate signatures
         if (!data.signature) {
            toast.error('Participant signature is required');
            return;
         }

         // Create FormData for file uploads
         const formData = new FormData();

         // Required fields
         formData.append('participant', data.participant);
         formData.append('item', data.item);

         // Optional fields
         if (data.paymentMethod) {
            formData.append('paymentMethod', data.paymentMethod);
         }

         if (data.itemPrice) {
            formData.append('itemPrice', Number(data.itemPrice));
         }

         if (data.description) {
            formData.append('description', data.description);
         }

         if (data.transaction) {
            formData.append(
               'transactionDate',
               new Date(data.transaction).toISOString()
            );
         }

         // Add cash payment fields if payment method is Cash
         if (data.paymentMethod === 'Cash') {
            if (data.receiveAmount) {
               formData.append('receiveAmount', Number(data.receiveAmount));
            }
            if (data.returnAmount) {
               formData.append('returnAmount', Number(data.returnAmount));
            }
         }

         // Add signatures as base64 strings in the signature object structure
         // The backend expects: signature.participant and signature.staff
         formData.append('signature[participant]', data.participantSignature);
         formData.append('signature[staff]', data.staffSignature);

         // Add receipt file (single file only)
         // Backend will save this and return URL to store in receipt field
         if (data.receipt) {
            formData.append('receipt', data.receipt);
         }

         const response = await axiosInstance.post(
            '/financial-transactions',
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         );

         console.log('Submission response:', response);

         if (response?.data?.success) {
            toast.success('Transaction Submitted Successfully');
            methods.reset();
            navigate('/forms');
         }
      } catch (error) {
         console.error('Error submitting transaction:', error);
         toast.error(
            error?.response?.data?.message ||
               'Failed to submit transaction. Please try again.'
         );
      }
   };

   return (
      <div>
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="border border-[#D9D9D9] text-sm text-center py-4 px-2 rounded-xl bg-[#F6F6F6] mb-5">
                     Media Form
                  </div>
                  <div>
                     I give consent to Decent Care to use and retain the image/
                     video is attached for advertising purposes including,
                     Decent Care’s website, Social Media (Facebook, Instagram,
                     Twitter), and print advertising material. I understand that
                     I may withdraw this consent at any time by advising Decent
                     Care and my photo/video will be removed or destroyed at
                     this time. I understand that by giving consent, Decent Care
                     can use the image/ recordings to promote their activities.
                     Decent Care may reproduce the image or video in any form,
                     in whole or part, and distribute it by any medium including
                     printed material, the internet, or multimedia. I understand
                     that Decent Care: Will not pay me for giving consent or for
                     the use of this image or recording Will return or destroy
                     images or recordings if I withdraw my consent
                  </div>
                  <Controller
                     name="submissionDate"
                     control={control}
                     rules={{ required: 'Submission date is required' }}
                     render={({ field }) => (
                        <DateSelection
                           label="Date"
                           {...field}
                           placeholder="Select date"
                           error={errors.submissionDate?.message}
                           maxDate={new Date().toISOString()}
                           required
                        />
                     )}
                  />
                  {/* Does the participant have a plan nominee? */}
                  <Controller
                     name="planNominee"
                     control={control}
                     rules={{ required: 'Please select an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Does the participant have a plan nominee? "
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
                           error={errors.planNominee?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {planNominee === true && (
                     <div className="space-y-6  rounded-lg ">
                        <Controller
                           name="name"
                           control={control}
                           rules={{ required: 'Plan nominee name is required' }}
                           render={({ field }) => (
                              <Text
                                 label="Nominee name"
                                 placeholder="Enter nominee name"
                                 {...field}
                                 error={errors.name?.message}
                                 required
                              />
                           )}
                        />
                        <Controller
                           name="relation"
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
                                 error={errors.relation?.message}
                                 isOptionsAreVertical={true}
                              />
                           )}
                        />
                        {relation === 'Others' && (
                           <Controller
                              name="relationOther"
                              control={control}
                              render={({ field }) => (
                                 <Text
                                    {...field}
                                    label="Please specify"
                                    placeholder="Please type another option here"
                                    error={errors.relationOther?.message}
                                 />
                              )}
                           />
                        )}
                     </div>
                  )}

                  {/* Who is signing the form? */}
                  <Controller
                     name="signer"
                     control={control}
                     rules={{ required: 'Please select an option' }}
                     render={({ field }) => (
                        <Radio
                           {...field}
                           title="Who is signing the form? "
                           options={[
                              {
                                 value: 'Participant',
                                 label: 'Participant',
                              },
                              {
                                 value: 'Nominee',
                                 label: 'Nominee',
                              },
                           ]}
                           error={errors.signer?.message}
                           isOptionsAreVertical={true}
                           required
                        />
                     )}
                  />

                  {/* signer */}
                  {signer === 'Nominee' && (
                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                           Signature of the nominee{' '}
                           <span className="text-red-500">*</span>
                        </label>
                        <SignatureCanvas
                           onSignatureChange={(signatureData) =>
                              setValue('signature', signatureData)
                           }
                        />
                        {errors.signature && (
                           <p className="text-sm text-red-600">
                              {errors.signature.message}
                           </p>
                        )}
                     </div>
                  )}
                  {/* signer */}
                  {signer === 'Participant' && (
                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                           Signature of the participant{' '}
                           <span className="text-red-500">*</span>
                        </label>
                        <SignatureCanvas
                           onSignatureChange={(signatureData) =>
                              setValue('signature', signatureData)
                           }
                        />
                        {errors.signature && (
                           <p className="text-sm text-red-600">
                              {errors.signature.message}
                           </p>
                        )}
                     </div>
                  )}

                  <Controller
                     name="description"
                     control={control}
                     rules={{
                        required: 'Description of the photo is required',
                     }}
                     render={({ field }) => (
                        <Text
                           label="Description of the photo"
                           placeholder="Enter description of the photo"
                           {...field}
                           error={errors.description?.message}
                           required
                        />
                     )}
                  />

                  {/* upload photo */}
                  <Controller
                     name="receipt"
                     control={control}
                     rules={{ required: 'Receipt is required' }}
                     render={({ field: { onChange, value } }) => (
                        <File
                           value={value}
                           onChange={onChange}
                           title="Receipt"
                           description="Upload transaction receipt"
                           accept={['image/*', '.jpg', '.jpeg', '.png']}
                           supportedFormats={['JPG', 'JPEG', 'PNG']}
                           maxSize={5 * 1024 * 1024}
                           error={errors.receipt?.message}
                           multiple={true}
                           enableImageCropping={false}
                           required
                        />
                     )}
                  />
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default memo(MediaReleaseForm);
