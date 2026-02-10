import Loading from '@components/reusable/loading/Loading';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetPayRate from '@hooks/work-log/useGetPayRate';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import WorkLogEntryForm from './WorkLogEntryForm';

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = day === 0 ? -6 : 1 - day; // Monday as start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatRange = (start, end) => {
  const opts = { day: '2-digit', month: 'short', year: '2-digit' };
  return `${start.toLocaleDateString('en-GB', opts).toUpperCase()} - ${end
    .toLocaleDateString('en-GB', opts)
    .toUpperCase()}`;
};

const WorkLog = () => {
  const { data, isLoading } = useGetPayRate();
  const payroll = data?.data?.payroll || {};
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const weekRange = useMemo(() => {
    return formatRange(weekDays[0], weekDays[6]);
  }, [weekDays]);

  const changeWeek = (offset) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offset * 7);
    setCurrentDate(d);
  };

  const handleAddLog = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4 p-5">
      {/* Week Header */}
      <div className="flex items-center justify-between border rounded-xl px-4 py-3 bg-gray-200">
        <button onClick={() => changeWeek(-1)}>
          <ChevronLeft />
        </button>

        <h2 className="font-semibold text-lg">{weekRange}</h2>

        <button onClick={() => changeWeek(1)}>
          <ChevronRight />
        </button>
      </div>

      {/* Days */}
      <div className="space-y-3">
        {weekDays.map((date) => (
          <div
            key={date.toISOString()}
            className="flex items-center justify-between border rounded-xl px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-md px-3 py-1 font-semibold">
                {date.getDate()}
              </div>
              <span className="font-medium">
                {date.toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
            </div>

            <button
              onClick={() => handleAddLog(date)}
              className="border rounded-lg p-2"
            >
              <Plus />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ModalWithContent
        padding={false}
        title="Work Log Entry"
        content={<WorkLogEntryForm date={selectedDate} payroll={payroll} />}
        isOpen={showModal}
        setIsOpen={setShowModal}
        maxWidth="max-w-md"
      />
    </div>
  );
};

export default React.memo(WorkLog);
