import Loading from '@components/reusable/loading/Loading';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetPayRate from '@hooks/work-log/useGetPayRate';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import WorkLogEntryForm from './WorkLogEntryForm';

/* ================= helpers ================= */

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = day === 0 ? -6 : 1 - day; // Monday start
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

/* ================= component ================= */

const WorkLog = () => {
  const { data, isLoading } = useGetPayRate();
  const payroll = data?.data?.payroll || {};

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(23, 59, 59, 999);
    return t;
  }, []);

  const startOfCurrentWeek = useMemo(() => startOfWeek(new Date()), []);

  const startOfPreviousWeek = useMemo(() => {
    const prev = new Date(startOfCurrentWeek);
    prev.setDate(prev.getDate() - 7);
    return prev;
  }, [startOfCurrentWeek]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const weekRange = useMemo(
    () => formatRange(weekDays[0], weekDays[6]),
    [weekDays],
  );

  const isCurrentWeek =
    startOfWeek(currentDate).getTime() === startOfCurrentWeek.getTime();

  /* ========== actions ========== */

  const changeWeek = (offset) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offset * 7);

    // ❌ block future weeks
    if (startOfWeek(d) > startOfCurrentWeek) return;

    setCurrentDate(d);
  };

  const handleAddLog = (date) => {
    // ❌ block future dates
    if (date > today) return;

    // ❌ only allow current week or previous week
    const startWeekOfDate = startOfWeek(date).getTime();
    const currentWeekTime = startOfCurrentWeek.getTime();
    const prevWeekTime = startOfPreviousWeek.getTime();

    if (
      startWeekOfDate !== currentWeekTime &&
      startWeekOfDate !== prevWeekTime
    ) {
      return;
    }

    setSelectedDate(date);
    setShowModal(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4 p-5">
      {/* ================= Week Header ================= */}
      <div className="flex items-center justify-between border rounded-xl px-4 py-3 bg-gray-200">
        <button onClick={() => changeWeek(-1)}>
          <ChevronLeft />
        </button>

        <h2 className="font-semibold text-lg">{weekRange}</h2>

        <button
          onClick={() => changeWeek(1)}
          disabled={isCurrentWeek}
          className={isCurrentWeek ? 'opacity-40 cursor-not-allowed' : ''}
        >
          <ChevronRight />
        </button>
      </div>

      {/* ================= Days ================= */}
      <div className="space-y-3">
        {weekDays.map((date) => {
          const isFuture = date > today;
          const isToday = date.toDateString() === new Date().toDateString();

          // ❌ disable all except current & previous week
          const startWeekTime = startOfWeek(date).getTime();
          const allowModal =
            startWeekTime === startOfCurrentWeek.getTime() ||
            startWeekTime === startOfPreviousWeek.getTime();

          return (
            <div
              key={date.toISOString()}
              className={`flex items-center justify-between border rounded-xl px-4 py-4
                ${isFuture || !allowModal ? 'bg-gray-100 opacity-50' : ''}
                ${isToday ? 'border-blue-500 bg-blue-50' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-md px-3 py-1 font-semibold">
                  {date.getDate()}
                </div>

                <div className="flex flex-col">
                  <span className="font-medium">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                  </span>
                  {isToday && (
                    <span className="text-xs text-blue-600 font-semibold">
                      Today
                    </span>
                  )}
                </div>
              </div>

              <button
                disabled={isFuture || !allowModal}
                onClick={() => handleAddLog(date)}
                className={`border rounded-lg p-2
                  ${
                    isFuture || !allowModal
                      ? 'cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }
                `}
              >
                <Plus />
              </button>
            </div>
          );
        })}
      </div>

      {/* ================= Modal ================= */}
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
