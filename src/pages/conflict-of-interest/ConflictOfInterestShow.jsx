import { formatDate } from '@utils/DateFormation';

const ConflictOfInterestShow = ({ conflict }) => {
  return (
    <div className="space-y-4">
      <Detail label="Conflict Number" value={conflict.conflictNumber} />
      <Detail label="Conflict Type" value={conflict.conflictType} />
      <Detail label="Status" value={conflict.status} />
      <Detail label="Prior Conflicts" value={conflict.priorConflicts} />
      <Detail label="Description" value={conflict.description} />
      <Detail label="Involvement" value={conflict.involvement} />
      <Detail label="Timing" value={conflict.timing} />

      {conflict.occurDate && (
        <Detail label="Occur Date" value={formatDate(conflict.occurDate)} />
      )}

      {conflict.staffRelations?.length > 0 && (
        <Section title="Staff Relations" data={conflict.staffRelations} />
      )}

      {conflict.staffParticipants?.length > 0 && (
        <Section title="Participants" data={conflict.staffParticipants} />
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium break-words">{value || '-'}</p>
  </div>
);

const Section = ({ title, data }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <ul className="list-disc list-inside space-y-1">
      {data.map((item) => (
        <li key={item._id}>{item.name}</li>
      ))}
    </ul>
  </div>
);

export default ConflictOfInterestShow;
