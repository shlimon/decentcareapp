import {
   Checkbox,
   DateSelection,
   File,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import { useUploadDocument } from '@hooks/useUploadDocument';
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

   // Hooks
   const {
      mutateAsync: uploadDocument,
      isPending: uploadPending,
      isSuccess: uploadSuccess,
      isError: uploadError,
      error: uploadErrorData,
   } = useUploadDocument(memberId);

   const { mutateAsync: updateDocument, isPending: updatePending } =
      useUploadDocument(memberId);

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
            setUpdateModalOpen(false);
         } catch (error) {
            console.error('Update error:', error);
            toast.error(
               error.message || 'Failed to update document. Please try again.'
            );
         }
      } else {
         if (!selectedFiles) {
            toast.error('Please select a file to upload.');
            return;
         }

         try {
            if (fileInputRef.current && fileInputRef.current.triggerUpload) {
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

            // reset form and close modal
            reset();
            setSelectedFiles(null);
            if (fileInputRef.current && fileInputRef.current.clearFiles) {
               fileInputRef.current.clearFiles();
            }
            setUploadModalOpen(false);
         } catch (error) {
            console.error('Upload error:', error);
            toast.error(
               error.message || 'Failed to upload document. Please try again.'
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
                  validate: (value) =>
                     (value !== undefined && value !== null && value !== '') ||
                     'Document Name is required',
               }}
               render={({ field, fieldState: { error } }) => (
                  <Text
                     {...field}
                     label="Document Name"
                     placeholder="Document name"
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
                        validate: (value) =>
                           (value !== undefined &&
                              value !== null &&
                              value !== '') ||
                           'Document Description is required',
                     }}
                     render={({ field, fieldState: { error } }) => (
                        <Textarea
                           {...field}
                           label="Document Description"
                           placeholder="Document Description"
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
                           validate: (value) =>
                              (value !== undefined &&
                                 value !== null &&
                                 value !== '') ||
                              'Document Number is required',
                           pattern: {
                              value: /^[a-zA-Z0-9-]+$/,
                              message: 'Document number must be alphanumeric',
                           },
                        }}
                        render={({ field, fieldState: { error } }) => (
                           <Text
                              {...field}
                              label="Document Number"
                              placeholder="Document Number"
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
                  />
               </>
            )}

            <button
               type="submit"
               disabled={uploadPending || updatePending}
               className="w-full px-4 py-2 font-medium text-white transition-colors rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isUpdating
                  ? updatePending
                     ? 'Updating'
                     : 'Update'
                  : uploadPending
                  ? 'Uploading'
                  : 'Upload'}{' '}
               Document
            </button>
         </form>
      </div>
   );
};

export default React.memo(UploadDocument);
