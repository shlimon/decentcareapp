import { useCallback, useMemo, useState } from 'react';
import { LuFileText } from 'react-icons/lu';
import { PDFViewer } from './PDFViewer';
import ModalWithContent from './modal2/ModalWithContent';

const DocumentViewerForApp = ({
   document,

   modalViews = [],
}) => {
   const [showDocumentModal, setShowDocumentModal] = useState(false);

   // Safe destructuring (avoid crash when document = null)
   const {
      documentType,
      documentUrl,
      documentName,
      documentNumber,
      uploadTime,
      expiryDate,
   } = document || {};

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
               <div
                  className={`border rounded shadow ${
                     shouldShowInModal
                        ? 'cursor-pointer hover:opacity-90 transition-opacity'
                        : ''
                  }`}
                  onClick={shouldShowInModal ? handleDocumentClick : undefined}
               >
                  <PDFViewer
                     pdfUrl={documentUrl}
                     mode="preview"
                     width={300}
                     height={200}
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
               <div className="text-sm text-gray-500 border rounded bg-gray-50 p-4">
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
               <div className="text-sm text-gray-500 border rounded bg-gray-50 p-4">
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
      <div className="space-y-2">
         <div
            className="w-full  p-2 rounded-2xl bg-[#E9FDF3] flex items-start justify-between border cursor-pointer hover:shadow-md transition-shadow"
            onClick={shouldShowInModal ? handleDocumentClick : undefined}
         >
            {/* Left Section */}
            {/* Left Section */}
            <div className="flex items-start gap-2 p-2">
               <LuFileText size={24} className="text-gray-600" />

               <div className="flex flex-col gap-1 items-start">
                  <span className="font-semibold text-gray-800">
                     {documentName || 'Document'}
                  </span>

                  <p className="text-gray-700 text-lg font-medium">
                     {documentNumber || 'Document Number'}
                  </p>

                  <p className="text-sm text-gray-500">
                     Uploaded: {uploadTime || 'Upload Date'}
                  </p>
               </div>
            </div>

            {/* Status Badge */}
            <span className="px-3 py-1 text-sm bg-green-600 text-white rounded-full h-fit">
               {/* {expiryDate || 'Valid'} */}
               active
            </span>
         </div>

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

export default DocumentViewerForApp;
