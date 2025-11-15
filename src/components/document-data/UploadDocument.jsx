import {
   Checkbox,
   DateSelection,
   File,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import { useUpdateDocument, useUploadDocument } from '@hooks/useUploadDocument';
import { allowedExtensions } from '@utils/fileDataFormatter';

import React, { useCallback, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const UploadDocument = ({
   setUploadModalOpen,
   memberId,
   document = {},
   isUpdating,
   setUpdateModalOpen,
}) => {
   const {
      handleSubmit,
      watch,
      formState: { errors },
      reset,
      control,
   } = useForm({
      defaultValues: {
         documentName: document.documentName || '',
         documentDescription: document.documentDescription || '',
         hasExpiry: document.hasExpiry || false,
         expiryDate: document.expiryDate
            ? new Date(document.expiryDate).toISOString().split('T')[0]
            : '',
         hasDocumentNumber: document.hasDocumentNumber || false,
         documentNumber: document.documentNumber || '',
      },
   });

   // File state
   const [selectedFiles, setSelectedFiles] = useState(null);

   // Refs
   const fileInputRef = useRef(null);

   // Hooks - Fixed to use correct hooks
   const {
      mutateAsync: uploadDocument,
      isPending: uploadPending,
      isSuccess: uploadSuccess,
      isError: uploadError,
      error: uploadErrorData,
   } = useUploadDocument(memberId);

   const { mutateAsync: updateDocument, isPending: updatePending } =
      useUpdateDocument(memberId);

   const [hasExpiry, hasDocumentNumber] = watch([
      'hasExpiry',
      'hasDocumentNumber',
   ]);

   // Helper function to validate date
   const isValidDate = useCallback((dateString) => {
      return (
         dateString &&
         dateString.trim() !== '' &&
         !isNaN(Date.parse(dateString))
      );
   }, []);

   // Handle file selection
   const handleFileChange = useCallback((files) => {
      const file = Array.isArray(files) ? files[0] : files;
      setSelectedFiles(file);
   }, []);

   // Form submission
   const onSubmit = async (formData) => {
      if (isUpdating) {
         // Update existing document (name only)
         if (!formData.documentName.trim()) {
            toast.error('Document name is required.');
            return;
         }

         try {
            const updateData = {
               documentName: formData.documentName.trim(),
            };

            await updateDocument({
               documentData: updateData,
               documentId: document._id,
            });

            toast.success('Document updated successfully!');
            reset();
            if (setUpdateModalOpen) {
               setUpdateModalOpen(false);
            }
         } catch (error) {
            console.error('Update error:', error);
            toast.error(
               error.message || 'Failed to update document. Please try again.'
            );
         }
      } else {
         // Upload new document
         if (!selectedFiles) {
            toast.error('Please select a file to upload.');
            return;
         }

         // Check if image cropping is in progress
         if (fileInputRef.current?.isCropping?.()) {
            toast.error('Please complete image cropping before uploading.');
            return;
         }

         try {
            // Trigger upload progress animation
            if (fileInputRef.current?.triggerUpload) {
               fileInputRef.current.triggerUpload();
            }

            const documentData = {
               documentName: formData.documentName.trim(),
               documentDescription: formData.documentDescription.trim(),
               hasExpiry: Boolean(formData.hasExpiry),
               expiryDate:
                  formData.hasExpiry && isValidDate(formData.expiryDate)
                     ? formData.expiryDate
                     : null,
               hasDocumentNumber: Boolean(formData.hasDocumentNumber),
               documentNumber: formData.hasDocumentNumber
                  ? formData.documentNumber.trim()
                  : null,
               document: selectedFiles,
               source: 'Document',
            };

            await uploadDocument(documentData);

            toast.success('Document uploaded successfully!');

            // Reset form and close modal
            reset();
            setSelectedFiles(null);
            if (fileInputRef.current?.clearFiles) {
               fileInputRef.current.clearFiles();
            }
            if (setUploadModalOpen) {
               setUploadModalOpen(false);
            }
         } catch (error) {
            console.error('Upload error:', error);
            toast.error(
               error?.response?.data?.message ||
                  error.message ||
                  'Failed to upload document. Please try again.'
            );
         }
      }
   };

   return (
      <div className="m-2">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Controller
               name="documentName"
               control={control}
               rules={{
                  required: 'Document Name is required',
                  validate: (value) =>
                     value?.trim() !== '' || 'Document Name cannot be empty',
               }}
               render={({ field, fieldState: { error } }) => (
                  <Text
                     {...field}
                     label="Document Name"
                     placeholder="Enter document name"
                     error={error?.message}
                     required
                  />
               )}
            />

            {/* Additional fields only for upload (not update) */}
            {!isUpdating && (
               <>
                  <Controller
                     name="documentDescription"
                     control={control}
                     rules={{
                        required: 'Document Description is required',
                        validate: (value) =>
                           value?.trim() !== '' ||
                           'Document Description cannot be empty',
                     }}
                     render={({ field, fieldState: { error } }) => (
                        <Textarea
                           {...field}
                           label="Document Description"
                           placeholder="Enter document description"
                           error={error?.message}
                           rows={4}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="hasExpiry"
                     control={control}
                     render={({ field }) => (
                        <Checkbox
                           {...field}
                           multiple={false}
                           options={[{ label: 'Has Expiry', value: true }]}
                        />
                     )}
                  />

                  {hasExpiry && (
                     <Controller
                        name="expiryDate"
                        control={control}
                        rules={{
                           required: 'Expiry Date is required',
                           validate: (value) => {
                              if (!value) return 'Expiry Date is required';

                              const selectedDate = new Date(value);
                              const today = new Date();

                              selectedDate.setHours(0, 0, 0, 0);
                              today.setHours(0, 0, 0, 0);

                              if (selectedDate < today) {
                                 return 'Date cannot be in the past';
                              }

                              return true;
                           },
                        }}
                        render={({ field }) => (
                           <DateSelection
                              label="Expiry Date"
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              error={errors.expiryDate?.message}
                              required
                              minDate={new Date().toISOString().split('T')[0]}
                           />
                        )}
                     />
                  )}

                  <Controller
                     name="hasDocumentNumber"
                     control={control}
                     render={({ field }) => (
                        <Checkbox
                           {...field}
                           multiple={false}
                           options={[
                              { label: 'Has Document Number', value: true },
                           ]}
                        />
                     )}
                  />

                  {hasDocumentNumber && (
                     <Controller
                        name="documentNumber"
                        control={control}
                        rules={{
                           required: 'Document Number is required',
                           validate: (value) =>
                              value?.trim() !== '' ||
                              'Document Number cannot be empty',
                           pattern: {
                              value: /^[a-zA-Z0-9-]+$/,
                              message:
                                 'Document number must be alphanumeric (letters, numbers, and hyphens only)',
                           },
                        }}
                        render={({ field, fieldState: { error } }) => (
                           <Text
                              {...field}
                              label="Document Number"
                              placeholder="Enter document number"
                              error={error?.message}
                              required
                           />
                        )}
                     />
                  )}

                  <File
                     ref={fileInputRef}
                     title="Upload Document"
                     description="Drop your document here or click to browse"
                     accept={allowedExtensions}
                     maxSize={MAX_FILE_SIZE}
                     supportedFormats={allowedExtensions.map((ext) =>
                        ext.replace('.', '').toUpperCase()
                     )}
                     value={selectedFiles}
                     onChange={handleFileChange}
                     onFilesChange={handleFileChange}
                     onUploading={uploadPending}
                     onUploadSuccess={uploadSuccess}
                     onUploadError={uploadError}
                     error={uploadErrorData?.message}
                     cropTitle="Crop Document Image"
                     enableImageCropping={true}
                  />
               </>
            )}

            <button
               type="submit"
               disabled={uploadPending || updatePending}
               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
               {isUpdating
                  ? updatePending
                     ? 'Updating...'
                     : 'Update Document'
                  : uploadPending
                  ? 'Uploading...'
                  : 'Upload Document'}
            </button>
         </form>
      </div>
   );
};

export default React.memo(UploadDocument);
