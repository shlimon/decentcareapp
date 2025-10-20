import axiosInstance from '@api/axiosInstance';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

// Utility functions
const getTodayDate = () => new Date().toISOString().split('T')[0];
const formatDate = (dateString) => new Date(dateString).toLocaleString();

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

const getStatusColor = (status) => {
  const colors = {
    Approved: '#38a169',
    Rejected: '#e53e3e',
    Pending: '#d69e2e',
  };
  return colors[status] || '#718096';
};

// Dropdown Component
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

// ------------------------------
// Main Component
// ------------------------------
function RequestPermission() {
  const [participants, setParticipants] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [formData, setFormData] = useState({
    requestTravel: '',
    dateForTravel: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [participantsRes, requestsRes] = await Promise.all([
        axiosInstance.get('/participants'),
        axiosInstance.get('/requests?request=my-request'),
      ]);

      if (participantsRes.data.success) {
        setParticipants(participantsRes.data.data);
      } else {
        toast.error(
          participantsRes.data.message || 'Failed to fetch participants'
        );
      }

      if (requestsRes.data.success) {
        setRequests(requestsRes.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
    setSearchQuery(participant.name);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
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
    setSuccess('');

    if (!selectedParticipant) {
      toast.error('Please select a participant from the dropdown.');
      setSubmitting(false);
      return;
    }

    if (!formData.requestTravel || parseInt(formData.requestTravel, 10) <= 50) {
      toast.error('Approximate Intended Travel KM must be more than 50.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await axiosInstance.post('/requests', {
        requestedFor: selectedParticipant._id,
        requestTravel: parseInt(formData.requestTravel),
        dateForTravel: new Date(formData.dateForTravel).toISOString(),
      });

      if (res.data.success) {
        setSuccess('Request submitted successfully!');
        setFormData({ requestTravel: '', dateForTravel: '' });
        setSearchQuery('');
        setSelectedParticipant(null);
        setShowForm(false);
        fetchData();
      } else {
        toast.error(res.data.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading data...</div>;

  return (
    <div>
      {/* Header */}
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
              setFormData({ requestTravel: '', dateForTravel: '' });
            }
          }}
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {success && <div className="success">{success}</div>}

      {/* Form */}
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

      {/* Requests Table */}
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

      {/* No Data */}
      {!showForm && requests.length === 0 && (
        <div className="no-data">
          No requests found. Click "New Request" to create your first travel
          request.
        </div>
      )}
    </div>
  );
}

export default RequestPermission;
