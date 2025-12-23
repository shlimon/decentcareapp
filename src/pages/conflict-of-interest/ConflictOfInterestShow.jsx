import { formatDate } from '@utils/DateFormation';
import React, { memo } from 'react';

const ConflictOfInterestShow = ({ conflict }) => {
  if (!conflict) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        No conflict data available
      </div>
    );
  }

  const {
    conflictNumber,
    conflictType,
    status,
    priorConflicts,
    description,
    involvement,
    timing,
    occurDate,
    staffRelations = [],
    staffParticipants = [],
    followupAction,
    reviewedBy,
    createdAt,
    updatedAt,
    conflictRaiser,
  } = conflict;

  return (
    <div className="max-h-[75vh] overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
            {conflictNumber}
          </span>

          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              status === 'Not started'
                ? 'bg-yellow-100 text-yellow-700'
                : status === 'In Progress'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {status}
          </span>
        </div>

        <h2 className="text-base font-semibold text-gray-900 leading-snug">
          {conflictType}
        </h2>

        {priorConflicts > 0 && (
          <p className="mt-1 text-xs text-orange-600">
            {priorConflicts} prior conflict(s) reported
          </p>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-5">
        {/* Raised By */}
        {conflictRaiser && (
          <Card title="Raised by">
            <Item label="Name" value={conflictRaiser.name} />
            <Item label="Email" value={conflictRaiser.email} />
            <Item label="Department" value={conflictRaiser.department} />
          </Card>
        )}

        <Card title="Description">
          <p className="text-sm text-gray-700 leading-relaxed">
            {description || '—'}
          </p>
        </Card>

        <Card title="Involvement">
          <p className="text-sm text-gray-700 leading-relaxed">
            {involvement || '—'}
          </p>
        </Card>

        <Card title="Timing">
          <div className="grid grid-cols-2 gap-4">
            <Item label="Type" value={timing} />
            <Item label="Date" value={formatDate(occurDate)} />
          </div>
        </Card>

        {staffRelations.length > 0 && (
          <Card title={`Staff relations (${staffRelations.length})`}>
            {staffRelations.map((s, i) => (
              <MiniPerson key={i} data={s} />
            ))}
          </Card>
        )}

        {staffParticipants.length > 0 && (
          <Card title={`Participants (${staffParticipants.length})`}>
            {staffParticipants.map((p, i) => (
              <MiniPerson key={i} data={p} />
            ))}
          </Card>
        )}

        <Card title="Follow-up required">
          <p
            className={`text-sm font-medium ${
              followupAction ? 'text-green-700' : 'text-gray-600'
            }`}
          >
            {followupAction ? 'Yes' : 'No'}
          </p>
        </Card>

        <Card title="Reviewed by">
          <p className="text-sm text-gray-700">
            {reviewedBy || 'Not yet reviewed'}
          </p>
        </Card>

        <div className="pt-2 text-xs text-gray-400 space-y-1">
          <p>Created: {formatDate(createdAt)}</p>
          <p>Updated: {formatDate(updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

/* ---------------- UI Helpers ---------------- */

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
      {title}
    </p>
    {children}
  </div>
);

const Item = ({ label, value }) => (
  <div className="text-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || '—'}</p>
  </div>
);

const MiniPerson = ({ data }) => (
  <div className="py-2">
    <p className="text-sm font-medium text-gray-800">{data.name}</p>
    <p className="text-xs text-gray-500">{data.email}</p>
    <p className="text-xs text-gray-500">{data.department}</p>
  </div>
);

export default memo(ConflictOfInterestShow);
