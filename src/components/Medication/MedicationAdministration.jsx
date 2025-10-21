import SearchableSelect from '@components/reusable/SearchableSelect';
import React, { useState } from 'react';
import Medication from './Medication';
import ParticipantMedication from './ParticipantMedication';

const MedicationAdministration = () => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);

  return (
    <div className="py-8 px-4 max-w-xl mx-auto">
      <div>
        {selectedParticipant ? (
          <div>
            {selectedMedication ? (
              <Medication
                medicationId={selectedMedication}
                participantId={selectedParticipant}
                setSelectedMedication={setSelectedMedication}
              />
            ) : (
              <ParticipantMedication
                setSelectedMedication={setSelectedMedication}
                participantId={selectedParticipant}
                setSelectedParticipant={setSelectedParticipant}
              />
            )}
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-8">
              Participant Details
            </h1>
            <SearchableSelect
              label="Select Participant"
              value={selectedParticipant}
              onChange={(value) => setSelectedParticipant(value)}
              placeholder="Participant Name"
              displayField="name"
              valueField="_id"
              extraField="community"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MedicationAdministration);
