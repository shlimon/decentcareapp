import React from 'react';
import TravelLog from '../../components/travel-log/TravelLog';

const TravelLogPage = () => {
  return (
    <div className="detail-box-wrapper">
      <TravelLog />
    </div>
  );
};

export default React.memo(TravelLogPage);
