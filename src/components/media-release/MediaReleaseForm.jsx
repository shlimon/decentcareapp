import axiosInstance from '@api/axiosInstance';
import {
   DateSelection,
   File,
   Radio,
   Text,
} from '@components/reusable/FormInputs';
import SignatureCanvas from '@components/travel-log/SignatureCanvas';
import useParticipantsQuery from '@hooks/useParticipantsQuery';
import React, { memo, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';

const MediaReleaseForm = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { data: participantData, isLoading: participantLoading } =
      useParticipantsQuery();

   const methods = useForm({
      defaultValues: {
         participant: '',
         submissionDate: '',
         description: '',
         planNominee: false,
         name: '',
         relation: '',
         relationOther: '',
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

   // Set participant from query params
   useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const participantParam = queryParams.get('participant');

      if (participantParam) {
         setValue('participant', participantParam);
      }
   }, [location.search, setValue]);

   // Set participant name once data is loaded from participants query filtering by id from participant param

   const participantId = watch('participant');
   const participantName =
      participantData?.find((p) => p._id.toString() === participantId)?.name ||
      '';
   console.log('Participant Name:', participantName);

   //    useEffect(() => {
   //       const queryParams = new URLSearchParams(location.search);
   //        const participantParam = queryParams.get('participant');
   //        if (
   //            participantParam && participantData && !participantLoading
   //        ) {
   //            const participant = participantData.find(
   //                 (p) => p.id.toString() === participantParam
   //            );
   //            if (participant) {
   //               setValue('participantName', participant.name);
   //            }
   //        }
   //    }, [location.search, participantData, participantLoading, setValue]);

   const planNominee = watch('planNominee');
   const relation = watch('relation');
   const relationOther = watch('relationOther');
   const signer = watch('signer');

   const onSubmit = async (data) => {
      try {
         // Validate signature
         if (!data.signature) {
            toast.error('Signature is required');
            return;
         }

         // Create FormData for file uploads
         const formData = new FormData();

         // Required field
         formData.append('participant', data.participant);

         // Optional fields based on schema
         if (data.submissionDate) {
            formData.append(
               'submissionDate',
               new Date(data.submissionDate).toISOString()
            );
         }

         if (data.description) {
            formData.append('description', data.description);
         }

         // Plan nominee fields
         formData.append('planNominee', data.planNominee);

         if (data.planNominee && data.name) {
            formData.append('name', data.name);
         }

         // Handle relation - if "Others", use relationOther value
         if (data.planNominee && data.relation) {
            const relationValue =
               data.relation === 'Others' ? relationOther : data.relation;
            if (relationValue) {
               formData.append('relation', relationValue);
            }
         }

         // Signer field
         if (data.signer) {
            formData.append('signer', data.signer);
         }

         // Signature as base64 string
         if (data.signature) {
            formData.append('signature', data.signature);
         }

         // Add gallery files (multiple images)
         if (data.galleries && data.galleries.length > 0) {
            data.galleries.forEach((file) => {
               formData.append('galleries', file);
            });
         }

         const response = await axiosInstance.post('media-releases', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         console.log('Submission response:', response);

         if (response?.data?.success) {
            toast.success('Media Release Form Submitted Successfully');
            methods.reset();
            navigate('/forms');
         }
      } catch (error) {
         console.error('Error submitting media release form:', error);
         toast.error(
            error?.response?.data?.message ||
               'Failed to submit form. Please try again.'
         );
      }
   };

   return (
      <FormProvider {...methods}>
         <div className="py-8 px-4 max-w-xl mx-auto bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <h2 className="text-3xl font-bold text-gray-700 border-b pb-2">
                  Media Release Form
               </h2>

               <div className="text-sm text-gray-700 p-4  rounded-lg">
                  I <span className="font-semibold">{participantName}</span>{' '}
                  give consent to Decent Care to use and retain the image/ video
                  is attached for advertising purposes including, Decent Care's
                  website, Social Media (Facebook, Instagram, Twitter), and
                  print advertising material.
                  <br />
                  I understand that I may withdraw this consent at any time by
                  advising Decent Care and my photo/video will be removed or
                  destroyed at this time.
                  <br />I understand that by giving consent, Decent Care can use
                  the image/ recordings to promote their activities. Decent Care
                  may reproduce the image or video in any form, in whole or
                  part, and distribute it by any medium including printed
                  material, the internet, or multimedia.
                  <br />
                  I understand that Decent Care:
                  <br />
                  Will not pay me for giving consent or for the use of this
                  image or recording Will return or destroy images or recordings
                  if I withdraw my consent
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
                  rules={{
                     validate: (value) =>
                        value === true || value === false
                           ? true
                           : 'Please select an option',
                  }}
                  render={({ field }) => (
                     <Radio
                        {...field}
                        title="Does the participant have a plan nominee?"
                        options={[
                           { value: true, label: 'Yes' },
                           { value: false, label: 'No' },
                        ]}
                        error={errors.planNominee?.message}
                        isOptionsAreVertical
                        required
                     />
                  )}
               />

               {planNominee === true && (
                  <div className="space-y-4 p-4 rounded-lg border border-gray-200 ">
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
                        rules={{ required: 'Relationship is required' }}
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
                              required
                           />
                        )}
                     />
                     {relation === 'Others' && (
                        <Controller
                           name="relationOther"
                           control={control}
                           rules={{
                              required: 'Please specify the relationship',
                           }}
                           render={({ field }) => (
                              <Text
                                 {...field}
                                 label="Please specify"
                                 placeholder="Please type another option here"
                                 error={errors.relationOther?.message}
                                 required
                              />
                           )}
                        />
                     )}

                     {/* Who is signing the form? */}
                     <Controller
                        name="signer"
                        control={control}
                        rules={{ required: 'Please select who is signing' }}
                        render={({ field }) => (
                           <Radio
                              {...field}
                              title="Who is signing the form?"
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

                     {/* Signature for Nominee */}
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

                     {/* Signature for Participant */}
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
                  </div>
               )}

               {/* Signature for Participant */}
               {planNominee === false && (
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

               {/* Upload photos/videos - galleries field */}
               <Controller
                  name="galleries"
                  control={control}
                  rules={{ required: 'At least one photo/video is required' }}
                  render={({ field: { onChange, value } }) => (
                     <File
                        value={value}
                        onChange={onChange}
                        title="Upload Photos/Videos"
                        description="Upload media files for release"
                        accept={[
                           'image/*',
                           'video/*',
                           '.jpg',
                           '.jpeg',
                           '.png',
                           '.mp4',
                           '.mov',
                        ]}
                        supportedFormats={['JPG', 'JPEG', 'PNG', 'MP4', 'MOV']}
                        maxSize={10 * 1024 * 1024}
                        error={errors.galleries?.message}
                        multiple={true}
                        enableImageCropping={false}
                        required
                     />
                  )}
               />

               {/* Submit Button */}
               <div className="pt-4">
                  <button
                     type="submit"
                     className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                     Submit Media Release Form
                  </button>
               </div>
            </form>
         </div>
      </FormProvider>
   );
};

export default memo(MediaReleaseForm);
