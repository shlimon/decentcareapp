import Loading from '@components/reusable/loading/Loading';
import useParticipantMedicationsQuery from '@hooks/useParticipantMedicationsQuery';
import React from 'react';
import { useNavigate, useParams } from 'react-router';

const getStatusStyles = (status) => {
  switch (status) {
    case 'scheduled':
      return {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        badgeBg: 'bg-white',
        badgeText: 'text-gray-800',
        badgeBorder: 'border-gray-300',
      };
    case 'completed':
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-700',
        badgeBorder: 'border-green-300',
      };
    case 'refused':
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-600',
        badgeBorder: 'border-red-300',
      };
    case 'not administered':
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

function MedicationCard({ medication, participantId }) {
  const navigate = useNavigate();
  const styles = getStatusStyles(medication.status);

  return (
    <div
      className={`${styles.bgColor} ${styles.borderColor} border rounded-lg p-3 mb-4`}
      onClick={() =>
        navigate(`/medication/${medication?.uid}/${participantId}`)
      }
    >
      <div className="text-left text-xs cursor-pointer">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="text-gray-900 text-sm font-semibold !px-0">
              {medication.medicationName}
            </div>
            <span className="text-gray-500">{medication.dosage}</span>
            {medication.prn && (
              <span className="px-2 py-1 font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-full">
                PRN
              </span>
            )}
          </div>
          <div
            className={`capitalize px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder}`}
          >
            {medication.status}
          </div>
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
    </div>
  );
}

function ParticipantMedication() {
  const { participantId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: loading } =
    useParticipantMedicationsQuery(participantId);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <div className="p-4">No data available</div>;
  }

  // No active medications
  if (!data.todayMedications || data.todayMedications.length === 0) {
    return (
      <div className="mt-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/forms/participant-medication')}
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
          onClick={() => navigate('/forms/participant-medication')}
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
            participantId={participantId}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(ParticipantMedication);
