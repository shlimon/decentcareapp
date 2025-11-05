import { getIconPath } from '@utils/fileDataFormatter';
import { forwardRef, useRef, useState } from 'react';
import { FiAlertCircle, FiFileText, FiUpload, FiX } from 'react-icons/fi';
import ImageCropper from './_components/ImageCropper';

const DirectFileUpload = forwardRef(
   (
      {
         value,
         onChange,
         accept = 'image/*,.pdf,.doc,.docx',
         maxSize = 10 * 1024 * 1024, // 10MB default
         supportedFormats = ['JPG', 'JPEG', 'PNG', 'PDF', 'DOC', 'DOCX'],
         title = 'Upload Document',
         description = 'Drop your files here or click to browse',
         disabled = false,
         error,
         onDocumentUpload,
         onDocumentDelete,
         uploadProgress = 0,
         isUploading = false,
         className = '',

         documentName = '',
         documentDescription = '',
         documentNumber = '',
         documentExpiry = '',
         requireFields = false,

         // Form compatibility props
         name,
         label,
         onBlur,
         required = false,

         // Image cropping props
         enableImageCropping = true,
         cropShape = 'rectangular',
         cropAspectRatio,
         cropQuality = 0.7,
         cropOutputFormat = 'webp',
         cropMaxWidth = 1920,
         cropMaxHeight = 1080,

         ...rest
      },
      ref
   ) => {
      const [dragActive, setDragActive] = useState(false);
      const [isDirectUploading, setIsDirectUploading] = useState(false);
      const [directUploadText, setDirectUploadText] = useState('Uploading...');
      const [validationError, setValidationError] = useState('');
      const [isDeleting, setIsDeleting] = useState(false);

      // NEW: Image cropping state
      const [showImageCropper, setShowImageCropper] = useState(false);
      const [imageToCrop, setImageToCrop] = useState(null);
      const [tempPreview, setTempPreview] = useState(null);

      const fileInputRef = useRef(null);
      const inputRef = ref || fileInputRef;

      // Initialize uploaded document state
      const [uploadedDocument, setUploadedDocument] = useState(() => {
         if (
            value &&
            typeof value === 'object' &&
            (value.documentName || value.name)
         ) {
            const fileExtension = (
               value.documentType ||
               value.type ||
               'unknown'
            ).toUpperCase();
            return {
               name: value.documentName || value.name || 'Document',
               size: value.size
                  ? typeof value.size === 'string'
                     ? value.size
                     : formatFileSize(value.size)
                  : 'Unknown size',
               type: fileExtension,
               iconPath: getIconPath(fileExtension),
               documentId: value?._id || null, // Store document ID for deletion
            };
         }
         return null;
      });

      function formatFileSize(bytes) {
         if (bytes === 0) return '0 Bytes';
         const k = 1024;
         const sizes = ['Bytes', 'KB', 'MB', 'GB'];
         const i = Math.floor(Math.log(bytes) / Math.log(k));
         return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
      }

      // NEW: Check if file is an image
      const isImageFile = (file) => {
         return file.type.startsWith('image/');
      };

      const validateFile = (file) => {
         if (file.size > maxSize) {
            return `File size should not exceed ${formatFileSize(maxSize)}`;
         }

         const fileExtension = file.name.split('.').pop().toLowerCase();
         const isValidFormat = supportedFormats.some(
            (format) => format.toLowerCase() === fileExtension
         );

         if (!isValidFormat) {
            return `Only ${supportedFormats.join(', ')} files are supported`;
         }

         return null;
      };

      const startDirectUploadAnimation = () => {
         const texts = ['Uploading...', 'Processing...', 'Almost done...'];
         let index = 0;

         const interval = setInterval(() => {
            index = (index + 1) % texts.length;
            setDirectUploadText(texts[index]);
         }, 1500);

         return interval;
      };

      // NEW: Handle cropped image completion
      const handleCroppedImage = async (croppedFile) => {
         setShowImageCropper(false);
         setImageToCrop(null);

         // Show preview of cropped image
         const reader = new FileReader();
         reader.onload = (e) => {
            setTempPreview(e.target?.result);
         };
         reader.readAsDataURL(croppedFile);

         // Process the cropped image as a document upload
         await processImageUpload(croppedFile);
      };

      // NEW: Handle image cropper close
      const handleImageCropperClose = () => {
         setShowImageCropper(false);
         setImageToCrop(null);
         if (inputRef.current) {
            inputRef.current.value = '';
         }
      };

      // NEW: Process image upload (separate from handleFiles for clarity)
      const processImageUpload = async (file) => {
         if (!onDocumentUpload) {
            setValidationError('No upload handler provided');
            return;
         }

         // Get fresh values at upload time
         const currentDocumentNumber = documentNumber?.toString().trim() || '';
         const currentDocumentExpiry = documentExpiry || '';
         const currentDocumentName = documentName || file.name.split('.')[0];
         const currentDocumentDescription = documentDescription || '';

         setIsDirectUploading(true);
         const animationInterval = startDirectUploadAnimation();

         try {
            const documentPayload = {
               file: file,
               name: currentDocumentName,
               description: currentDocumentDescription,
               hasExpiry: !!currentDocumentExpiry,
               ...(currentDocumentExpiry && {
                  expiryDate: currentDocumentExpiry,
               }),
               ...(currentDocumentNumber && {
                  documentNumber: currentDocumentNumber,
               }),
            };

            const result = await onDocumentUpload(documentPayload);

            const fileExtension = file.name.split('.').pop().toUpperCase();
            const documentInfo = {
               name: currentDocumentName,
               size: formatFileSize(file.size),
               type: fileExtension,
               iconPath: getIconPath(fileExtension),
               documentId: result?._id || result?.id || null,
            };

            setUploadedDocument(documentInfo);
            setTempPreview(null); // Clear temp preview since upload is complete
            onChange(result);

            clearInterval(animationInterval);
            setIsDirectUploading(false);
            setDirectUploadText('Uploading...');
         } catch (uploadError) {
            console.error('Document upload failed:', uploadError);
            setValidationError('Upload failed. Please try again.');
            setTempPreview(null); // Clear preview on error
            clearInterval(animationInterval);
            setIsDirectUploading(false);
            setDirectUploadText('Uploading...');
         }
      };

      const handleFiles = async (files) => {
         const file = files[0];
         if (!file) return;

         const fileValidationError = validateFile(file);
         if (fileValidationError) {
            setValidationError(fileValidationError);
            return;
         }

         setValidationError('');

         // NEW: Handle image files with cropping option
         if (isImageFile(file) && enableImageCropping) {
            const reader = new FileReader();
            reader.onload = (e) => {
               setImageToCrop(e.target?.result);
               setShowImageCropper(true);
            };
            reader.readAsDataURL(file);
            return;
         }

         // Handle non-image files or images without cropping (original logic)
         if (!onDocumentUpload) {
            setValidationError('No upload handler provided');
            return;
         }

         // For images without cropping, show preview first
         if (isImageFile(file)) {
            const reader = new FileReader();
            reader.onload = (e) => {
               setTempPreview(e.target?.result);
            };
            reader.readAsDataURL(file);
         }

         // Get fresh values at upload time
         const currentDocumentNumber = documentNumber?.toString().trim() || '';
         const currentDocumentExpiry = documentExpiry || '';
         const currentDocumentName = documentName || file.name.split('.')[0];
         const currentDocumentDescription = documentDescription || '';

         setIsDirectUploading(true);
         const animationInterval = startDirectUploadAnimation();

         try {
            const documentPayload = {
               file: file,
               name: currentDocumentName,
               description: currentDocumentDescription,
               hasExpiry: !!currentDocumentExpiry,
               ...(currentDocumentExpiry && {
                  expiryDate: currentDocumentExpiry,
               }),
               ...(currentDocumentNumber && {
                  documentNumber: currentDocumentNumber,
               }),
            };

            const result = await onDocumentUpload(documentPayload);

            const fileExtension = file.name.split('.').pop().toUpperCase();
            const documentInfo = {
               name: currentDocumentName,
               size: formatFileSize(file.size),
               type: fileExtension,
               iconPath: getIconPath(fileExtension),
               documentId: result?._id || result?.id || null,
            };

            setUploadedDocument(documentInfo);
            setTempPreview(null); // Clear temp preview since upload is complete
            onChange(result);

            clearInterval(animationInterval);
            setIsDirectUploading(false);
            setDirectUploadText('Uploading...');
         } catch (uploadError) {
            console.error('Document upload failed:', uploadError);
            setValidationError('Upload failed. Please try again.');
            setTempPreview(null); // Clear preview on error
            clearInterval(animationInterval);
            setIsDirectUploading(false);
            setDirectUploadText('Uploading...');
         }
      };

      const handleDeleteDocument = async () => {
         if (!onDocumentDelete) {
            console.error('No delete handler provided');
            return;
         }

         setIsDeleting(true);
         setValidationError('');

         try {
            await onDocumentDelete(uploadedDocument?.documentId);
            setUploadedDocument(null);
            setTempPreview(null); // Clear any temp preview
            onChange(null);
         } catch (deleteError) {
            console.error('Document deletion failed:', deleteError);
            setValidationError('Failed to delete document. Please try again.');
         } finally {
            setIsDeleting(false);
         }
      };

      const handleDrag = (e) => {
         e.preventDefault();
         e.stopPropagation();
         if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
         } else if (e.type === 'dragleave') {
            setDragActive(false);
         }
      };

      const handleDrop = (e) => {
         e.preventDefault();
         e.stopPropagation();
         setDragActive(false);

         if (disabled || isUploading || isDirectUploading) return;

         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
         }
      };

      const handleChange = (e) => {
         e.preventDefault();
         if (disabled || isUploading || isDirectUploading) return;

         if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
         }

         if (onBlur) {
            onBlur(e);
         }
      };

      const handleClick = () => {
         if (disabled || isUploading || isDirectUploading) return;

         // Get fresh values for validation
         const currentDocumentNumber = documentNumber?.toString().trim() || '';
         const currentDocumentExpiry = documentExpiry || '';

         // Clear any previous validation errors
         setValidationError('');

         // Prevent clicking if required fields missing
         if (
            requireFields &&
            (!currentDocumentNumber || !currentDocumentExpiry)
         ) {
            setValidationError(
               'Please fill in Document Number and Expiry Date before uploading.'
            );
            return;
         }

         inputRef.current?.click();
      };

      const handleRemove = (e) => {
         e.stopPropagation();
         setTempPreview(null);
         setUploadedDocument(null);
         onChange(null);
         if (inputRef.current) {
            inputRef.current.value = '';
         }
      };

      // NEW: Render image preview (for images with temp preview)
      const renderImagePreview = () => {
         if (!tempPreview) return null;

         return (
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
               <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 overflow-hidden bg-gray-100 rounded">
                     <img
                        src={tempPreview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                     />
                     {isDirectUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                           <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                        </div>
                     )}
                  </div>
                  <div>
                     <span className="block text-sm font-medium text-gray-700">
                        {documentName || 'Image Preview'}
                     </span>
                     <span className="text-xs text-gray-500">
                        Processing...
                     </span>
                  </div>
               </div>

               {/* Remove button - only show if not uploading */}
               {!isUploading && !isDirectUploading && (
                  <button
                     type="button"
                     onClick={handleRemove}
                     disabled={disabled}
                     className="flex items-center justify-center w-8 h-8 text-red-500 transition-all duration-200 rounded-full bg-red-50 hover:bg-red-100 hover:text-red-600"
                     title="Remove image"
                  >
                     <FiX size={16} />
                  </button>
               )}
            </div>
         );
      };

      const renderDocumentInfo = () => {
         if (!uploadedDocument) return null;

         return (
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
               <div className="flex items-center space-x-3">
                  {uploadedDocument.iconPath ? (
                     <img
                        src={uploadedDocument.iconPath}
                        alt={uploadedDocument.type}
                        className="w-8 h-8"
                     />
                  ) : (
                     <FiFileText size={24} className="text-gray-400" />
                  )}
                  <div>
                     <span className="block text-sm font-medium text-gray-700">
                        {uploadedDocument.name}
                     </span>
                     <span className="text-xs text-gray-500">
                        {uploadedDocument.size} • {uploadedDocument.type}
                     </span>
                  </div>
               </div>

               {/* Delete button - only show if not uploading */}
               {!isUploading && !isDirectUploading && (
                  <button
                     type="button"
                     onClick={handleDeleteDocument}
                     disabled={isDeleting || disabled}
                     className={`
                flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
                ${isDeleting
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                           : 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600'
                        }
              `}
                     title="Delete document"
                  >
                     {isDeleting ? (
                        <div className="w-4 h-4 border-b-2 border-red-400 rounded-full animate-spin"></div>
                     ) : (
                        <FiX size={16} />
                     )}
                  </button>
               )}
            </div>
         );
      };

      const renderValidationErrors = () => {
         if (!validationError) return null;

         return (
            <div className="flex items-start p-3 mb-3 text-sm text-red-700 border border-red-300 rounded-md bg-red-50">
               <FiAlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
               <span>{validationError}</span>
            </div>
         );
      };

      const shouldShowUploadArea = () => {
         return !isDirectUploading && !uploadedDocument && !tempPreview;
      };

      const displayError = error || validationError;

      return (
         <div className={`w-full ${className}`}>
            {(title || label) && (
               <label
                  className={`block mb-2 text-sm font-medium text-gray-700 ${required
                     ? "after:content-['*'] after:ml-1 after:text-red-500"
                     : ''
                     }`}
               >
                  {title || label}
               </label>
            )}

            <div className="relative space-y-3">
               {renderValidationErrors()}
               {renderDocumentInfo()}
               {renderImagePreview()}

               {shouldShowUploadArea() && (
                  <div
                     className={`
                relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
                ${dragActive
                           ? 'bg-blue-50 border-blue-400'
                           : displayError
                              ? 'bg-red-50 border-red-300'
                              : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                        }
                ${disabled || isUploading || isDirectUploading
                           ? 'opacity-50 cursor-not-allowed'
                           : ''
                        }
              `}
                     onDragEnter={handleDrag}
                     onDragLeave={handleDrag}
                     onDragOver={handleDrag}
                     onDrop={handleDrop}
                     onClick={handleClick}
                  >
                     <input
                        ref={inputRef}
                        type="file"
                        name={name}
                        accept={accept}
                        onChange={handleChange}
                        onBlur={onBlur}
                        disabled={disabled || isUploading || isDirectUploading}
                        className="hidden"
                        {...rest}
                     />

                     <div className="flex flex-col items-center space-y-2">
                        <div
                           className={`
                    p-3 rounded-full shadow-sm
                    ${dragActive
                                 ? 'text-blue-500 bg-blue-100'
                                 : displayError
                                    ? 'text-red-500 bg-red-100'
                                    : 'text-gray-400 bg-white'
                              }
                  `}
                        >
                           {isDirectUploading ? (
                              <div className="w-6 h-6 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                           ) : (
                              <FiUpload size={24} />
                           )}
                        </div>

                        <div>
                           <p
                              className={`text-sm font-medium ${displayError ? 'text-red-600' : 'text-gray-700'
                                 }`}
                           >
                              {isDirectUploading
                                 ? directUploadText
                                 : description}
                           </p>

                           <div className="mt-1 space-y-1 text-xs text-gray-500">
                              <p>Supported: {supportedFormats.join(', ')}</p>
                              <p>Max size: {formatFileSize(maxSize)}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {isDirectUploading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center py-20 bg-white rounded-lg bg-opacity-95">
                     <div className="flex flex-col items-center space-y-3">
                        <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        <div className="text-center">
                           <p className="text-sm font-medium text-gray-700 animate-pulse">
                              {directUploadText}
                           </p>
                           <p className="mt-1 text-xs text-gray-500">
                              Please wait...
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {isDirectUploading && uploadProgress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 py-20 overflow-hidden bg-gray-200 rounded-b-lg">
                     <div
                        className="h-1 transition-all duration-300 bg-blue-500"
                        style={{ width: `${uploadProgress}%` }}
                     />
                  </div>
               )}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            {/* NEW: Image Cropper Modal */}
            {enableImageCropping && (
               <ImageCropper
                  isOpen={showImageCropper}
                  onClose={handleImageCropperClose}
                  imageSrc={imageToCrop || ''}
                  onCropComplete={handleCroppedImage}
                  cropShape={cropShape}
                  title={`Crop ${title || 'Image'}`}
                  aspectRatio={cropAspectRatio}
                  compressionQuality={cropQuality}
                  outputFormat={cropOutputFormat}
                  maxWidth={cropMaxWidth}
                  maxHeight={cropMaxHeight}
               />
            )}
         </div>
      );
   }
);

DirectFileUpload.displayName = 'DirectFileUpload';

export default DirectFileUpload;