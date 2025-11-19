/* eslint-disable react-hooks/exhaustive-deps */
import CircularProgress from '@components/CircularProgress/CircularProgress';

import { formatFileSize, getIconPath } from '@utils/fileDataFormatter';
import {
   forwardRef,
   useCallback,
   useEffect,
   useImperativeHandle,
   useState,
} from 'react';
import { FiAlertCircle, FiUpload, FiX } from 'react-icons/fi';
import ImageCropper from './_components/ImageCropper';

// Individual file item component
const FileItem = ({ file, onRemove, disabled }) => {
   const fileIcon = getIconPath(file.name.split('.').pop()?.toLowerCase());

   return (
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
         <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary_light/10">
               <img src={fileIcon} alt="file icon" className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="font-medium text-gray-900 truncate">{file.name}</p>
               <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
               </p>
            </div>
         </div>
         <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="p-1 text-red-500 transition-colors rounded-full hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
         >
            <FiX className="w-4 h-4" />
         </button>
      </div>
   );
};

// Enhanced FileInput Component with integrated ImageCropper
const FileInput = forwardRef(
   (
      {
         // Value and change handlers
         value,
         onChange,

         // File validation props
         accept = [],
         maxSize = 10 * 1024 * 1024, // 10MB
         multiple = false,

         // UI props
         title = 'Upload Files',
         description = 'Drop your files here or click to browse',
         className = '',
         disabled = false,
         supportedFormats = [],

         // External upload state (from tanstack query)
         onUploading = false,
         onUploadSuccess = false,
         onUploadError = null,

         // Image cropping props
         enableImageCropping = true, // Changed default to true
         cropShape = 'rectangular', // 'rectangular' or 'round'
         aspectRatio = null, // null for free aspect ratio
         outputFormat = 'webp',
         compressionQuality = 0.8,
         enableResize = true,
         cropTitle = 'Crop Image',

         // Callbacks
         onFilesChange,
         error,
      },
      ref
   ) => {
      const [internalValue, setInternalValue] = useState(multiple ? [] : null);
      const [dragActive, setDragActive] = useState(false);
      const [validationErrors, setValidationErrors] = useState([]);
      const [uploadProgress, setUploadProgress] = useState(0);

      // Image cropping state
      const [showImageCropper, setShowImageCropper] = useState(false);
      const [imageToCrop, setImageToCrop] = useState(null);

      // Determine if component is controlled
      const isControlled = value !== undefined;
      const currentValue = isControlled ? value : internalValue;

      // Helper function to check if file is an image - FIXED
      const isImageFile = useCallback((file) => {
         if (!file) return false;

         // Check both MIME type and file extension
         const imageTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
         ];
         const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

         // Check MIME type first (more reliable)
         if (file.type && imageTypes.includes(file.type.toLowerCase())) {
            return true;
         }

         // Fallback to extension check
         const extension = file.name.split('.').pop()?.toLowerCase();
         return extension && imageExtensions.includes(extension);
      }, []);

      // Handle upload progress simulation
      useEffect(() => {
         let interval;

         if (onUploading && !onUploadSuccess && !onUploadError) {
            // Start progress simulation
            setUploadProgress(0);
            let progress = 0;

            interval = setInterval(() => {
               progress += Math.random() * 15 + 5; // Random increment 5-20
               if (progress >= 95) {
                  progress = 95; // Stop at 95% until external success
               }
               setUploadProgress(Math.min(progress, 95));
            }, 200);
         } else if (!onUploading && onUploadSuccess) {
            // Complete upload
            setUploadProgress(100);
            clearInterval(interval);
         } else if (!onUploading && !onUploadSuccess) {
            // Reset progress
            setUploadProgress(0);
            clearInterval(interval);
         }

         return () => clearInterval(interval);
      }, [onUploading, onUploadSuccess, onUploadError]);

      // Handle value changes
      const handleValueChange = useCallback(
         (newValue) => {
            if (isControlled) {
               onChange?.(newValue);
            } else {
               setInternalValue(newValue);
            }
            onFilesChange?.(newValue);
         },
         [isControlled, onChange, onFilesChange]
      );

      // Handle cropped image
      const handleCroppedImage = useCallback(
         (croppedFile) => {
            setShowImageCropper(false);
            setImageToCrop(null);

            if (multiple) {
               const currentFiles = currentValue || [];
               const newFiles = [...currentFiles, croppedFile];
               handleValueChange(newFiles);
            } else {
               handleValueChange(croppedFile);
            }
         },
         [multiple, currentValue, handleValueChange]
      );

      // Handle image cropper close
      const handleImageCropperClose = useCallback(() => {
         setShowImageCropper(false);
         setImageToCrop(null);
      }, []);

      // Expose methods to parent component
      useImperativeHandle(
         ref,
         () => ({
            clearFiles: () => {
               handleValueChange(multiple ? [] : null);
               setValidationErrors([]);
               setUploadProgress(0);
               setShowImageCropper(false);
               setImageToCrop(null);
            },
            triggerUpload: () => {
               // This is called by parent when starting upload
               setUploadProgress(0);
            },
            getFiles: () => currentValue,
            getUploadStatus: () => ({
               isUploading: onUploading,
               progress: uploadProgress,
               isComplete: !onUploading && onUploadSuccess,
               hasError: onUploadError,
               isCropping: showImageCropper, // This should be the current state
            }),
            // Add a direct method to check cropping state
            isCropping: () => showImageCropper,
         }),
         [
            currentValue,
            onUploading,
            uploadProgress,
            onUploadSuccess,
            onUploadError,
            showImageCropper,
         ]
      );

      // File validation
      const validateFile = useCallback(
         (file) => {
            const errors = [];

            // Check file type
            if (accept.length > 0) {
               const fileExtension = file.name.split('.').pop()?.toLowerCase();
               const isValidType = accept.some((acceptType) => {
                  const normalizedAccept = acceptType
                     .toLowerCase()
                     .replace('.', '');
                  return fileExtension === normalizedAccept;
               });

               if (!isValidType) {
                  errors.push(
                     `Invalid file type. Allowed: ${supportedFormats.join(
                        ', '
                     )}`
                  );
               }
            }

            // Check file size
            if (file.size > maxSize) {
               errors.push(
                  `File size must be less than ${formatFileSize(maxSize)}`
               );
            }

            return errors;
         },
         [accept, maxSize, supportedFormats]
      );

      // Handle file selection with cropping logic - IMPROVED
      const handleFileSelection = useCallback(
         (files) => {
            const fileArray = Array.from(files);
            const errors = [];

            // Validate each file
            const validatedFiles = [];
            for (const file of fileArray) {
               const fileErrors = validateFile(file);
               if (fileErrors.length === 0) {
                  validatedFiles.push(file);
               } else {
                  errors.push(...fileErrors);
               }
            }

            setValidationErrors(errors);

            if (validatedFiles.length > 0) {
               const file = validatedFiles[0];

               // Check if it's an image that needs cropping
               if (enableImageCropping && isImageFile(file)) {
                  // Read file for cropper
                  const reader = new FileReader();
                  reader.onload = (e) => {
                     setImageToCrop(e.target.result);
                     setShowImageCropper(true);
                  };
                  reader.onerror = (error) => {
                     console.error('FileReader error:', error);
                     setValidationErrors(['Failed to read image file']);
                  };
                  reader.readAsDataURL(file);
               } else {
                  if (multiple) {
                     const currentFiles = currentValue || [];
                     const newFiles = [...currentFiles, ...validatedFiles];
                     handleValueChange(newFiles);
                  } else {
                     handleValueChange(file);
                  }
               }
            }
         },
         [
            currentValue,
            multiple,
            validateFile,
            handleValueChange,
            enableImageCropping,
            isImageFile,
         ]
      );

      // Remove file
      const removeFile = useCallback(
         (indexOrFile) => {
            if (multiple) {
               const newFiles = currentValue.filter(
                  (_, index) => index !== indexOrFile
               );
               handleValueChange(newFiles);
            } else {
               handleValueChange(null);
            }
            setValidationErrors([]);
            setUploadProgress(0);
         },
         [currentValue, multiple, handleValueChange]
      );

      // Drag and drop handlers
      const handleDrag = useCallback((e) => {
         e.preventDefault();
         e.stopPropagation();
         if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
         } else if (e.type === 'dragleave') {
            setDragActive(false);
         }
      }, []);

      const handleDrop = useCallback(
         (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (disabled || onUploading) return;

            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
               handleFileSelection(files);
            }
         },
         [disabled, onUploading, handleFileSelection]
      );

      const handleInputChange = useCallback(
         (e) => {
            if (disabled || onUploading) return;

            const files = e.target.files;
            if (files && files.length > 0) {
               handleFileSelection(files);
            }
            e.target.value = '';
         },
         [disabled, onUploading, handleFileSelection]
      );

      // Get current files for display
      const displayFiles = multiple
         ? currentValue || []
         : currentValue
            ? [currentValue]
            : [];

      // Generate unique input id
      const inputId = `fileInput-${Math.random().toString(36).substr(2, 9)}`;

      // Determine upload state for UI
      const isUploadComplete = !onUploading && onUploadSuccess;
      const showProgress =
         onUploading || (uploadProgress > 0 && uploadProgress < 100);
      const isInteractionDisabled = disabled || onUploading;

      return (
         <>
            <div className={`space-y-1 ${className}`}>
               {title && (
                  <label className="block text-sm font-medium text-gray-700 text-left">
                     {title}
                  </label>
               )}

               {/* Upload Area */}
               {!showProgress && !showImageCropper ? (
                  <div
                     className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer
                ${dragActive
                           ? 'border-primary bg-blue-50'
                           : 'border-gray-300 hover:border-primary/90 hover:bg-gray-50'
                        }
                ${isInteractionDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${isUploadComplete ? 'border-green-500 bg-green-50' : ''}
              `}
                     onDragEnter={handleDrag}
                     onDragLeave={handleDrag}
                     onDragOver={handleDrag}
                     onDrop={handleDrop}
                     onClick={() =>
                        !isInteractionDisabled &&
                        document.getElementById(inputId)?.click()
                     }
                  >
                     <input
                        id={inputId}
                        type="file"
                        className="hidden"
                        accept={accept
                           .map((ext) =>
                              ext.startsWith('.') ? ext : `.${ext}`
                           )
                           .join(',')}
                        multiple={multiple}
                        onChange={handleInputChange}
                        disabled={isInteractionDisabled}
                     />

                     <div className="flex flex-col items-center space-y-3">
                        <div
                           className={`p-3 rounded-full ${isUploadComplete ? 'bg-green-100' : 'bg-blue-100'
                              }`}
                        >
                           <FiUpload
                              className={`w-6 h-6 ${isUploadComplete
                                    ? 'text-green-600'
                                    : 'text-primary'
                                 }`}
                           />
                        </div>
                        <div className="text-sm text-gray-600">
                           <span>{description}</span>
                        </div>
                        {supportedFormats.length > 0 && (
                           <p className="text-xs text-gray-500">
                              Supported: {supportedFormats.join(', ')}
                           </p>
                        )}
                        <p className="text-xs text-gray-500">
                           Max size: {formatFileSize(maxSize)}
                           {enableImageCropping && ' • Images will be cropped'}
                        </p>
                     </div>
                  </div>
               ) : showImageCropper ? (
                  <div className="p-8 text-center transition-all duration-300 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50">
                     <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 bg-blue-100 rounded-full">
                           <FiUpload className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-sm text-primary">
                           <span>Please crop your image first</span>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="p-8 text-center transition-all duration-300 border-2 border-gray-200 rounded-lg bg-gray-50">
                     <CircularProgress
                        progress={uploadProgress}
                        isComplete={isUploadComplete}
                     />
                  </div>
               )}

               {/* Selected Files Display */}
               {displayFiles.length > 0 &&
                  !showProgress &&
                  !showImageCropper && (
                     <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">
                           Selected Files ({displayFiles.length})
                        </h4>
                        <div className="space-y-2">
                           {displayFiles.map((file, index) => (
                              <FileItem
                                 key={`${file.name}-${index}-${file.lastModified || index
                                    }`}
                                 file={file}
                                 onRemove={() =>
                                    removeFile(multiple ? index : null)
                                 }
                                 disabled={onUploading}
                              />
                           ))}
                        </div>
                     </div>
                  )}

               {/* Error Display */}
               {(validationErrors.length > 0 || error || onUploadError) && (
                  <div className="space-y-1">
                     {validationErrors.map((errorMsg, index) => (
                        <div
                           key={index}
                           className="flex items-center text-sm text-red-600"
                        >
                           <FiAlertCircle className="w-4 h-4 mr-1" />
                           {errorMsg}
                        </div>
                     ))}
                     {(error || onUploadError) && (
                        <div className="flex items-center text-sm text-red-600">
                           <FiAlertCircle className="w-4 h-4 mr-1" />
                           {error || onUploadError?.message || 'Upload failed'}
                        </div>
                     )}
                  </div>
               )}
            </div>

            {enableImageCropping && (
               <ImageCropper
                  isOpen={showImageCropper}
                  onClose={handleImageCropperClose}
                  imageSrc={imageToCrop || ''}
                  onCropComplete={handleCroppedImage}
                  cropShape={cropShape}
                  title={cropTitle}
                  aspectRatio={aspectRatio}
                  outputFormat={outputFormat}
                  compressionQuality={compressionQuality}
                  enableResize={enableResize}
               />
            )}
         </>
      );
   }
);

FileInput.displayName = 'FileInput';

export default FileInput;
