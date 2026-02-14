import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import StatusBadge from '@components/ui/StatusBadge';
import useGetMyWhsList from '@hooks/whs/useGetMyWhsList';
import React, { useState } from 'react';
import WHSDetails from './WHSDetails';

const WHSList = () => {
  const { data: whsList, isLoading, error } = useGetMyWhsList();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedWHS, setSelectedWHS] = useState(null);

  const handleOpen = (item) => {
    setSelectedWHS(item);
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
        Failed to load WHS records
      </div>
    );
  }

  if (!whsList?.length) {
    return (
      <div className="text-center py-10 text-gray-600">
        No WHS reports found
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {whsList.map((item) => (
          <div
            key={item._id}
            onClick={() => handleOpen(item)}
            className="cursor-pointer border border-gray-200 bg-white p-5 rounded-xl
            hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {item.whsNumber}
                </p>
                <p className="text-sm text-gray-600">
                  {item.location?.city}, {item.location?.suburb}
                </p>
                <p className="text-xs text-gray-500">
                  Investigator:{' '}
                  <span className="font-medium">
                    {item.investigatorBy?.name || 'N/A'}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-end space-y-3">
                <StatusBadge status={item.status} />
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {item.eventType}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalWithContent
        title="WHS Report Details"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        maxWidth="max-w-4xl"
        content={selectedWHS && <WHSDetails whs={selectedWHS} />}
      />
    </>
  );
};

export default WHSList;
