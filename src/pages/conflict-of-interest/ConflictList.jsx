import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import StatusBadge from '@components/ui/StatusBadge';
import useGetMyConflictList from '@hooks/conflict/useGetMyConflictList';
import { formatDate } from '@utils/DateFormation';
import React, { useState } from 'react';
import ConflictOfInterestShow from './ConflictOfInterestShow';

const ConflictList = () => {
  const { data: conflictList, isLoading, error } = useGetMyConflictList();

  console.log(conflictList);

  const [showModal, setShowModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);

  const handleConflictClick = (conflict) => {
    setSelectedConflict(conflict);
    setShowModal(true);
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
      <div className="text-center py-10">
        <p className="text-red-600 font-medium">
          Failed to load Conflict of Interest reports
        </p>
      </div>
    );
  }

  if (!conflictList || conflictList.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">
          No Conflict of Interest reports found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conflictList.map((item) => (
        <div
          key={item._id}
          className="group border border-gray-200 bg-white p-5 rounded-xl
            hover:shadow-md hover:border-gray-300 transition-all duration-200"
          onClick={() => handleConflictClick(item)}
        >
          <div className="flex justify-between items-start">
            {/* Left Section */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-800">
                {item.conflictNumber}
              </p>
              <p className="text-sm text-gray-600">{item.conflictType}</p>

              <p className="text-xs text-gray-500">
                Date:{' '}
                <span className="font-medium">
                  {formatDate(item.occurDate)}
                </span>
              </p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end space-y-2">
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      ))}
      <ModalWithContent
        title="Conflict of Interest Details"
        isOpen={showModal}
        setIsOpen={setShowModal}
        maxWidth="max-w-2xl"
        padding={false}
        content={
          selectedConflict && (
            <ConflictOfInterestShow conflict={selectedConflict} />
          )
        }
      />
    </div>
  );
};

export default ConflictList;
