import React from 'react';

const getStatusStyles = (status) => {
  switch (status) {
    case 'Scheduled':
      return {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        badgeBg: 'bg-white',
        badgeText: 'text-gray-800',
        badgeBorder: 'border-gray-300',
      };
    case 'Completed':
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-700',
        badgeBorder: 'border-green-300',
      };
    case 'Refused':
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-600',
        badgeBorder: 'border-red-300',
      };
    case 'Not Administered':
      return {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        badgeBg: 'bg-yellow-100',
        badgeText: 'text-yellow-700',
        badgeBorder: 'border-yellow-300',
      };
    default:
      return {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        badgeBg: 'bg-white',
        badgeText: 'text-gray-800',
        badgeBorder: 'border-gray-300',
      };
  }
};

function MedicationCard({ medication, setSelectedMedication }) {
  const styles = getStatusStyles(medication.status);

  return (
    <div
      className={`${styles.bgColor} ${styles.borderColor} border rounded-lg p-4 mb-4`}
      onClick={() => setSelectedMedication(medication?.uid)}
    >
      <div className="flex flex-wrap justify-between items-start text-xs gap-1">
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900 text-sm font-semibold !px-0">
              {medication.medicationName}
            </h3>
            <span className="text-gray-500">{medication.dosage}</span>
            {medication.prn && (
              <span className="px-2 py-1 font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-full">
                PRN
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-gray-600 mt-2">{medication.route}</div>
            <div
              className={`mb-1 ${
                medication?.time === 'As Required'
                  ? 'text-red-500'
                  : 'text-gray-700 '
              }`}
            >
              {medication.time}
            </div>
            {medication.actionTakenBy && (
              <div className="text-sm text-blue-600">
                {medication.actionTakenBy}
              </div>
            )}
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder}`}
        >
          {medication.status}
        </span>
      </div>
    </div>
  );
}

function ParticipantMedication({
  participantId,
  setSelectedMedication,
  setSelectedParticipant,
}) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // const API_BASE = 'https://dc-central-api-v2.onrender.com/api/app-data';
  const API_BASE = 'http://localhost:4000/api/app-data';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/medication-administrations/participant/${participantId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        // Handle empty data array (no active medications)
        if (Array.isArray(result.data) && result.data.length === 0) {
          setData({
            participantName: null,
            participantCommunity: null,
            dosesDueToday: 0,
            administeredToday: 0,
            todayMedications: [],
          });
          return;
        }

        // Transform API response to component format
        const transformedData = {
          participantName: result.data.participant.name,
          participantCommunity: result.data.participant.community,
          dosesDueToday: result.data.summary.dueDoses,
          administeredToday: result.data.summary.administered,
          todayMedications: result.data.medications.map((med) => ({
            uid: med.uid,
            medicationName: med.name,
            dosage: med.strength,
            route: med.route,
            prn: med.type === 'prn',
            status: med.status,
            time: med.scheduledTime || 'As Required',
            note: med.note,
            actionTakenBy: med.actionTakenBy,
          })),
        };

        setData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [participantId]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-4">No data available</div>;
  }

  // Check if there are no active medications
  if (!data.todayMedications || data.todayMedications.length === 0) {
    return (
      <div className="mt-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setSelectedParticipant(null)}
            className="px-3 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500 transition flex items-center gap-2"
          >
            ← Back To Participant
          </button>
        </div>

        {data.participantName && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-gray-900 font-semibold">
                {data.participantName}
              </h2>
              {data.participantCommunity && (
                <span className="text-gray-500 font-medium text-sm">
                  {data.participantCommunity}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">💊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Active Medications
          </h3>
          <p className="text-gray-600">
            There are no active medication records found for this participant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setSelectedParticipant(null)}
          className="px-3 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500 transition flex items-center gap-2"
        >
          ← Back To Participant
        </button>
      </div>

      {/* Header */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-900 font-semibold">
            {data.participantName}
          </h2>
          <span className="text-gray-500 font-medium text-sm">
            {data.participantCommunity}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-2 mb-6 text-white">
        <div className="bg-blue-600 rounded-2xl px-2 py-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">📋</div>
            <div className="space-y-4">
              <div className="text-xs">Doses Due Today</div>
              <div className="text-3xl font-bold flex justify-start">
                {data.dosesDueToday}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-green-600 rounded-2xl px-2 py-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">❤️</div>
            <div className="space-y-4">
              <div className="text-xs">Administered Today</div>
              <div className="text-3xl font-bold flex justify-start">
                {data.administeredToday}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medications List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Medications
        </h2>
        {data.todayMedications.map((medication, index) => (
          <MedicationCard
            key={index}
            medication={medication}
            setSelectedMedication={setSelectedMedication}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(ParticipantMedication);
