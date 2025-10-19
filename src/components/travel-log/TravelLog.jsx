import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// const API_BASE = 'https://dc-central-api-v2.onrender.com/api/app-data';
const API_BASE = 'http://localhost:4000/api/app-data';

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
// Custom hooks
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [key]
  );

  return [value, setStoredValue];
};

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

// Utility functions
const getTodayDate = () => new Date().toISOString().split('T')[0];

const formatDate = (dateString) => new Date(dateString).toLocaleString();

const getStatusColor = (status) => {
  const colors = {
    Approved: '#38a169',
    Rejected: '#e53e3e',
    Pending: '#d69e2e',
  };
  return colors[status] || '#718096';
};

const getStatusMessage = (status) => {
  const messages = {
    Pending: {
      type: 'warning',
      message: 'Your request travel log is Pending.',
    },
    Declined: {
      type: 'warning',
      message: 'Your request travel log is Declined.',
    },
    Approved: {
      type: 'success',
      message: 'Your requested travel log is accepted.',
    },
  };
  return messages[status] || { type: 'info', message: `Status: ${status}` };
};

// API helper
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  return response.json();
};

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      };

      // remove firstName and lastName from payload before sending
      delete payload.firstName;
      delete payload.lastName;

      const result = await apiCall('/staffs/sw-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (result.success) {
        onLogin(result.data);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="login-form">
        <h1>Provide Your Details</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+61412345670"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user, currentView, setCurrentView, onBack }) {
  return (
    <div className="card">
      {currentView !== 'options' && (
        <button className="back-btn" onClick={onBack}>
          ← Back to Options
        </button>
      )}

      {currentView === 'options' && (
        <OptionsSelection setCurrentView={setCurrentView} />
      )}
      {currentView === 'request-permission' && (
        <RequestPermission user={user} />
      )}
      {currentView === 'travel-log' && <TravelLog user={user} />}
    </div>
  );
}

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

