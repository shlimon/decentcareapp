import React from 'react';
import TravelLog from '../../components/travel-log/TravelLog';

const TravelLogPage = () => {
  return (
    <div className="max-w-xl mx-auto">
      <TravelLog />
    </div>
  );
};

export default React.memo(TravelLogPage);
