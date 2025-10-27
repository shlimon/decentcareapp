import SearchableSelect from '@components/reusable/SearchableSelect';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const MedicationParticipantSelectionPage = () => {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedParticipant) {
      navigate(`/medication/${selectedParticipant}`);
    }
  }, [selectedParticipant, navigate]);

  return (
    <div className="py-8 px-4 max-w-xl mx-auto">
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
  );
};

export default React.memo(MedicationParticipantSelectionPage);
