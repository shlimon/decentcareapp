import ParticipantMedication from '@components/Medication/ParticipantMedication';
import React from 'react';

const MedicationPage = () => {
  return (
    <div className="py-8 px-4 max-w-xl mx-auto">
      <ParticipantMedication />
    </div>
  );
};

export default React.memo(MedicationPage);
