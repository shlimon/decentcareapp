import React, { useState } from 'react';
import countries from '../../../data/countries.json';
import states from '../../../data/states.json';

const LocationPicker = ({ onStateSelect }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const countryStates = states.filter(
    (state) => state.country_name === selectedCountry
  );

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState('');
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    onStateSelect(e.target.value);
  };

  return (
    <div className={`locationPickerContainer`}>
      <select
        className={`inputField`}
        value={selectedCountry}
        onChange={handleCountryChange}
      >
        <option value="">Select Country</option>
        {countries.map((country, index) => (
          <option key={index} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>

      {selectedCountry && (
        <select
          className={`inputField`}
          value={selectedState}
          onChange={handleStateChange}
        >
          <option value="">Select State</option>
          {countryStates.map((state, index) => (
            <option key={index} value={state.name}>
              {state.name}
            </option>
          ))}
          {}
        </select>
      )}
    </div>
  );
};

export default LocationPicker;
