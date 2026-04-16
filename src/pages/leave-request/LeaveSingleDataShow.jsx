import { formatDate } from '@utils/DateFormation';
import React, { memo } from 'react';

const LeaveSingleDataShow = ({ selectedData }) => {
  if (!selectedData) return null;

  const statusStyles = {
    approved: { bg: '#C7DFFF', text: '#3086F3' },
    declined: { bg: '#FFECEC', text: '#FF5E5E' },
    pending: { bg: '#F3F4F6', text: '#374151' },
  };

  const style = statusStyles[selectedData.status] || statusStyles.pending;

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Leave Type</p>
          <p className="font-semibold text-gray-800">
            {selectedData.leaveType}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <span
            className="inline-block px-3 py-1 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {selectedData.status.charAt(0).toUpperCase() +
              selectedData.status.slice(1)}
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Start Date</p>
          <p className="font-semibold text-gray-800">
            {formatDate(selectedData.startDate)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">End Date</p>
          <p className="font-semibold text-gray-800">
            {formatDate(selectedData.endDate)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Hours</p>
          <p className="font-semibold text-gray-800">
            {selectedData.hours} hrs
          </p>
        </div>

        {selectedData.reviewer?.reviewedBy && (
          <>
            <div>
              <p className="text-sm text-gray-500 mb-1">Reviewed By</p>
              <p className="font-semibold text-gray-800">
                {selectedData.reviewer.reviewedBy.name}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Reviewed At</p>
              <p className="font-semibold text-gray-800">
                {formatDate(selectedData.reviewer.reviewedAt)}
              </p>
            </div>

            {selectedData.reviewer.reason && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Reason</p>
                <p className="font-semibold text-gray-800">
                  {selectedData.reviewer.reason}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(LeaveSingleDataShow);
