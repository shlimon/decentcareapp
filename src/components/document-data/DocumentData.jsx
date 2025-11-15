import React, { useCallback, useState } from 'react';

import ShowDocument from './ShowDocument';
import UploadDocument from './UploadDocument';

// ❗ API_BASE is defined but never used — safe to remove unless needed later
// const API_BASE = import.meta.env.VITE_API_URL;

// Utility functions for in-memory storage
const storage = {
   data: {},
   setItem: (key, value) => {
      storage.data[key] = value;
   },
   getItem: (key) => {
      return storage.data[key] || null;
   },
   removeItem: (key) => {
      delete storage.data[key];
   },
};

function OptionsSelection({ setCurrentView }) {
   const options = [
      {
         id: 'show-document',
         icon: '📋',
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
               >
                  <div className="icon">{option.icon}</div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>

                  <button
                     className="btn"
                     style={{ width: 'auto', padding: '8px 16px' }}
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
      <div className="py-8 px-4">
         <div className="card">
            {currentView !== 'options' && (
               <button className="back-btn" onClick={handleBack}>
                  ← Back to Options
               </button>
            )}

            {currentView === 'options' && (
               <OptionsSelection setCurrentView={setCurrentView} />
            )}

            {currentView === 'show-document' && <ShowDocument />}
            {currentView === 'upload-document' && <UploadDocument />}
         </div>
      </div>
   );
};

export default DocumentData;
