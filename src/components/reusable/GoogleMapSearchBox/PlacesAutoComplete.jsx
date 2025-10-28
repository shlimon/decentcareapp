import { Combobox } from '@headlessui/react';
import { Fragment } from 'react';
import { useFormContext } from 'react-hook-form';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

const PlacesAutoComplete = ({ isLoaded, placeholder, label }) => {
  const {
    ready,
    value,
    setValue: setAutoCompleteValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const { setValue } = useFormContext();

  const handleOnChange = (val) => {
    setAutoCompleteValue(val);
  };

  const findDataByType = (address_components, type) =>
    address_components.find((result) => result?.types?.includes(type));

  const getLocationFormattedData = (locationResponse) => {
    const addresses = locationResponse?.address_components;
    const fullAddress = locationResponse?.formatted_address;
    const streetNo = findDataByType(addresses, 'street_number')?.short_name;
    const routeName = findDataByType(addresses, 'route')?.short_name;
    const subPremise = findDataByType(addresses, 'subpremise')?.long_name;

    // Build street address including unit/subpremise if available
    let street = '';
    if (subPremise && streetNo && routeName) {
      street = `${subPremise}/${streetNo} ${routeName}`;
    } else if (streetNo && routeName) {
      street = `${streetNo} ${routeName}`;
    } else {
      street = fullAddress?.split(',')?.[0];
    }

    return {
      fullAddress,
      street,
      suburb: findDataByType(addresses, 'locality')?.long_name,
      postcode: findDataByType(addresses, 'postal_code')?.long_name,
      city: findDataByType(addresses, 'locality')?.long_name,
      state: findDataByType(addresses, 'administrative_area_level_1')
        ?.long_name,
      country: findDataByType(addresses, 'country')?.long_name,
      locationResponse,
    };
  };

  const handleSelect = async (address) => {
    setAutoCompleteValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { fullAddress, street, suburb, postcode, city, state, country } =
        getLocationFormattedData(results[0]);

      const { lat, lng } = await getLatLng(results[0]);

      setValue('fullAddress', fullAddress);
      setValue('street', street);
      setValue('suburb', suburb);
      setValue('state', state);
      setValue('postCode', postcode);
      setValue('city', city);
      setValue('country', country);
      setValue('lat', lat);
      setValue('lng', lng);
    } catch (error) {
      console.error('Error processing location:', error);
    }
  };

  return (
    <div className="relative w-full">
      <Combobox
        value={value}
        onChange={handleSelect}
        disabled={!ready || !isLoaded}
      >
        <div className="relative w-full">
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {label} <span className="text-red-500">*</span>
            </label>
            <Combobox.Input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-transparent outline-none placeholder:text-gray-400 focus:border-blue-500 transition-colors"
              onChange={(e) => handleOnChange(e.target.value)}
              placeholder={placeholder}
              displayValue={(address) => address}
            />
          </div>
          {status === 'OK' && (
            <Combobox.Options className="absolute z-[9999] mt-1 w-full bg-white border border-gray-400 shadow-lg rounded max-h-60 overflow-auto">
              {data.map(({ place_id, description }) => (
                <Combobox.Option
                  key={place_id}
                  value={description}
                  as={Fragment}
                >
                  {({ active }) => (
                    <li
                      className={`px-4 py-2 cursor-pointer ${
                        active ? 'bg-gray-100' : ''
                      }`}
                    >
                      {description}
                    </li>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
};

export default PlacesAutoComplete;
