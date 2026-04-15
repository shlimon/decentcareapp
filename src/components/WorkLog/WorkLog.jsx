import Loading from '@components/reusable/loading/Loading';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetMyTimesheet from '@hooks/work-log/useGetMyTimesheet';
import { ChevronLeft, ChevronRight, PencilLine, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import WorkLogEditForm from './WorkLogEditForm';
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

const dateFromISOWeekString = (weekString) => {
  const match = weekString.match(/(\d{4})-W(\d{2})/);
  if (!match) return new Date();

  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);

  // ISO: week 1 is the week with Jan 4th
  const jan4 = new Date(Date.UTC(year, 0, 4));

  // Get Monday of week 1
  const dayOfWeek = jan4.getUTCDay() || 7; // Sunday → 7
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);

  // Add weeks
  const targetMonday = new Date(mondayWeek1);
  targetMonday.setUTCDate(mondayWeek1.getUTCDate() + (week - 1) * 7);

  return targetMonday;
};

/* ================= component ================= */

const WorkLog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize currentDate from URL parameter or use current week
  const weekParam = searchParams.get('week');
  const initialDate = weekParam ? dateFromISOWeekString(weekParam) : new Date();

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  /* ===== ISO Week String ===== */
  const weekString = useMemo(
    () => getISOWeekString(currentDate),
    [currentDate],
  );

  /* ===== Fetch Timesheet ===== */
  const { data, isLoading } = useGetMyTimesheet(weekString);

  const isEditable = data?.data?.isEditable ?? false;

  /* ===== Check if next week is in future ===== */
  const isNextWeekInFuture = useMemo(() => {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    const weekStart = startOfWeek(nextWeekDate);
    const today = startOfWeek(new Date());
    return weekStart > today;
  }, [currentDate]);

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
    setSearchParams({ week: getISOWeekString(d) });
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

  return (
    <div className="space-y-4 p-4 pb-8">
      {/* ================= Week Header ================= */}
      <div className="flex items-center justify-between border border-gray-500 rounded-xl px-4 py-4 bg-gray-200">
        <button onClick={() => changeWeek(-1)}>
          <ChevronLeft />
        </button>

        <h2 className="text-lg">{weekRange}</h2>

        <button
          onClick={() => changeWeek(1)}
          disabled={isNextWeekInFuture}
          className={isNextWeekInFuture ? 'cursor-not-allowed opacity-50' : ''}
        >
          <ChevronRight />
        </button>
      </div>

      {/* ================= Days ================= */}
      {isLoading ? (
        <Loading />
      ) : (
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
                  className={`flex items-center justify-between border border-gray-400 rounded-lg px-5 py-3
          ${!isEditable ? 'bg-gray-100 opacity-50' : ''}
          ${isToday ? 'border-blue-500 bg-blue-50' : ''}
          ${isPublicHoliday ? 'bg-red-50 border-red-300' : ''}
        `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={` rounded-md px-3 py-1 font-semibold ${isPublicHoliday ? 'bg-red-100/90' : 'bg-blue-100/80'}`}
                    >
                      {date.getDate()}
                    </div>

                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="font-medium">
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </span>

                      {isToday && (
                        <span className="text-xs text-blue-600 py-0.5 px-3 bg-blue-100 rounded-full">
                          Today
                        </span>
                      )}

                      {isPublicHoliday && holidayName && (
                        <span className="text-xs text-red-600 py-0.5 px-3 bg-red-100 rounded-full">
                          {holidayName}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={!isEditable}
                    onClick={() => handleAddLog(date)}
                    className={`border rounded-md p-1.5
            ${
              !isEditable
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-100'
            }
          `}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* ================= Entries (OUTSIDE BOX) ================= */}
                {entries.map((entry) => {
                  const isPerVisit = entry.quantity === 0;

                  return (
                    <div
                      key={entry._id}
                      className="flex items-center justify-between rounded-lg px-4 py-1 text-sm bg-sky-100"
                    >
                      <div>
                        <div className="font-medium">{entry.linkType}</div>
                        <div className="text-gray-600">{entry.description}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sky-900">
                          {isPerVisit
                            ? 'Per Visit'
                            : `${entry.quantity?.toFixed(2)} hrs`}
                        </span>

                        {!isPerVisit && isEditable && (
                          <button
                            onClick={() => {
                              setSelectedEntry(entry);
                              setEditModalOpen(true);
                            }}
                          >
                            <PencilLine className="text-gray-700" size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= Add Log Modal ================= */}
      <ModalWithContent
        padding={false}
        title="Work Log Entry"
        content={
          <WorkLogEntryForm
            week={weekString}
            date={selectedDate}
            workLogs={data?.data?.days}
            setShowModal={setShowModal}
            isPublicHoliday={selectedDayData?.isPublicHoliday}
            holidayName={selectedDayData?.holidayName}
          />
        }
        isOpen={showModal}
        setIsOpen={setShowModal}
        maxWidth="max-w-md"
      />

      {/* ================= Edit Hours Modal ================= */}
      <ModalWithContent
        padding={false}
        title="Edit Hours"
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        maxWidth="max-w-sm"
        content={
          selectedEntry && (
            <WorkLogEditForm
              defaultHours={selectedEntry.quantity}
              selectedEntry={selectedEntry}
              setEditModalOpen={setEditModalOpen}
              weekString={weekString}
            />
          )
        }
      />
    </div>
  );
};

export default React.memo(WorkLog);
