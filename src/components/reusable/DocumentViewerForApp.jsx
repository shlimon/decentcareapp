import { formatDate } from '@utils/DateFormation';
import { useCallback, useMemo, useState } from 'react';
import { LuFileText } from 'react-icons/lu';
import { PDFViewer } from './PDFViewer';
import ModalWithContent from './modal2/ModalWithContent';

const DocumentViewerForApp = ({ document, modalViews = [] }) => {
   const [showDocumentModal, setShowDocumentModal] = useState(false);

   const {
      documentType,
      documentUrl,
      documentName,
      documentNumber,
      uploadTime,
      expiryDate,
      status,
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

   // ✅ Helper: Expiring / Expired text
   const getExpiryText = (status, expiryDate) => {
      if (!expiryDate) return '';

      const now = new Date();
      const exp = new Date(expiryDate);

      const diffTime = exp - now;
      const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));

      if (status?.toLowerCase() === 'expire in') {
         return `${diffDays} days`;
      }

      if (status?.toLowerCase() === 'expired') {
         return `${diffDays} days ago`;
      }

      return formatDate(expiryDate);
   };

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

   if (!type) {
      return <p>Invalid document</p>;
   }

   // Status badge styles
   const getStatusButtonStyles = (status) => {
      switch (status?.toLowerCase()) {
         case 'active':
            return { bgColor: 'bg-[#00A672]' };
         case 'expired':
            return { bgColor: 'bg-[#FF5E5E]' };
         case 'expire in':
            return { bgColor: 'bg-[#FE9239]' };
         default:
            return { bgColor: 'bg-gray-400' };
      }
   };

   const getStatusBgStyles = (status) => {
      switch (status?.toLowerCase()) {
         case 'active':
            return { bgColor: 'bg-[#EAFFF5]' };
         case 'expired':
            return { bgColor: 'bg-[#FFF0F0]' };
         case 'expire in':
            return { bgColor: 'bg-[#FFF7ED]' };
         default:
            return { bgColor: 'bg-gray-50' };
      }
   };

   return (
      <div className="space-y-2">
         <div
            className={`min-w-[380px]   p-2 rounded-2xl ${
               getStatusBgStyles(status).bgColor
            } flex items-start justify-between border border-gray-300 cursor-pointer hover:shadow-md transition-shadow`}
            onClick={shouldShowInModal ? handleDocumentClick : undefined}
         >
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
                     Uploaded: {formatDate(uploadTime) || 'Upload Date'}
                  </p>
               </div>
            </div>

            {/* Status Badge */}
            <div
               className={`px-3 py-1 ${
                  getStatusButtonStyles(status).bgColor
               } text-white rounded-full h-fit flex items-center justify-center gap-1 flex-wrap`}
            >
               <span className="text-sm">{status || 'Status'}</span>

               {status?.toLowerCase() !== 'active' && (
                  <span className="text-sm">
                     {getExpiryText(status, expiryDate)}
                  </span>
               )}
            </div>
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
