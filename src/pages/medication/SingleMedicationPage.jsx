import Medication from '@components/Medication/Medication';
import React from 'react';

const SingleMedicationPage = () => {
  return (
    <div className="py-8 px-4 max-w-xl mx-auto">
      <Medication />
    </div>
  );
};

export default React.memo(SingleMedicationPage);
