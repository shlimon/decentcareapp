import React from 'react';
import TravelLog from '../../components/travel-log/TravelLog';

const TravelLogPage = () => {
  return (
    <div>
      <TravelLog />
    </div>
  );
};

export default React.memo(TravelLogPage);
