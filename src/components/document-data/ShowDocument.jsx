import DocumentViewer from '@components/reusable/DocumentViewer';
import useDocumentsData from '@hooks/useDocumentsData';
import React, { useCallback, useState } from 'react';

function OptionsSelection({ setCurrentView }) {
   const user = localStorage.getItem('user_data');
   const userData = JSON.parse(user);
   console.log('Staff ID:', userData.user._id);

   const {
      data: documentsData,
      isLoading: isLoadingDocuments,
      isError: isErrorDocuments,
   } = useDocumentsData(userData.user._id);

   console.log('Documents Data:', documentsData);

   const dataDocument = {
      documentUrl: documentsData?.[0]?.documentUrl,
      documentName: documentsData?.[0]?.documentName,
      documentType: documentsData?.[0]?.documentType,
   };

   return (
      <div>
         <div>
            {documentsData?.map((document) => (
               <div key={document._id} className="">
                  <div className="flex-1 overflow-hidden justify-center items-center flex h-80">
                     <DocumentViewer
                        document={dataDocument}
                        modalViews={['jpg', 'jpeg', 'png', 'pdf']}
                     />
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

const ShowDocument = () => {
   const user = localStorage.getItem('user_data');
   const userData = JSON.parse(user);
   console.log('Staff ID:', userData.user._id);

   const {
      data: documentsData,
      isLoading: isLoadingDocuments,
      isError: isErrorDocuments,
   } = useDocumentsData(userData.user._id);

   console.log('Documents Data:', documentsData);

   const [currentView, setCurrentView] = useState('options');
   const handleBack = useCallback(() => setCurrentView('options'), []);

   return (
      <div className="py-8 px-4">
         <div className="card">
            {currentView !== 'options' && (
               <button
                  className="back-btn"
                  onClick={handleBack}
                  aria-label="Back to options"
               >
                  ← Back to Options
               </button>
            )}
            {currentView === 'options' && (
               <OptionsSelection setCurrentView={setCurrentView} />
            )}
         </div>
      </div>
   );
};

export default ShowDocument;
