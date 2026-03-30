import axiosInstance from '@api/axiosInstance';
import Loading from '@components/reusable/loading/Loading';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetMyTimesheet from '@hooks/work-log/useGetMyTimesheet';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
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
  // Parse format: "YYYY-Www"
  const match = weekString.match(/(\d{4})-W(\d{2})/);
  if (!match) return new Date();

  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);

  // Jan 4 is always in week 1
  const jan4 = new Date(year, 0, 4);
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - jan4.getDay() + 1); // Monday of week 1

  // Calculate the Monday of the target week
  const targetMonday = new Date(monday);
  targetMonday.setDate(monday.getDate() + (week - 1) * 7);

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

  const queryClient = useQueryClient();

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

        <button
          onClick={() => changeWeek(1)}
          disabled={isNextWeekInFuture}
          className={isNextWeekInFuture ? 'cursor-not-allowed opacity-50' : ''}
        >
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
              {entries.map((entry) => {
                const isPerVisit = entry.quantity === 0;

                return (
                  <div
                    key={entry._id}
                    className="flex items-center justify-between rounded-lg px-4 py-1 text-sm bg-sky-50 border border-sky-200"
                  >
                    <span className="font-medium">{entry.linkType}</span>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sky-900">
                        {isPerVisit ? 'Per Visit' : `${entry.quantity} hrs`}
                      </span>

                      {!isPerVisit && isEditable && (
                        <button
                          onClick={() => {
                            setSelectedEntry(entry);
                            setEditModalOpen(true);
                          }}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
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
              onSubmit={async (hours) => {
                try {
                  const payload = { quantity: hours };
                  await axiosInstance.put(
                    `/timesheets/${selectedEntry._id}`,
                    payload,
                  );

                  queryClient.invalidateQueries(['my-timesheet', weekString]);
                  setEditModalOpen(false);
                  toast.success('Hours updated successfully!');
                } catch (err) {
                  console.error(err);
                  toast.error('Failed to update hours.');
                }
              }}
            />
          )
        }
      />
    </div>
  );
};

export default React.memo(WorkLog);
