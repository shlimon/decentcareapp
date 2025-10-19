import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:4000/api/app-data';

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const selected = options.find((opt) => opt.id === value);
    setDisplayValue(selected ? selected.name : '');
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return options.filter(
      (opt) => opt.name.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [searchTerm, options]);

  const handleSelect = (option) => {
    onChange(option.id);
    setDisplayValue(option.name);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    if (displayValue && value !== displayValue) {
      onChange('');
      setDisplayValue('');
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" ref={wrapperRef}>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
        />
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(option)}
              >
                <div className="font-medium text-gray-900">{option.name}</div>
                {option.extra && (
                  <div className="text-xs text-gray-500 mt-1">
                    {option.extra}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ParticipantIncident({ user, onLogout }) {
  const [participantList, setParticipantList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    participant: '',
    dateRecorded: '',
    dateOfIncident: '',
    timeOfIncident: '',
    streetAddress: '',
    streetAddress2: '',
    incidentOnProvisionOfService: '',
    city: '',
    state: '',
    postalCode: '',
    hasWitnesses: '',
    witnessDetails: '',
    incidentDescription: '',
    resultedInInjury: '',
    treatmentProvided: '',
    natureOfInjury: '',
    equipmentInvolved: '',
    equipmentDetails: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/participants`);
      const data = await response.json();

      if (data.success) {
        setParticipantList(data.data);
      } else {
        toast.error('Failed to load participants.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while fetching participants.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.participant) {
      toast.error('Please select a participant from the dropdown.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recordedDate = new Date(formData.dateRecorded);
    recordedDate.setHours(0, 0, 0, 0);

    const incidentDate = new Date(formData.dateOfIncident);
    incidentDate.setHours(0, 0, 0, 0);

    if (recordedDate > today) {
      toast.error(
        'Date that the incident was recorded on cannot be in the future.'
      );
      return;
    }

    if (incidentDate > recordedDate) {
      toast.error(
        'Date of the Incident must be before or equal to the date it was recorded.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const formattedData = {
        participant: formData.participant,
        incidentOnProvisionOfService:
          formData.incidentOnProvisionOfService === 'yes',
        incidentDetails: {
          dateOfIncident: formData.dateOfIncident,
          timeOfIncident: formData.timeOfIncident,
          incidentRecordDate:
            formData.dateRecorded || new Date().toISOString().split('T')[0],
          location: {
            street: formData.streetAddress,
            suburb: formData.streetAddress2 || '',
            city: formData.city,
            state: formData.state,
            postCode: formData.postalCode,
          },
        },
        witnesses: formData.hasWitnesses === 'yes',
        witnessDetails: formData.witnessDetails || '',
        descriptionOfIncident: formData.incidentDescription,
        didInjured: formData.resultedInInjury === 'yes',
        treatmentProvided: formData.treatmentProvided || '',
        natureOfInjury: formData.natureOfInjury || '',
        equipmentInvolved: formData.equipmentInvolved === 'yes',
        equipmentDetails: formData.equipmentDetails || '',
      };

      const response = await fetch(`${API_BASE}/incident-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          name: user?.name || '',
          phone: user?.phone || '',
          dob: user?.dob || '',
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Incident report submitted successfully!');
        setFormData({
          participant: '',
          dateRecorded: '',
          dateOfIncident: '',
          timeOfIncident: '',
          streetAddress: '',
          streetAddress2: '',
          city: '',
          state: '',
          postalCode: '',
          hasWitnesses: '',
          witnessDetails: '',
          incidentDescription: '',
          resultedInInjury: '',
          incidentOnProvisionOfService: '',
          treatmentProvided: '',
          natureOfInjury: '',
          equipmentInvolved: '',
          equipmentDetails: '',
        });

        window.scrollTo(0, 0);
      } else {
        toast.error(
          result.message || 'Failed to submit report. Please try again.'
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading form data...</div>
      </div>
    );
  }

  const participantOptions = participantList.map((participant) => ({
    id: participant._id,
    name: participant.name,
    extra: participant.community,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div>
        <div className="flex justify-between items-start mb-8 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Incident Report
            </h1>
            <h2 className="text-xl text-gray-700">{user?.name}</h2>
            <p className="text-gray-600 mt-1">{user?.email}</p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Participant Details
          </h2>

          <SearchableSelect
            label="Select Participant"
            options={participantOptions}
            value={formData.participant}
            onChange={(value) => handleSelectChange('participant', value)}
            placeholder="Enter exact participant name..."
            required={true}
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Did the incident occur under our provision of Services?{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="incidentOnProvisionOfService"
                  value="yes"
                  checked={formData.incidentOnProvisionOfService === 'yes'}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="incidentOnProvisionOfService"
                  value="no"
                  checked={formData.incidentOnProvisionOfService === 'no'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6 mt-8">
            Incident Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of the Incident <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfIncident"
                value={formData.dateOfIncident}
                onChange={handleChange}
                onKeyDown={(e) => e.preventDefault()}
                max={
                  formData.dateRecorded ||
                  new Date().toISOString().split('T')[0]
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date that the incident was recorded on{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateRecorded"
                value={formData.dateRecorded}
                onChange={handleChange}
                onKeyDown={(e) => e.preventDefault()}
                min={formData.dateOfIncident || undefined}
                max={new Date().toISOString().split('T')[0]}
                disabled={!formData.dateOfIncident}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time of the Incident <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="timeOfIncident"
              value={formData.timeOfIncident}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Exact Location of the Incident
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Street address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State / Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State / Province"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal / Zip Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal / Zip code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Were there any witnesses? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="hasWitnesses"
                  value="yes"
                  checked={formData.hasWitnesses === 'yes'}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="hasWitnesses"
                  value="no"
                  checked={formData.hasWitnesses === 'no'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {formData.hasWitnesses === 'yes' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please List the witnesses full names as well as a contact number
                for each <span className="text-red-500">*</span>
              </label>
              <textarea
                name="witnessDetails"
                value={formData.witnessDetails}
                onChange={handleChange}
                placeholder="Witness details"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe how the incident occurred and if there was any damage to
              property or equipment <span className="text-red-500">*</span>
            </label>
            <textarea
              name="incidentDescription"
              value={formData.incidentDescription}
              onChange={handleChange}
              placeholder="Describe the incident in detail"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="6"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Did this incident result in an injury?{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="resultedInInjury"
                  value="yes"
                  checked={formData.resultedInInjury === 'yes'}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="resultedInInjury"
                  value="no"
                  checked={formData.resultedInInjury === 'no'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {formData.resultedInInjury === 'yes' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nature of injury e.g., sprain, cut, burn{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="natureOfInjury"
                  value={formData.natureOfInjury}
                  onChange={handleChange}
                  placeholder="Nature of injury"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Was any treatment provided?{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="treatmentProvided"
                  value={formData.treatmentProvided}
                  onChange={handleChange}
                  placeholder="If yes, please provide details (e.g., first aid given by who, referred to e.g. GP)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Was any equipment involved in the injury?{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="equipmentInvolved"
                      value="yes"
                      checked={formData.equipmentInvolved === 'yes'}
                      onChange={handleChange}
                      className="mr-2"
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="equipmentInvolved"
                      value="no"
                      checked={formData.equipmentInvolved === 'no'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.equipmentInvolved === 'yes' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provide Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="equipmentDetails"
                    value={formData.equipmentDetails}
                    onChange={handleChange}
                    placeholder="Details of the equipment involved"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Incident Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
