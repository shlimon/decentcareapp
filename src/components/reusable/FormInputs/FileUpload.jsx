import { getIconPath } from "@utils/fileDataFormatter";
import { forwardRef, useRef, useState } from "react";
import { FiFileText, FiUpload, FiX } from "react-icons/fi";
import { useParams } from "react-router-dom";
import BaseInput from "./_components/BasicInput";
import ImageCropper from "./_components/ImageCropper";


const FileUpload = forwardRef(
  (
    {
      value,
      onChange,
      accept = 'image/*',
      maxSize = 50 * 1024 * 1024, // 50MB default
      supportedFormats = ['JPG', 'JPEG', 'PNG'],
      maxDimensions = '2000x2000px',
      title = 'Upload File',
      description = 'Drop your files here or click to browse',
      multiple = false,
      disabled = false,
      error,
      onUpload, // For avatar/image uploads
      onDocumentUpload, // For document uploads
      uploadProgress = 0,
      isUploading = false,
      className = '',
      allowdocuments = false,
      documentformats = ['PDF', 'DOC', 'DOCX'],
      isAvatar = false,
      directUpload = false,

      // FileInput props for compatibility
      name,
      label,
      onBlur,
      required,
      icon,

      // UI Mode selection
      mode = 'enhanced', // 'enhanced' (drag&drop UI) or 'simple' (basic input UI)

      // Document modal configuration
      showdescription = true,
      defaultExpiry = null,
      documentNumber = "",
      documentName = "",

      // Image cropping props
      enableImageCropping = true,
      cropShape = "rectangular",
      cropAspectRatio,
      cropQuality = 0.7,
      cropOutputFormat = "webp",
      cropMaxWidth,
      cropMaxHeight,

      ...rest
    },
    ref
  ) => {
    const URL = import.meta.env.VITE_DIGITALOCEAN_SPACES_URL;
    const { id } = useParams(); // Get id from URL parameters

    const [dragActive, setDragActive] = useState(false);
    const [tempPreview, setTempPreview] = useState(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentData, setDocumentData] = useState({
      name: '',
      description: '',
      hasExpiry: defaultExpiry ? true : false,
      expiryDate: defaultExpiry || '',
      documentNumber: documentNumber || '',
    });

    // NEW: Image cropping state
    const [showImageCropper, setShowImageCropper] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);

    // Direct upload loading state
    const [isDirectUploading, setIsDirectUploading] = useState(false);
    const [directUploadText, setDirectUploadText] = useState('Uploading...');

    const fileInputRef = useRef(null);
    const inputRef = ref || fileInputRef;

    // Check if fields should be disabled
    const isDocumentNameDisabled = (documentName);
    const isDocumentNumberDisabled = (documentNumber);

    // Initialize state based on existing value
    const [uploadedDocument, setUploadedDocument] = useState(() => {
      if (
        allowdocuments &&
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

    const isDocumentFile = (file) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || '';
      return documentformats.some(
        (format) => format.toLowerCase() === fileExtension,
      );
    };

    const isImageFile = (file) => {
      return file.type.startsWith('image/');
    };

    const validateFile = (file) => {
      // Check file size
      if (file.size > maxSize) {
        return `File size should not exceed ${formatFileSize(maxSize)}`;
      }

      // Check file type
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || '';
      const allSupportedFormats = [
        ...supportedFormats,
        ...(allowdocuments ? documentformats : []),
      ];
      const isValidFormat = allSupportedFormats.some(
        (format) => format.toLowerCase() === fileExtension
      );

      if (!isValidFormat) {
        return `Only ${allSupportedFormats.join(', ')} files are supported`;
      }

      return null;
    };

    // Animation text cycle for direct upload
    const startDirectUploadAnimation = () => {
      const texts = ['Uploading...', 'Processing...', 'Almost done...'];
      let index = 0;

      const interval = setInterval(() => {
        index = (index + 1) % texts.length;
        setDirectUploadText(texts[index]);
      }, 1500);

      return interval;
    };

    // Handle cropped image
    const handleCroppedImage = async (croppedFile) => {
      setShowImageCropper(false);
      setImageToCrop(null);

      // Show preview of cropped image
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempPreview(e.target?.result);
      };
      reader.readAsDataURL(croppedFile);

      // Handle upload or state storage
      if (id && onUpload) {
        // If ID exists, upload the cropped file immediately
        try {
          const uploadedUrl = await onUpload(croppedFile);
          setTempPreview(null); // Clear temp preview
          onChange(uploadedUrl); // Update form state with full URL
        } catch (error) {
          console.error("Upload failed:", error);
          setTempPreview(null); // Remove temp preview on error
          onChange(null); // Clear form state on error
        }
      } else {
        // If no ID, store the cropped file in form data
        onChange(croppedFile); // Store the cropped file object for later use
      }
    };

    const handleFiles = async (files) => {
      const file = files[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        console.error(validationError);
        return;
      }

      // Handle document uploads
      if (allowdocuments && isDocumentFile(file)) {
        // Direct upload for documents
        if (directUpload && onDocumentUpload) {
          setIsDirectUploading(true);
          const animationInterval = startDirectUploadAnimation();

          try {
            // Create default document payload for direct upload
            const documentPayload = {
              file: file,
              name: documentName || file.name.split('.')[0],
              description: '',
              hasExpiry: defaultExpiry ? true : false,
              expiryDate: defaultExpiry || null,
              documentNumber: documentNumber || '',
            };

            const result = await onDocumentUpload(documentPayload);

            // Store uploaded document info for display
            const fileExtension = file.name.split(".").pop()?.toUpperCase() || '';
            const documentInfo = {
              name: documentPayload.name,
              size: formatFileSize(file.size),
              type: fileExtension,
              iconPath: getIconPath(fileExtension),
            };

            setUploadedDocument(documentInfo);
            onChange(result);

            clearInterval(animationInterval);
            setIsDirectUploading(false);
            setDirectUploadText('Uploading...');
          } catch (error) {
            console.error('Document upload failed:', error);
            clearInterval(animationInterval);
            setIsDirectUploading(false);
            setDirectUploadText('Uploading...');
          }
        } else {
          // Modal upload for documents
          setSelectedDocument(file);
          setDocumentData({
            name: documentName || file.name.split('.')[0],
            description: '',
            hasExpiry: defaultExpiry ? true : false,
            expiryDate: defaultExpiry || '',
            documentNumber: documentNumber || '',
          });
          setShowDocumentModal(true);
        }
        return;
      }

      // Handle avatar/image uploads
      if (isAvatar || isImageFile(file)) {
        // NEW: If image cropping is enabled, show the cropper
        if (enableImageCropping && isImageFile(file)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImageToCrop(e.target?.result);
            setShowImageCropper(true);
          };
          reader.readAsDataURL(file);
          return;
        }

        // Original image handling (no cropping)
        const reader = new FileReader();
        reader.onload = (e) => {
          setTempPreview(e.target?.result); // Show preview immediately
        };
        reader.readAsDataURL(file);

        // Check if id is available - if yes, upload immediately; if no, store file in form data
        if (id && onUpload) {
          // If ID exists, upload the file immediately (existing behavior)
          try {
            const uploadedUrl = await onUpload(file);
            setTempPreview(null); // Clear temp preview
            onChange(uploadedUrl); // Update form state with full URL
          } catch (error) {
            console.error('Upload failed:', error);
            setTempPreview(null); // Remove temp preview on error
            onChange(null); // Clear form state on error
          }
        } else {
          // If no ID, store the file in form data (new behavior)
          onChange(file); // Store the actual file object for later use
        }
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

      // Call onBlur if provided (for form validation)
      if (onBlur) {
        onBlur(e);
      }
    };

    const handleClick = () => {
      if (disabled || isUploading || isDirectUploading) return;
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

    const handleDocumentSubmit = async () => {
      if (!selectedDocument || !onDocumentUpload) return;

      // Validate required fields
      if (!documentData.name.trim()) {
        alert('Document name is required');
        return;
      }

      if (documentData.hasExpiry && !documentData.expiryDate) {
        alert('Expiry date is required when expiry is enabled');
        return;
      }

      // Validate expiry date is after today
      if (documentData.hasExpiry && documentData.expiryDate) {
        const today = new Date();
        const expiryDate = new Date(documentData.expiryDate);
        if (expiryDate <= today) {
          alert('Expiry date must be after today');
          return;
        }
      }

      try {
        const documentPayload = {
          file: selectedDocument,
          name: documentData.name,
          description: documentData.description,
          hasExpiry: documentData.hasExpiry,
          expiryDate: documentData.hasExpiry ? documentData.expiryDate : null,
          documentNumber: documentData.documentNumber,
        };

        const result = await onDocumentUpload(documentPayload);

        // Store uploaded document info for display
        const fileExtension = selectedDocument.name
          .split('.')
          .pop()
          ?.toUpperCase() || '';

        const documentInfo = {
          name: documentData.name,
          size: formatFileSize(selectedDocument.size),
          type: fileExtension,
          iconPath: getIconPath(fileExtension),
        };

        setUploadedDocument(documentInfo);
        onChange(result);

        // Reset and close modal
        setShowDocumentModal(false);
        setSelectedDocument(null);
        setDocumentData({
          name: '',
          description: '',
          hasExpiry: defaultExpiry ? true : false,
          expiryDate: defaultExpiry || '',
          documentNumber: documentNumber || '',
        });
      } catch (error) {
        console.error('Document upload failed:', error);
      }
    };

    const handleDocumentCancel = () => {
      setShowDocumentModal(false);
      setSelectedDocument(null);
      setDocumentData({
        name: '',
        description: '',
        hasExpiry: defaultExpiry ? true : false,
        expiryDate: defaultExpiry || '',
        documentNumber: documentNumber || '',
      });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    // NEW: Handle image cropper close
    const handleImageCropperClose = () => {
      setShowImageCropper(false);
      setImageToCrop(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
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
        </div>
      );
    };

    const renderAvatarPreview = () => {
      // Show temp preview while uploading or when no ID (file stored locally)
      if (tempPreview) {
        return (
          <div className="relative group">
            <div className="relative w-32 h-32 overflow-hidden bg-gray-100 rounded-lg">
              <img
                src={tempPreview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-black bg-opacity-0 group-hover:bg-opacity-20">
                <button
                  onClick={handleRemove}
                  className="p-1 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600"
                  type="button"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Show final uploaded image (when ID exists and file was uploaded)
      if (value && typeof value === 'string') {
        const imageUrl = value.startsWith('http') ? value : `${URL}${value}`;
        return (
          <div className="relative group">
            <div className="relative w-32 h-32 overflow-hidden bg-gray-100 rounded-lg">
              <img
                src={imageUrl}
                alt="Avatar"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-black bg-opacity-0 group-hover:bg-opacity-20">
                <button
                  onClick={handleRemove}
                  className="p-1 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600"
                  type="button"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Show preview for File object (when no ID and file is stored in form data)
      if (value && value instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTempPreview(e.target?.result);
        };
        reader.readAsDataURL(value);
        return null; // The preview will be shown via tempPreview state
      }

      return null;
    };

    const renderDocumentModal = () => {
      if (!showDocumentModal) return null;

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {title || 'Document Details'}
              </h3>
              <button
                type="button"
                onClick={handleDocumentCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Document Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Document Name *
                  {isDocumentNameDisabled && (
                    <span className="ml-1 text-xs text-gray-500">
                      (set by parent)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={documentData.name}
                  disabled={isDocumentNameDisabled}
                  onChange={(e) =>
                    !isDocumentNameDisabled &&
                    setDocumentData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDocumentNameDisabled
                    ? 'bg-gray-100 cursor-not-allowed opacity-50'
                    : ''
                    }`}
                  placeholder="Enter document name"
                />
              </div>

              {/* Document Number - only show if documentNumber prop is provided or initially set */}
              {
                (documentNumber || documentData.documentNumber) && (
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Document Number
                      {isDocumentNumberDisabled && (
                        <span className="ml-1 text-xs text-gray-500">
                          (set by parent)
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={documentData.documentNumber}
                      disabled={isDocumentNumberDisabled}
                      onChange={(e) =>
                        !isDocumentNumberDisabled &&
                        setDocumentData((prev) => ({
                          ...prev,
                          documentNumber: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDocumentNumberDisabled
                        ? 'bg-gray-100 cursor-not-allowed opacity-50'
                        : ''
                        }`}
                      placeholder="Enter document number"
                    />
                  </div>
                )}

              {/* Description - only show if showdescription is true */}
              {
                showdescription && (
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={documentData.description}
                      onChange={(e) =>
                        setDocumentData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter description (optional)"
                      rows={3}
                    />
                  </div>
                )
              }

              {/* Has Expiry - disabled if defaultExpiry is provided */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasExpiry"
                  checked={documentData.hasExpiry}
                  disabled={defaultExpiry !== null}
                  onChange={(e) =>
                    setDocumentData((prev) => ({
                      ...prev,
                      hasExpiry: e.target.checked,
                      expiryDate: e.target.checked ? prev.expiryDate : '',
                    }))
                  }
                  className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${defaultExpiry !== null
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                    }`}
                />
                <label
                  htmlFor="hasExpiry"
                  className={`ml-2 text-sm text-gray-700 ${defaultExpiry !== null ? 'opacity-50' : ''
                    }`}
                >
                  Document has expiry date
                  {defaultExpiry !== null && (
                    <span className="ml-1 text-xs text-gray-500">
                      (controlled by parent)
                    </span>
                  )}
                </label>
              </div>

              {/* Expiry Date - disabled if defaultExpiry is provided */}
              {
                documentData.hasExpiry && (
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      value={documentData.expiryDate}
                      disabled={defaultExpiry !== null}
                      onChange={(e) =>
                        setDocumentData((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      min={
                        new Date(Date.now() + 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split('T')[0]
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${defaultExpiry !== null
                        ? 'bg-gray-100 cursor-not-allowed opacity-50'
                        : ''
                        }`}
                    />
                    {defaultExpiry !== null && (
                      <p className="mt-1 text-xs text-gray-500">
                        Expiry date is set by parent component
                      </p>
                    )}
                  </div>
                )
              }

              {/* Selected File Info */}
              {
                selectedDocument && (
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <FiFileText size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedDocument.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({formatFileSize(selectedDocument.size)})
                      </span>
                    </div>
                  </div>
                )
              }
            </div >

            {/* Modal Actions */}
            < div className="flex justify-end mt-6 space-x-3" >
              <button
                type="button"
                onClick={handleDocumentCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDocumentSubmit}
                disabled={
                  !documentData.name.trim() ||
                  (documentData.hasExpiry && !documentData.expiryDate)
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Submitting...' : 'Submit'}
              </button>
            </div >
          </div >
        </div >
      );
    };

    const allSupportedFormats = [
      ...supportedFormats,
      ...(allowdocuments ? documentformats : []),
    ];

    // Determine when to show upload area
    const shouldShowUploadArea = () => {
      // Don't show upload area during direct upload
      if (isDirectUploading) return false;

      // For documents: show upload only if no document is uploaded
      if (allowdocuments) {
        return !uploadedDocument;
      }

      // For avatars: show upload only if no image, no temp preview, and no file
      if (isAvatar) {
        return !value && !tempPreview;
      }

      // For regular images: show upload if no preview
      return !value && !tempPreview;
    };

    // Render simple mode (like original FileInput)
    if (mode === 'simple') {
      return (
        <BaseInput
          label={label || title}
          error={error}
          required={required}
          className={className}
          icon={icon}
          name={name}
        >
          <input
            ref={inputRef}
            type="file"
            name={name}
            onChange={handleChange}
            onBlur={onBlur}
            accept={accept}
            multiple={multiple}
            disabled={disabled || isUploading || isDirectUploading}
            className="w-full p-0 text-gray-900 bg-transparent border-none outline-none cursor-pointer file:mr-2 file:py-1 file:px-2 file:border-0 file:text-sm file:bg-violet-50 file:text-violet-700 file:rounded file:cursor-pointer focus:ring-0"
            {...rest}
          />
        </BaseInput>
      );
    }

    // Render enhanced mode (original FileUpload functionality)
    return (
      <div className={`w-full ${className}`}>
        {(title || label) && (
          <label
            className={`block mb-2 text-sm font-medium text-gray-700 ${required
              ? "after:content-['*'] after:ml-1 after:text-red-500"
              : ""
              }`}
          >
            {title || label}
          </label>
        )}

        <div className="relative space-y-3">
          {/* Show document info for documents only */}
          {allowdocuments && renderDocumentInfo()}

          {/* Show avatar/image preview */}
          {(isAvatar || (!allowdocuments && !isAvatar)) &&
            renderAvatarPreview()}

          {/* Show upload area based on conditions */}
          {shouldShowUploadArea() && (
            <div
              className={`
              relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
              ${dragActive
                  ? 'bg-blue-50 border-blue-400'
                  : error
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
                multiple={multiple}
                {...rest}
              />

              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`
                  p-3 rounded-full shadow-sm
                  ${dragActive
                      ? 'text-blue-500 bg-blue-100'
                      : error
                        ? 'text-red-500 bg-red-100'
                        : 'text-gray-400 bg-white'
                    }
                `}
                >
                  {isUploading || isDirectUploading ? (
                    <div className="w-6 h-6 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  ) : (
                    <FiUpload size={24} />
                  )}
                </div>

                <div>
                  <p
                    className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'
                      }`}
                  >
                    {isUploading
                      ? 'Uploading...'
                      : isDirectUploading
                        ? directUploadText
                        : description}
                  </p>

                  <div className="mt-1 space-y-1 text-xs text-gray-500">
                    <p>Supported: {allSupportedFormats.join(', ')}</p>
                    <p>Max size: {formatFileSize(maxSize)}</p>
                    {maxDimensions && <p>Images: ≤ {maxDimensions}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Direct Upload Loading Overlay */}
          {isDirectUploading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white rounded-lg bg-opacity-95">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 animate-pulse">
                    {directUploadText}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Please wait...</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress Bar */}
          {(isUploading || isDirectUploading) && uploadProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-gray-200 rounded-b-lg">
              <div
                className="h-1 transition-all duration-300 bg-blue-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {/* Document Modal */}
        {renderDocumentModal()}

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

FileUpload.displayName = 'FileUpload';

export default FileUpload;
