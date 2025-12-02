import React, { useCallback, useState } from 'react';

import ShowDocument from './ShowDocument';
import UploadDocument from './UploadDocument';

const DocumentData = () => {
   const [currentView, setCurrentView] = useState('show-document');
   const [selectedDocument, setSelectedDocument] = useState(null);

   const handleUploadDocument = useCallback((documentName) => {
      setSelectedDocument({ documentName });
      setCurrentView('upload-document');
   }, []);

   return (
      <div className="w-full max-w-[800px] rounded-xl text-center font-montserrat p-6">
         {currentView === 'show-document' && (
            <ShowDocument onUploadDocument={handleUploadDocument} />
         )}

         {currentView === 'upload-document' && (
            <div>
               {/* button to back to show document main page */}
               <button
                  onClick={() => {
                     setCurrentView('show-document');
                     setSelectedDocument(null);
                  }}
                  className="back-btn"
                  aria-label="Back to Show Document"
               >
                  ← Back to Show Document
               </button>

               <UploadDocument
                  document={selectedDocument}
                  setUpdateModalOpen={() => {
                     setCurrentView('show-document');
                     setSelectedDocument(null);
                  }}
               />
            </div>
         )}
      </div>
   );
};

export default DocumentData;