function SearchableDropdown({
  participants,
  onSelect,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filteredParticipants = useMemo(() => {
    if (!value.trim()) return [];
    return participants.filter(
      (p) => p.name.toLowerCase() === value.toLowerCase()
    );
  }, [value, participants]);

  useClickOutside(dropdownRef, () => setShowDropdown(false));

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        required
      />
      {showDropdown && filteredParticipants.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            marginTop: '4px',
          }}
        >
          {filteredParticipants.map((participant) => (
            <div
              key={participant._id}
              onClick={() => {
                onSelect(participant);
                setShowDropdown(false);
              }}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f7fafc',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f7fafc')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
            >
              <div style={{ fontWeight: 500 }}>{participant.name}</div>
              {participant.community && (
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                  {participant.community}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RequestPermission({ user }) {
  const [participants, setParticipants] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [formData, setFormData] = useState({
    requestTravel: '',
    dateForTravel: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const authHeaders = useMemo(
    () => ({
      name: user.name,
      phone: user.phone,
      dob: user.dob,
    }),
    [user]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [participantsResult, requestsResult] = await Promise.all([
        apiCall('/participants', { headers: authHeaders }),
        apiCall('/requests?request=my-request', { headers: authHeaders }),
      ]);

      if (participantsResult.success) {
        setParticipants(participantsResult.data);
      } else {
        setError(participantsResult.message || 'Failed to fetch participants');
      }

      if (requestsResult.success) {
        setRequests(requestsResult.data);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
    setSearchQuery(participant.name);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // Clear selected participant if search query changes
    if (selectedParticipant && selectedParticipant.name !== value) {
      setSelectedParticipant(null);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!selectedParticipant) {
      setError('Please select a participant from the dropdown.');
      setSubmitting(false);
      return;
    }

    if (!formData.requestTravel || parseInt(formData.requestTravel, 10) <= 50) {
      setError('Approximate Intended Travel KM must be more than 50.');
      setSubmitting(false);
      return;
    }

    try {
      const result = await apiCall('/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          requestedFor: selectedParticipant._id,
          requestTravel: parseInt(formData.requestTravel),
          dateForTravel: new Date(formData.dateForTravel).toISOString(),
        }),
      });

      if (result.success) {
        setSuccess('Request submitted successfully!');
        setFormData({
          requestTravel: '',
          dateForTravel: '',
        });
        setSearchQuery('');
        setSelectedParticipant(null);
        setShowForm(false);
        fetchData();
      } else {
        setError(result.message || 'Failed to submit request');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading data...</div>;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ color: '#4a5568', fontWeight: 600 }}>
          Request Travel Permission
        </h3>
        <button
          className="btn"
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setSearchQuery('');
              setSelectedParticipant(null);
              setFormData({
                requestTravel: '',
                dateForTravel: '',
              });
            }
          }}
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {showForm && (
        <div className="info-box">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="requestedFor">Participant Name</label>
              <SearchableDropdown
                participants={participants}
                onSelect={handleParticipantSelect}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search and select participant"
              />
              {selectedParticipant && (
                <div className="participant-info">
                  <div>
                    <strong>Name:</strong> {selectedParticipant.name}
                  </div>
                  <div>
                    <strong>Community:</strong> {selectedParticipant.community}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dateForTravel">Date of Travel</label>
              <input
                type="date"
                id="dateForTravel"
                name="dateForTravel"
                value={formData.dateForTravel}
                onChange={handleChange}
                min={getTodayDate()}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requestTravel">
                Approximate Intended Travel KM
              </label>
              <input
                type="number"
                id="requestTravel"
                name="requestTravel"
                value={formData.requestTravel}
                onChange={handleChange}
                placeholder="Enter KM (e.g., 75)"
                min="51"
                onWheel={(e) => e.currentTarget.blur()}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {!showForm && requests.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Participant</th>
                <th>Travel KM</th>
                <th>Status</th>
                <th>Requested Time</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.requestedFor.name}</td>
                  <td>{request.requestTravel}</td>
                  <td>
                    <span
                      style={{
                        color: getStatusColor(request.status),
                        fontWeight: '600',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: getStatusColor(request.status) + '20',
                      }}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>{formatDate(request.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!showForm && requests.length === 0 && (
        <div className="no-data">
          No requests found. Click "New Request" to create your first travel
          request.
        </div>
      )}
    </div>
  );
}

function TravelLog({ user }) {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [travelType, setTravelType] = useState('');
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    totalKm: '',
    agreed: false,
    signature: '',
    travelDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [kmError, setKmError] = useState('');

  const authHeaders = useMemo(
    () => ({
      name: user.name,
      phone: user.phone,
      dob: user.dob,
    }),
    [user]
  );

  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiCall('/participants', {
        headers: authHeaders,
      });
      if (result.success) {
        setParticipants(result.data);
      } else {
        setError(result.message || 'Failed to fetch participants');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const fetchRequestData = useCallback(
    async (participantId) => {
      setLoading(true);
      setError('');
      try {
        const result = await apiCall(`/requests/participant/${participantId}`, {
          headers: authHeaders,
        });

        if (result.success) {
          setRequestData(
            result.data && Object.keys(result.data).length > 0
              ? result.data
              : { noRequest: true }
          );
        } else {
          setError(result.message || 'Failed to fetch request data');
          setRequestData(null);
        }
      } catch (err) {
        setError('Network error. Please try again.');
        setRequestData(null);
      } finally {
        setLoading(false);
      }
    },
    [authHeaders]
  );

  const resetForm = useCallback(() => {
    setFormData({
      totalKm: '',
      agreed: false,
      signature: '',
      travelDate: '',
    });
    setKmError('');
  }, []);

  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
    setSearchQuery(participant.name);
    resetForm();
    setRequestData(null);
    setTravelType('');
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // Clear selected participant if search query changes
    if (selectedParticipant && selectedParticipant.name !== value) {
      setSelectedParticipant(null);
      setTravelType('');
      setRequestData(null);
      resetForm();
    }
  };

  const handleTravelTypeChange = useCallback(
    (type) => {
      setTravelType(type);
      setFormData((prev) => ({
        ...prev,
        travelDate: getTodayDate(),
        totalKm: '',
      }));
      setKmError('');

      if (type === 'over-50' && selectedParticipant) {
        fetchRequestData(selectedParticipant._id);
      } else if (type === 'under-50') {
        setRequestData(null);
      }
    },
    [selectedParticipant, fetchRequestData]
  );

  const validateKm = useCallback((value, type) => {
    const kmValue = parseInt(value);
    if (type === 'under-50' && kmValue > 50) {
      return 'For travel over 50 KM, please select the "Over 50 KM Travel" option.';
    }
    if (type === 'over-50' && kmValue < 51) {
      return 'For travel under 50 KM, please select the "Under 50 KM Travel" option.';
    }
    return '';
  }, []);

  const handleFormChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;

      if (name === 'totalKm') {
        const error = validateKm(value, travelType);
        setKmError(error);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    },
    [travelType, validateKm]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedParticipant) {
      setError('Please select a participant from the dropdown.');
      return;
    }

    const kmValue = parseInt(formData.totalKm);
    const validationError = validateKm(formData.totalKm, travelType);
    if (validationError) {
      setKmError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    setKmError('');

    try {
      let approval = 'Not Approved';
      const requestPayload = {
        participant: selectedParticipant._id,
        staff: user._id,
        traveled: kmValue,
        date: new Date(formData.travelDate).toISOString(),
        approval,
        signature: formData.signature,
      };

      if (travelType === 'over-50' && requestData && !requestData.noRequest) {
        approval =
          requestData.status === 'Approved' ? 'Prior Approved' : 'Not Approved';
        requestPayload.requestId = requestData._id;
        requestPayload.approval = approval;
      }

      const result = await apiCall('/travels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(requestPayload),
      });

      if (result.success) {
        setSuccess('Travel log submitted successfully!');
        resetForm();
        setSelectedParticipant(null);
        setSearchQuery('');
        setTravelType('');
        setRequestData(null);
      } else {
        setError(result.message || 'Failed to submit travel log');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      formData.agreed &&
      formData.signature &&
      formData.totalKm &&
      formData.travelDate &&
      !kmError &&
      selectedParticipant
    );
  }, [formData, kmError, selectedParticipant]);

  return (
    <div>
      <h3
        style={{
          marginBottom: '20px',
          color: '#4a5568',
          fontWeight: 600,
        }}
      >
        Travel Log
      </h3>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="form-group">
        <label htmlFor="participant">Participant Name</label>
        <SearchableDropdown
          participants={participants}
          onSelect={handleParticipantSelect}
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search and select participant"
        />
        {selectedParticipant && (
          <div className="participant-info">
            <div>
              <strong>Name:</strong> {selectedParticipant.name}
            </div>
            <div>
              <strong>Community:</strong> {selectedParticipant.community}
            </div>
          </div>
        )}
      </div>

      {selectedParticipant && (
        <>
          <h4
            style={{
              marginBottom: '15px',
              marginTop: '20px',
              color: '#4a5568',
              fontWeight: 600,
            }}
          >
            Travel Type
          </h4>
          <div className="travel-options">
            <div
              className={`travel-option ${
                travelType === 'under-50' ? 'selected' : ''
              }`}
              onClick={() => handleTravelTypeChange('under-50')}
            >
              <h4>Under 50 KM Travel</h4>
              <p>No permission required</p>
            </div>
            <div
              className={`travel-option ${
                travelType === 'over-50' ? 'selected' : ''
              }`}
              onClick={() => handleTravelTypeChange('over-50')}
            >
              <h4>Over 50 KM Travel</h4>
              <p>Need permission</p>
            </div>
          </div>
        </>
      )}

      {loading && <div className="loading">Loading request data...</div>}

      {travelType === 'over-50' && requestData && (
        <div className="info-box">
          {requestData.noRequest ? (
            <div>
              <h4>Request Information</h4>
              <div className="status-message status-warning">
                No prior request found for this participant. You can still log
                travel over 50km without prior approval.
              </div>
            </div>
          ) : (
            <div className="participant-info">
              <h4>Request Information</h4>
              <div>
                <strong>Requested by:</strong> {requestData.requestedBy.name}
              </div>
              <div>
                <strong>Requested for:</strong> {requestData.requestedFor.name}
              </div>
              <div>
                <strong>Requested Travel:</strong> {requestData.requestTravel}{' '}
                KM
              </div>
              <div>
                <strong>Status:</strong> {requestData.status}
              </div>
              <div
                className={`status-message status-${
                  getStatusMessage(requestData.status).type
                }`}
              >
                {getStatusMessage(requestData.status).message}
              </div>
            </div>
          )}
        </div>
      )}

      {travelType && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="travelDate">Travel Date</label>
            <input
              type="date"
              id="travelDate"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleFormChange}
              required
              disabled
            />
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="agreed"
              name="agreed"
              checked={formData.agreed}
              onChange={handleFormChange}
              required
            />
            <label style={{ marginBottom: '0px' }} htmlFor="agreed">
              I agree the KM travelled is true and accurate
            </label>
          </div>

          {formData.agreed && (
            <>
              <div className="form-group">
                <label htmlFor="totalKm">Total KM Travelled</label>
                <input
                  type="number"
                  id="totalKm"
                  name="totalKm"
                  value={formData.totalKm}
                  onChange={handleFormChange}
                  placeholder={
                    travelType === 'under-50'
                      ? 'Enter KM (up to 50 KM allowed)'
                      : 'Enter actual KM travelled'
                  }
                  min="0"
                  max={travelType === 'under-50' ? '50' : undefined}
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
                {travelType === 'under-50' && (
                  <small>Must be 50 KM or less for this option</small>
                )}
              </div>

              {kmError && <div className="error">{kmError}</div>}

              <div className="form-group">
                <label htmlFor="signature">Signature</label>
                <SignatureCanvas
                  onSignatureChange={(signature) =>
                    setFormData((prev) => ({ ...prev, signature }))
                  }
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn"
            disabled={submitting || !isFormValid}
          >
            {submitting ? 'Submitting...' : 'Submit Travel Log'}
          </button>
        </form>
      )}
    </div>
  );
}

function SignatureCanvas({ onSignatureChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const getCoordinates = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback(
    (e) => {
      e.preventDefault();
      setIsDrawing(true);
      setHasSignature(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const coords = getCoordinates(e, canvas);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    },
    [getCoordinates]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const coords = getCoordinates(e, canvas);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    },
    [isDrawing, getCoordinates]
  );

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL();
      onSignatureChange(dataURL);
    }
  }, [isDrawing, onSignatureChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange('');
  }, [onSignatureChange]);

  return (
    <div>
      <div className="signature-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="signature-canvas"
          style={{ touchAction: 'none' }}
        />
        {!hasSignature && (
          <div className="signature-placeholder">
            Click and drag to sign here
          </div>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={clearSignature}
          className="clear-signature-btn"
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
}

const TravelLogMain = () => {
  const [user, setUser] = useLocalStorage('user_data', null);
  const [currentView, setCurrentView] = useState('options');
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(
    (userData) => {
      setUser(userData);
    },
    [setUser]
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentView('options');
    storage.removeItem('user_data');
  }, [setUser]);

  const handleBack = useCallback(() => setCurrentView('options'), []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard
          user={user}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default TravelLogMain;
