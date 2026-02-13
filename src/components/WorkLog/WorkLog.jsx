import Loading from '@components/reusable/loading/Loading';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetMyTimesheet from '@hooks/work-log/useGetMyTimesheet';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import WorkLogEntryForm from './WorkLogEntryForm';

/* ================= helpers ================= */

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
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

const getISOWeekString = (date) => {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);

  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);

  const weekNumber =
    1 +
    Math.round(
      ((tempDate - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7,
    );

  const year = tempDate.getFullYear();
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
};

/* ================= component ================= */

const WorkLog = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);

  /* ===== ISO Week String ===== */
  const weekString = useMemo(
    () => getISOWeekString(currentDate),
    [currentDate],
  );

  /* ===== Fetch Timesheet ===== */
  const { data, isLoading } = useGetMyTimesheet(weekString);

  console.log(data);

  const isEditable = data?.data?.isEditable ?? false;

  /* ===== Generate Week Days ===== */
  const weekDays = useMemo(() => {
    if (data?.data?.days?.length) {
      return data.data.days.map((d) => new Date(d.date));
    }

    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [currentDate, data]);

  const weekRange = useMemo(
    () => formatRange(weekDays[0], weekDays[6]),
    [weekDays],
  );

  /* ========== actions ========== */

  const changeWeek = (offset) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offset * 7);
    setCurrentDate(d);
  };

  const handleAddLog = (date) => {
    if (!isEditable) return;

    const dayData = data?.data?.days?.find(
      (d) => new Date(d.date).toDateString() === date.toDateString(),
    );

    setSelectedDate(date);
    setSelectedDayData(dayData || null);
    setShowModal(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4 p-5 pb-8">
      {/* ================= Week Header ================= */}
      <div className="flex items-center justify-between border rounded-xl px-4 py-3 bg-gray-200">
        <button onClick={() => changeWeek(-1)}>
          <ChevronLeft />
        </button>

        <h2 className="font-semibold text-lg">{weekRange}</h2>

        <button onClick={() => changeWeek(1)}>
          <ChevronRight />
        </button>
      </div>

      {/* ================= Days ================= */}
      <div className="space-y-3.5">
        {weekDays.map((date) => {
          const dayData = data?.data?.days?.find(
            (d) => new Date(d.date).toDateString() === date.toDateString(),
          );

          const isToday = date.toDateString() === new Date().toDateString();
          const isPublicHoliday = dayData?.isPublicHoliday;
          const holidayName = dayData?.holidayName;
          const entries = dayData?.entries || [];

          return (
            <div key={date.toISOString()} className="space-y-1">
              {/* ================= Day Card ================= */}
              <div
                className={`flex items-center justify-between border rounded-xl px-4 py-1.5
          ${!isEditable ? 'bg-gray-100 opacity-50' : ''}
          ${isToday ? 'border-blue-500 bg-blue-50' : ''}
          ${isPublicHoliday ? 'bg-red-50 border-red-300' : ''}
        `}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-md px-3 py-1 font-semibold">
                    {date.getDate()}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>

                    {isToday && (
                      <span className="text-xs text-blue-600 font-semibold">
                        Today
                      </span>
                    )}

                    {isPublicHoliday && holidayName && (
                      <span className="text-xs text-red-600 font-semibold">
                        {holidayName}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  disabled={!isEditable}
                  onClick={() => handleAddLog(date)}
                  className={`border rounded-lg p-2
            ${
              !isEditable
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-100'
            }
          `}
                >
                  <Plus />
                </button>
              </div>

              {/* ================= Entries (OUTSIDE BOX) ================= */}
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between
                     rounded-lg px-4 py-1 text-sm
                     bg-sky-50 border border-sky-200"
                >
                  <span className="font-medium ">{entry.linkType}</span>

                  <span className="font-semibold text-sky-900">
                    {entry.workedHours} hrs
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ================= Modal ================= */}
      <ModalWithContent
        padding={false}
        title="Work Log Entry"
        content={
          <WorkLogEntryForm
            date={selectedDate}
            setShowModal={setShowModal}
            isPublicHoliday={selectedDayData?.isPublicHoliday}
            holidayName={selectedDayData?.holidayName}
          />
        }
        isOpen={showModal}
        setIsOpen={setShowModal}
        maxWidth="max-w-md"
      />
    </div>
  );
};

export default React.memo(WorkLog);
