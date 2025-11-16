import useDocumentsData from '@hooks/useDocumentsData';
import React, { useCallback, useState } from 'react';

function OptionsSelection({ setCurrentView }) {
   const options = [
      {
         id: 'document-1',
         title: 'Document 1',
         description: 'This is document 1',
      },
      {
         id: 'document-2',
         title: 'Document 2',
         description: 'This is document 2',
      },
      {
         id: 'document-3',
         title: 'Document 3',
         description: 'This is document 3',
      },
      {
         id: 'document-4',
         title: 'Document 4',
         description: 'This is document 4',
      },
      {
         id: 'document-5',
         title: 'Document 5',
         description: 'This is document 5',
      },
      {
         id: 'document-6',
         title: 'Document 6',
         description: 'This is document 6',
      },
      {
         id: 'document-7',
         title: 'Document 7',
         description: 'This is document 7',
      },
      {
         id: 'document-8',
         title: 'Document 8',
         description: 'This is document 8',
      },
   ];

   return (
      <div>
         <div className="options-grid">
            {options.map((option) => (
               <div key={option.id} className="option-card">
                  <h3 className="text-nowrap">{option.title}</h3>
                  <p>{option.description}</p>
                  <button
                     className="btn"
                     style={{ width: 'auto', padding: '8px 16px' }}
                  >
                     Show it
                  </button>
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
