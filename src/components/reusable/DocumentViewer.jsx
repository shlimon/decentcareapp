import { useCallback, useMemo, useState } from 'react';
import { PDFViewer } from './PDFViewer';
import ModalWithContent from './modal2/ModalWithContent';

const DocumentViewer = ({
  document,
  isDocumentNameVisible = true,
  modalViews = [],
}) => {
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const getTypeFromUrl = (url) => {
    if (!url) return null;

    const cleanUrl = url.split('?')[0]; // remove query params if any
    const extension = cleanUrl.split('.').pop();

    return extension ? extension.toUpperCase() : null;
  };

  // Safe destructuring (avoid crash when document = null)
  const { documentType, documentUrl, documentName } = document || {};

  //   const type = useMemo(
  //     () => (documentType ? documentType.toUpperCase() : null),
  //     [documentType]
  //   );

  const type = useMemo(() => {
    if (documentType) {
      return documentType.toUpperCase();
    }

    return getTypeFromUrl(documentUrl);
  }, [documentType, documentUrl]);

  const fullUrl = useMemo(() => {
    return documentUrl
      ? `${import.meta.env.VITE_DIGITALOCEAN_SPACES_URL}${documentUrl}`
      : '';
  }, [documentUrl]);

  const shouldShowInModal = useMemo(() => {
    return documentType || type
      ? modalViews.some((view) => {
          return view.toLowerCase() === documentType
            ? documentType.toLowerCase()
            : type.toLowerCase();
        })
      : false;
  }, [modalViews, documentType, type]);

  const handleDocumentClick = useCallback(() => {
    if (shouldShowInModal) setShowDocumentModal(true);
  }, [shouldShowInModal]);

  /** ---- Memoized Components ---- */
  const PreviewComponent = useMemo(() => {
    if (!type) return null;

    switch (type) {
      case 'PDF':
        return (
          <div className="w-[300px] h-[300px]">
            <PDFViewer
              pdfUrl={documentUrl}
              mode="preview"
              className="border rounded shadow"
              showOverlay={shouldShowInModal}
              onClick={shouldShowInModal ? handleDocumentClick : null}
              fallbackText={documentName || 'PDF Document'}
            />
          </div>
        );
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'WEBP':
        return (
          <img
            src={fullUrl}
            alt={documentName || 'Document'}
            className={`w-[300px] h-[300px] border rounded shadow ${
              shouldShowInModal
                ? 'cursor-pointer hover:opacity-90 transition-opacity'
                : ''
            }`}
            onClick={shouldShowInModal ? handleDocumentClick : undefined}
          />
        );
      default:
        return (
          <div className="p-4 text-sm text-gray-500 border rounded bg-gray-50">
            Preview not supported for: {type}
          </div>
        );
    }
  }, [
    type,
    documentUrl,
    documentName,
    fullUrl,
    shouldShowInModal,
    handleDocumentClick,
  ]);

  const ModalComponent = useMemo(() => {
    if (!type) return null;

    switch (type) {
      case 'PDF':
        return (
          <div className="w-full h-[520px] 2xl:h-[600px]">
            <PDFViewer pdfUrl={documentUrl} mode="viewer" />
          </div>
        );
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'WEBP':
        return (
          <img
            src={fullUrl}
            alt={documentName || 'Document'}
            className="max-w-full max-h-[80vh] object-contain rounded-md"
          />
        );
      default:
        return (
          <div className="p-4 text-sm text-gray-500 border rounded bg-gray-50">
            Preview not supported for: {type}
          </div>
        );
    }
  }, [type, documentUrl, documentName, fullUrl]);

  /** ---- Render ---- */
  if (!type) {
    return <p>Invalid document</p>;
  }

  return (
    <div className="mt-4 space-y-2">
      {isDocumentNameVisible && (
        <div className="text-sm font-medium text-gray-700">
          <span className="mr-1 text-md">{documentName || 'Document'} :</span>{' '}
          {type}
        </div>
      )}

      <div>{PreviewComponent}</div>

      <ModalWithContent
        isOpen={showDocumentModal}
        setIsOpen={setShowDocumentModal}
        title={documentName || `${type} Document`}
        content={ModalComponent}
        maxWidth="max-w-4xl"
      />
    </div>
  );
};

export default DocumentViewer;
