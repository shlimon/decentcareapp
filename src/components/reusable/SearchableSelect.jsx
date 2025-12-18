import useParticipantsQuery from '@hooks/useParticipantsQuery';
import { getStoredData } from '@utils/manageLocalData';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Loading from './loading/Loading';

function SearchableSelect({
  label,
  endpoint = '/participants',
  value,
  onChange,
  onDepartmentChange,
  showDepartment = false,
  placeholder,
  required,
  error,
  multipleSelect = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // For multiple select
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const wrapperRef = useRef(null);

  const { data: rawOptions = [], isLoading: loading } =
    useParticipantsQuery(endpoint);

  // User Department
  const userData = getStoredData('user_data');
  const userDept = userData?.user?.department;

  // Allowed departments for auto-select
  const allowedDepts = [
    'Support Coordination',
    'Plan Management',
    'Recovery Coaching',
  ];

  // Format options
  const options = useMemo(() => {
    return rawOptions.map((item) => ({
      id: item._id,
      name: item.name,
      departments: item.department || [],
    }));
  }, [rawOptions]);

  // Close dropdown when clicking outside
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

  // Handle external value changes for SINGLE select
  useEffect(() => {
    if (multipleSelect) return;

    const selected = options.find((opt) => opt.id === value);

    if (!selected) {
      setDisplayValue('');
      setSelectedParticipant(null);
      setSelectedDepartment('');
      return;
    }

    setDisplayValue(selected.name);
    setSelectedParticipant(selected);

    if (!showDepartment) return;

    // CASE 1: userDept is one of allowed => auto-select
    if (allowedDepts.includes(userDept)) {
      const match = selected.departments.find(
        (d) => d.departmentName === userDept
      );
      if (match) {
        setSelectedDepartment(match.departmentName);
        onDepartmentChange?.(match.departmentName);
        return;
      }
    }

    // CASE 2: If not allowed user dept → only show dropdown when multiple depts
    if (selected.departments.length === 1) {
      const dept = selected.departments[0].departmentName;
      setSelectedDepartment(dept);
      onDepartmentChange?.(dept);
      return;
    }

    setSelectedDepartment('');
    onDepartmentChange?.('');
  }, [
    value,
    options,
    showDepartment,
    userDept,
    onDepartmentChange,
    multipleSelect,
  ]);

  // Handle external value changes for MULTIPLE select
  useEffect(() => {
    if (!multipleSelect) return;

    const valueArray = Array.isArray(value) ? value : [];
    const selected = options.filter((opt) => valueArray.includes(opt.id));
    setSelectedParticipants(selected);
  }, [value, options, multipleSelect]);

  // Only show exact match results
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return options.filter(
      (opt) => opt.name.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [searchTerm, options]);

  const handleSelectSingle = (option) => {
    onChange(option.id);
    setDisplayValue(option.name);
    setSearchTerm('');
    setIsOpen(false);
    setSelectedParticipant(option);

    if (!showDepartment) return;

    // CASE 1: userDept allowed → auto select
    if (allowedDepts.includes(userDept)) {
      const match = option.departments.find(
        (d) => d.departmentName === userDept
      );
      if (match) {
        setSelectedDepartment(match.departmentName);
        onDepartmentChange?.(match.departmentName);
        return;
      }
    }

    // CASE 2: If not allowed userDept → auto-select only if single dept
    if (option.departments.length === 1) {
      const dept = option.departments[0].departmentName;
      setSelectedDepartment(dept);
      onDepartmentChange?.(dept);
    } else {
      setSelectedDepartment('');
      onDepartmentChange?.('');
    }
  };

  const handleSelectMultiple = (option) => {
    const valueArray = Array.isArray(value) ? value : [];
    const isAlreadySelected = valueArray.includes(option.id);

    let newValues;
    if (isAlreadySelected) {
      newValues = valueArray.filter((id) => id !== option.id);
    } else {
      newValues = [...valueArray, option.id];
    }

    onChange(newValues);
    setSearchTerm('');
  };

  const handleRemoveParticipant = (participantId) => {
    const valueArray = Array.isArray(value) ? value : [];
    const newValues = valueArray.filter((id) => id !== participantId);
    onChange(newValues);
  };

  const handleSelect = (option) => {
    if (multipleSelect) {
      handleSelectMultiple(option);
    } else {
      handleSelectSingle(option);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(true);

    if (!multipleSelect && displayValue && val !== displayValue) {
      onChange('');
      setDisplayValue('');
      setSelectedParticipant(null);
      setSelectedDepartment('');
      if (showDepartment) onDepartmentChange?.('');
    }
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);
    onDepartmentChange?.(dept);
  };

  if (loading) return <Loading />;

  const valueArray = Array.isArray(value) ? value : [];
  const getDisplayValue = () => {
    if (multipleSelect) {
      return searchTerm;
    }
    return isOpen ? searchTerm : displayValue;
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Selected participants chips for multiple select */}
      {multipleSelect && selectedParticipants.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedParticipants.map((participant) => (
            <div
              key={participant.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              <span>{participant.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveParticipant(participant.id)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative" ref={wrapperRef}>
        <input
          type="text"
          className={`w-full px-4 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          value={getDisplayValue()}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || 'Search...'}
        />

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option) => {
              const isSelected =
                multipleSelect && valueArray.includes(option.id);

              return (
                <div
                  key={option.id}
                  className={`px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      {option.name}
                    </div>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Show department + community */}
                  {showDepartment && option.departments?.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {option.departments
                        .map((d) => `${d.departmentName} (${d.community})`)
                        .join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Single select department logic - only show when NOT multipleSelect */}
      {!multipleSelect && (
        <>
          {/* Dropdown only when userDept NOT allowed and participant has multiple depts */}
          {showDepartment &&
            selectedParticipant &&
            !allowedDepts.includes(userDept) &&
            selectedParticipant.departments.length > 1 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Department <span className="text-red-500">*</span>
                </label>

                <select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Department --</option>
                  {selectedParticipant.departments.map((dept, index) => (
                    <option key={index} value={dept.departmentName}>
                      {dept.departmentName} - {dept.community}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Auto-selected single department */}
          {showDepartment &&
            selectedParticipant &&
            selectedParticipant.departments.length === 1 && (
              <div className="mt-2 text-sm text-gray-600">
                Department:{' '}
                <span className="font-medium">
                  {selectedParticipant.departments[0].departmentName}
                </span>{' '}
                (
                <span className="text-gray-500">
                  {selectedParticipant.departments[0].community}
                </span>
                )
              </div>
            )}

          {/* Auto-selected allowed dept (Support Coordination | Plan Management | Recovery Coaching) */}
          {showDepartment &&
            selectedParticipant &&
            allowedDepts.includes(userDept) &&
            selectedDepartment && (
              <div className="mt-2 text-sm text-gray-600">
                Auto-selected:{' '}
                <span className="font-medium">{selectedDepartment}</span>
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default SearchableSelect;
