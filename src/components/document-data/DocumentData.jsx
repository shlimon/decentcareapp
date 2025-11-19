import React, { useCallback, useState } from 'react';

import ShowDocument from './ShowDocument';
import UploadDocument from './UploadDocument';

function OptionsSelection({ setCurrentView }) {
   const options = [
      {
         id: 'show-document',
         icon: '📄',
         title: 'Show Document',
         description: 'See your uploaded documents',
      },
      {
         id: 'upload-document',
         icon: '📤',
         title: 'Upload Document',
         description: 'Upload and manage your documents',
      },
   ];

   return (
      <div>
         <h3
            style={{
               textAlign: 'center',
               marginBottom: '30px',
               color: '#4a5568',
               fontWeight: 600,
            }}
         >
            Choose an Option
         </h3>

         <div className="options-grid">
            {options.map((option) => (
               <div
                  key={option.id}
                  className="option-card"
                  onClick={() => setCurrentView(option.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCurrentView(option.id);
                     }
                  }}
               >
                  <div className="icon">{option.icon}</div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>

                  <button
                     className="btn"
                     style={{ width: 'auto', padding: '8px 16px' }}
                     onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView(option.id);
                     }}
                  >
                     Get Started
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
}

const DocumentData = () => {
   const [currentView, setCurrentView] = useState('options');

   const handleBack = useCallback(() => setCurrentView('options'), []);

   return (
      <div className="w-full max-w-[800px] rounded-xl text-center font-montserrat p-6 bg-white">
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

         {currentView === 'show-document' && <ShowDocument />}

         {currentView === 'upload-document' && <UploadDocument />}
      </div>
   );
};

export default DocumentData;
