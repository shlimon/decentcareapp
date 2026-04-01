import { Calendar, FileText, Info } from 'lucide-react';

const LeaveValidationCard = ({ data, hasInsufficientBalance }) => {
  if (!data) return null;

  const {
    canTakeLeave,
    needEvidence,
    leaveDays,
    leaveHours,
    publicHolidaysInLeave,
    reasons,
  } = data;

  return (
    <div className="bg-white rounded-xl shadow-md w-full overflow-hidden mb-10">
      {/* Header */}
      <div
        className={`flex items-center gap-2 text-white p-3 ${
          hasInsufficientBalance || !canTakeLeave
            ? 'bg-gradient-to-r from-red-400 to-red-500'
            : 'bg-gradient-to-r from-blue-400 to-indigo-500'
        }`}
      >
        <Info className="w-5 h-5" />
        <div>
          <h2 className="font-semibold text-base">
            {hasInsufficientBalance
              ? 'Insufficient sick leave balance'
              : !canTakeLeave
                ? 'Leave not available'
                : 'You can request for the leave'}
          </h2>
          <p className="text-white/90 text-sm">
            {hasInsufficientBalance
              ? 'Your available balance is lower than requested hours'
              : !canTakeLeave
                ? 'You are not eligible for this leave type'
                : 'Submit your leave request for approval'}
          </p>
        </div>
      </div>

      <div className="space-y-2 p-3">
        {/* Leave Summary */}
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-2 flex flex-col items-start">
            <div className="flex items-center gap-1 text-blue-700">
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-sm">Duration</span>
            </div>
            <p className="font-bold text-base text-blue-800">
              {leaveDays} {leaveDays === 1 ? 'day' : 'days'}
            </p>
          </div>

          <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-2 flex flex-col items-start">
            <div className="flex items-center gap-1 text-orange-700">
              <FileText className="w-4 h-4" />
              <span className="font-medium text-sm">Total Hours</span>
            </div>
            <p className="font-bold text-base text-orange-800">
              {leaveHours} hrs
            </p>
          </div>
        </div>

        {/* Evidence Requirement */}
        <div
          className={`border rounded-lg flex items-center gap-1 p-2 ${
            needEvidence
              ? 'bg-purple-50 border-purple-200 text-purple-700'
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}
        >
          <Info className="w-4 h-4" />
          <span className="text-sm">
            {needEvidence
              ? 'Supporting documentation required'
              : 'No evidence required'}
          </span>
        </div>

        {/* Public Holidays */}
        {publicHolidaysInLeave?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 space-y-1">
            {publicHolidaysInLeave.map((holiday, idx) => (
              <div
                key={idx}
                className="border border-amber-100 rounded-lg p-2 bg-white flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {holiday.name}
                  </p>
                  <p className="text-[12px] text-gray-600">
                    {new Date(holiday.start).toLocaleDateString('en-AU', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 rounded-full">
                  {holiday.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {reasons?.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 space-y-1">
            <h3 className="font-bold text-sm text-rose-900 flex items-center gap-1">
              <Info className="w-4 h-4" />
              Notes
            </h3>
            <ul className="text-[13px] text-rose-800 list-disc list-inside space-y-0.5">
              {reasons.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveValidationCard;
