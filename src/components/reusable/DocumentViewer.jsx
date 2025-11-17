import { useCallback, useMemo, useState } from 'react';
import { PDFViewer } from './PDFViewer';
import ModalWithContent from './modal2/ModalWithContent';

const DocumentViewer = ({
   document,
   isDocumentNameVisible = true,
   modalViews = [],
}) => {
   const [showDocumentModal, setShowDocumentModal] = useState(false);

   // Safe destructuring (avoid crash when document = null)
   const { documentType, documentUrl, documentName } = document || {};

   const type = useMemo(
      () => (documentType ? documentType.toUpperCase() : null),
      [documentType]
   );

   const fullUrl = useMemo(() => {
      return documentUrl
         ? `${import.meta.env.VITE_DIGITALOCEAN_SPACES_URL}${documentUrl}`
         : '';
   }, [documentUrl]);

   const shouldShowInModal = useMemo(() => {
      return documentType
         ? modalViews.some(
              (view) => view.toLowerCase() === documentType.toLowerCase()
           )
         : false;
   }, [modalViews, documentType]);

   const handleDocumentClick = useCallback(() => {
      if (shouldShowInModal) setShowDocumentModal(true);
   }, [shouldShowInModal]);

   /** ---- Memoized Components ---- */
   const PreviewComponent = useMemo(() => {
      if (!type) return null;

      switch (type) {
         case 'PDF':
            return (
               <div className="w-[500px] h-[500px]">
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
            return (
               <img
                  src={fullUrl}
                  alt={documentName || 'Document'}
                  className={`max-w-full max-h-[300px] border rounded shadow ${
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
               <span className="mr-1 text-md">
                  {documentName || 'Document'} :
               </span>{' '}
               {type}
            </div>
         )}

         <div>{PreviewComponent}</div>

         <ModalWithContent
            isOpen={showDocumentModal}
            setIsOpen={setShowDocumentModal}
            title={documentName || `${type} Document`}
            content={ModalComponent}
            maxWidth="max-w-xl"
         />
      </div>
   );
};

export default DocumentViewer;
