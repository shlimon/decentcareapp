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
      <div className="w-full max-w-[800px] rounded-xl  font-montserrat p-6 bg-white h-full space-y-4">
         <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
            {JSON.parse(localStorage.getItem('user_data'))?.user?.name ||
               'User Name'}
         </div>
         {currentView === 'show-document' && (
            <ShowDocument onUploadDocument={handleUploadDocument} />
         )}

         {currentView === 'upload-document' && (
            <div className="space-y-4 text-center">
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
                  isDocumentNameData={true}
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
