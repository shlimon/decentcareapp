import { useLoadScript } from '@react-google-maps/api';
import { useState } from 'react';
import PlacesAutoComplete from './PlacesAutoComplete';

const GoogleMapSearchBox = ({
  label = 'Location',
  placeholder = 'Search for location',
}) => {
  const [libraries] = useState(['places']);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center rounded-full shadow-xl h-14 md:h-11 md:rounded-none md:pl-0 md:shadow-none">
        <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap text-dark-1 md:ml-3 xl:text-base">
          <p className="text-base font-bold text-left">Where</p>
          <div className="text-gray-700">
            <input
              type="text"
              placeholder="City,Location"
              className="bg-transparent outline-0 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between w-full gap-2 py-2 rounded-md">
      <div className="flex items-center justify-between w-full gap-2 rounded-md">
        <div className="flex items-center w-full mt-2 overflow-visible rounded-md md:mt-0 md:h-11 bg-red-300">
          <div className="relative flex-1 w-full overflow-visible text-sm transition select-none">
            <div className="flex items-center w-full overflow-visible bg-white">
              <div className="w-full text-sm text-ellipsis whitespace-nowrap text-dark-1 xl:text-base">
                <div className="w-full overflow-visible text-gray-700">
                  <PlacesAutoComplete
                    isLoaded={isLoaded}
                    label={label}
                    placeholder={placeholder}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapSearchBox;
