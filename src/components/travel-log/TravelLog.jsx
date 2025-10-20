import React, { useCallback, useState } from 'react';
import RequestPermission from './RequestPermission';
import TravelLogForm from './TravelLogForm';

const API_BASE = import.meta.env.VITE_API_URL;

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
      id: 'request-permission',
      icon: '📋',
      title: 'Request Permission',
      description: 'Submit travel permission requests for participants',
    },
    {
      id: 'travel-log',
      icon: '📊',
      title: 'Travel Log',
      description: 'Log completed travel details and submit records',
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

const TravelLog = () => {
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
        {currentView === 'request-permission' && <RequestPermission />}
        {currentView === 'travel-log' && <TravelLogForm />}
      </div>
    </div>
  );
};

export default TravelLog;
