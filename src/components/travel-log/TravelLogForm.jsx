import axiosInstance from '@api/axiosInstance';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import SignatureCanvas from './SignatureCanvas';

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

const getTodayDate = () => new Date().toISOString().split('T')[0];

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

function TravelLogForm() {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [travelType, setTravelType] = useState('');
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    totalKm: '',
    agreed: false,
    signature: '',
    travelDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [kmError, setKmError] = useState('');

  // ✅ Fetch participants using axiosInstance
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/participants');
      if (res.data.success) {
        setParticipants(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to fetch participants');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // ✅ Fetch request data using axiosInstance
  const fetchRequestData = useCallback(async (participantId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/requests/participant/${participantId}`
      );
      if (res.data.success) {
        setRequestData(
          res.data.data && Object.keys(res.data.data).length > 0
            ? res.data.data
            : { noRequest: true }
        );
      } else {
        toast.error(res.data.message || 'Failed to fetch request data');
        setRequestData(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
      setRequestData(null);
    } finally {
      setLoading(false);
    }
  }, []);

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
      toast.error('Please select a participant from the dropdown.');
      return;
    }

    const kmValue = parseInt(formData.totalKm);
    const validationError = validateKm(formData.totalKm, travelType);
    if (validationError) {
      setKmError(validationError);
      return;
    }

    setSubmitting(true);
    setSuccess('');
    setKmError('');

    try {
      let approval = 'Not Approved';
      const requestPayload = {
        participant: selectedParticipant._id,
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

      // ✅ Use axiosInstance for POST
      const res = await axiosInstance.post('/travels', requestPayload);

      if (res.data.success) {
        setSuccess('Travel log submitted successfully!');
        resetForm();
        setSelectedParticipant(null);
        setSearchQuery('');
        setTravelType('');
        setRequestData(null);
      } else {
        toast.error(res.data.message || 'Failed to submit travel log');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
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
      <h3 style={{ marginBottom: '20px', color: '#4a5568', fontWeight: 600 }}>
        Travel Log
      </h3>

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
            <label htmlFor="agreed">
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

export default TravelLogForm;
