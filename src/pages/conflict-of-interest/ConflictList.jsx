import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import StatusBadge from '@components/ui/StatusBadge';
import useGetMyConflictList from '@hooks/conflict/useGetMyConflictList';
import { formatDate } from '@utils/DateFormation';
import React, { useState } from 'react';
import ConflictOfInterestShow from './ConflictOfInterestShow';

const ConflictList = () => {
  const { data: conflictList, isLoading, error } = useGetMyConflictList();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);

  const handleOpen = (conflict) => {
    setSelectedConflict(conflict);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        Failed to load Conflict of Interest reports
      </div>
    );
  }

  if (!conflictList?.length) {
    return (
      <div className="text-center py-10 text-gray-600">
        No Conflict of Interest reports found
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {conflictList.map((item) => (
          <div
            key={item._id}
            onClick={() => handleOpen(item)}
            className="cursor-pointer border border-gray-200 bg-white p-5 rounded-xl
                  hover:shadow-md hover:border-gray-300 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {item.conflictNumber}
                </p>

                <p className="text-sm text-gray-600">{item.conflictType}</p>

                {item.occurDate && (
                  <p className="text-xs text-gray-500">
                    Date:{' '}
                    <span className="font-medium">
                      {formatDate(item.occurDate)}
                    </span>
                  </p>
                )}
              </div>

              <StatusBadge status={item.status} />
            </div>
          </div>
        ))}
      </div>

      {/* FULL DETAILS MODAL */}
      <ModalWithContent
        title="Conflict of Interest Details"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        maxWidth="max-w-3xl"
        content={
          selectedConflict && (
            <ConflictOfInterestShow conflict={selectedConflict} />
          )
        }
      />
    </>
  );
};

export default ConflictList;
