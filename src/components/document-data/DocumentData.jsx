import React, { useCallback, useState } from 'react';

import ShowDocument from './ShowDocument';
import UploadDocument from './UploadDocument';

const DocumentData = () => {
   const [currentView, setCurrentView] = useState('show-document');

   const handleBack = useCallback(() => setCurrentView('options'), []);

   return (
      <div className="w-full max-w-[800px] rounded-xl text-center font-montserrat p-6">
         {currentView === 'show-document' && <ShowDocument />}

         {currentView === 'upload-document' && (
            <div>
               {/* button to back to show document main page */}
               <button
                  onClick={() => setCurrentView('show-document')}
                  className="back-btn"
                  aria-label="Back to Show Document"
               >
                  ← Back to Show Document
               </button>

               <UploadDocument document={document} />
            </div>
         )}
      </div>
   );
};

export default DocumentData;
