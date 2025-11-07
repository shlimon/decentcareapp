/** biome-ignore-all lint/a11y/useButtonType: <> */
/** biome-ignore-all lint/complexity/useOptionalChain: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */

import {
   addDays,
   addMonths,
   endOfMonth,
   endOfWeek,
   format,
   isAfter,
   isBefore,
   isSameDay,
   isSameMonth,
   startOfDay,
   startOfMonth,
   startOfWeek,
   subMonths,
} from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
   FaChevronDown as ChevronDown,
   FaChevronLeft as ChevronLeft,
   FaChevronRight as ChevronRight,
} from 'react-icons/fa';

const months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December',
];

export function CalendarPicker({
   selectedDate,
   onChange,
   isOpen,
   onClose,
   inputRef,
   baseInputRef,
   isEndTime = false,
   minDate,
   maxDate,
}) {
   const [currentDate, setCurrentDate] = useState(
      selectedDate ? new Date(selectedDate) : new Date()
   );
   const [internalSelectedDate, setInternalSelectedDate] = useState(
      selectedDate ? new Date(selectedDate) : null
   );

   const [mounted, setMounted] = useState(false);
   const [position, setPosition] = useState({ top: 0, left: 0 });
   const calendarRef = useRef(null);

   const [showMonthDropdown, setShowMonthDropdown] = useState(false);
   const [showYearDropdown, setShowYearDropdown] = useState(false);
   const monthDropdownRef = useRef(null);
   const yearDropdownRef = useRef(null);

   const today = new Date();

   // Parse min and max dates
   const parsedMinDate = minDate ? startOfDay(new Date(minDate)) : null;
   const parsedMaxDate = maxDate ? startOfDay(new Date(maxDate)) : null;

   useEffect(() => setMounted(true), []);

   // selectedDate prop
   useEffect(() => {
      if (selectedDate) {
         const parsedDate =
            typeof selectedDate === 'string' && !selectedDate.includes('T')
               ? (() => {
                    const [y, m, d] = selectedDate.split('-').map(Number);
                    return new Date(y, m - 1, d);
                 })()
               : new Date(selectedDate);

         setInternalSelectedDate(parsedDate);
         setCurrentDate(
            new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1)
         );
      } else {
         setInternalSelectedDate(null);
      }
   }, [selectedDate]);

   const formatDateForStorage = useCallback((date, useEndTime = false) => {
      if (!(date instanceof Date) || Number.isNaN(date)) return '';
      if (useEndTime) {
         const endOfDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            23,
            59,
            59,
            999
         );
         return endOfDay.toISOString();
      } else {
         const year = date.getFullYear();
         const month = String(date.getMonth() + 1).padStart(2, '0');
         const day = String(date.getDate()).padStart(2, '0');
         return `${year}-${month}-${day}`;
      }
   }, []);

   const adjustDate = useCallback((originalDate, year, month) => {
      const day = originalDate.getDate();
      const maxDay = new Date(year, month + 1, 0).getDate();
      return new Date(year, month, Math.min(day, maxDay));
   }, []);

   // Check if a date is disabled
   const isDateDisabled = useCallback(
      (date) => {
         const checkDate = startOfDay(new Date(date));
         if (parsedMinDate && isBefore(checkDate, parsedMinDate)) {
            return true;
         }
         if (parsedMaxDate && isAfter(checkDate, parsedMaxDate)) {
            return true;
         }
         return false;
      },
      [parsedMinDate, parsedMaxDate]
   );

   // Check if navigation should be disabled
   const canNavigateNext = useCallback(() => {
      if (!parsedMaxDate) return true;
      const nextMonth = addMonths(currentDate, 1);
      const firstDayOfNextMonth = startOfMonth(nextMonth);
      return !isAfter(startOfDay(firstDayOfNextMonth), parsedMaxDate);
   }, [currentDate, parsedMaxDate]);

   const canNavigatePrev = useCallback(() => {
      if (!parsedMinDate) return true;
      const prevMonth = subMonths(currentDate, 1);
      const lastDayOfPrevMonth = endOfMonth(prevMonth);
      return !isBefore(startOfDay(lastDayOfPrevMonth), parsedMinDate);
   }, [currentDate, parsedMinDate]);

   // Get available years for dropdown
   const getAvailableYears = useCallback(() => {
      const currentYear = new Date().getFullYear();
      let startYear = currentYear - 50;
      let endYear = currentYear + 50;

      if (parsedMinDate) {
         startYear = parsedMinDate.getFullYear();
      }
      if (parsedMaxDate) {
         endYear = parsedMaxDate.getFullYear();
      }

      // If no min/max date, use default range
      if (!parsedMinDate && !parsedMaxDate) {
         startYear = currentYear - 100;
         endYear = currentYear + 50;
      }

      return Array.from(
         { length: endYear - startYear + 1 },
         (_, i) => startYear + i
      );
   }, [parsedMinDate, parsedMaxDate]);

   // Check if month is available
   const isMonthAvailable = useCallback(
      (monthIdx) => {
         const year = currentDate.getFullYear();
         const firstDay = new Date(year, monthIdx, 1);
         const lastDay = endOfMonth(firstDay);

         if (parsedMinDate && isBefore(startOfDay(lastDay), parsedMinDate)) {
            return false;
         }
         if (parsedMaxDate && isAfter(startOfDay(firstDay), parsedMaxDate)) {
            return false;
         }
         return true;
      },
      [currentDate, parsedMinDate, parsedMaxDate]
   );

   // position calendar
   useEffect(() => {
      if (!isOpen || !baseInputRef?.current) return;

      const baseInputElement = baseInputRef.current;

      const calculatePosition = () => {
         if (!baseInputElement) return;

         const rect = baseInputElement.getBoundingClientRect();

         // calendar dimensions
         const CALENDAR_HEIGHT = 420;
         const CALENDAR_WIDTH = 320;
         const SPACING_GAP = 4;
         const VIEWPORT_MARGIN = 16;
         const ADDITIONAL_OFFSET = 28;

         // space calculations
         const spaceBelow = window.innerHeight - rect.bottom;
         const spaceAbove = rect.top;
         const spaceRight = window.innerWidth - rect.left;
         const spaceLeft = rect.left;

         let top, left;

         const requiredSpaceWithGap = CALENDAR_HEIGHT + SPACING_GAP;

         // vertical positioning
         if (spaceBelow >= requiredSpaceWithGap) {
            top = rect.bottom + window.scrollY + SPACING_GAP;
         } else if (spaceAbove >= requiredSpaceWithGap) {
            top =
               rect.top +
               window.scrollY -
               CALENDAR_HEIGHT -
               SPACING_GAP -
               ADDITIONAL_OFFSET;
         } else {
            if (spaceBelow >= spaceAbove) {
               top = Math.min(
                  rect.bottom + window.scrollY + SPACING_GAP,
                  window.innerHeight +
                     window.scrollY -
                     CALENDAR_HEIGHT -
                     VIEWPORT_MARGIN
               );
            } else {
               top = Math.max(
                  rect.top + window.scrollY - CALENDAR_HEIGHT - SPACING_GAP,
                  window.scrollY + VIEWPORT_MARGIN
               );
            }
         }

         // horizontal positioning
         if (spaceRight >= CALENDAR_WIDTH + VIEWPORT_MARGIN) {
            left = rect.left + window.scrollX;
         } else if (spaceLeft >= CALENDAR_WIDTH + VIEWPORT_MARGIN) {
            left = rect.right + window.scrollX - CALENDAR_WIDTH;
         } else {
            const viewportCenter = window.innerWidth / 2;
            left = Math.max(
               VIEWPORT_MARGIN + window.scrollX,
               Math.min(
                  viewportCenter + window.scrollX - CALENDAR_WIDTH / 2,
                  window.innerWidth +
                     window.scrollX -
                     CALENDAR_WIDTH -
                     VIEWPORT_MARGIN
               )
            );
         }

         left = Math.max(
            VIEWPORT_MARGIN + window.scrollX,
            Math.min(
               left,
               window.innerWidth +
                  window.scrollX -
                  CALENDAR_WIDTH -
                  VIEWPORT_MARGIN
            )
         );

         setPosition({ top: Math.round(top), left: Math.round(left) });
      };

      calculatePosition();

      let rafId = null;

      const handlePositionUpdate = () => {
         if (rafId) return;

         rafId = requestAnimationFrame(() => {
            calculatePosition();
            rafId = null;
         });
      };

      window.addEventListener('resize', handlePositionUpdate);
      window.addEventListener('scroll', handlePositionUpdate, {
         passive: true,
         capture: true,
      });

      if (window.screen?.orientation) {
         window.screen.orientation.addEventListener(
            'change',
            handlePositionUpdate
         );
      }

      return () => {
         if (rafId) {
            cancelAnimationFrame(rafId);
         }

         window.removeEventListener('resize', handlePositionUpdate);
         window.removeEventListener('scroll', handlePositionUpdate, {
            passive: true,
            capture: true,
         });

         if (window.screen?.orientation) {
            window.screen.orientation.removeEventListener(
               'change',
               handlePositionUpdate
            );
         }
      };
   }, [isOpen, baseInputRef]);

   // handle click outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            calendarRef.current &&
            !calendarRef.current.contains(event.target) &&
            inputRef?.current &&
            !inputRef.current.contains(event.target)
         ) {
            setShowMonthDropdown(false);
            setShowYearDropdown(false);
            onClose();
         }
      };
      if (isOpen) document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, [isOpen, onClose, inputRef]);

   // auto-scroll on dropdowns
   useEffect(() => {
      if (showMonthDropdown && monthDropdownRef.current) {
         const activeEl = monthDropdownRef.current.querySelector(
            "[data-active='true']"
         );
         if (activeEl)
            setTimeout(() => activeEl.scrollIntoView({ block: 'center' }), 0);
      }
   }, [showMonthDropdown]);

   useEffect(() => {
      if (showYearDropdown && yearDropdownRef.current) {
         const activeEl = yearDropdownRef.current.querySelector(
            "[data-active='true']"
         );
         if (activeEl)
            setTimeout(() => activeEl.scrollIntoView({ block: 'center' }), 0);
      }
   }, [showYearDropdown]);

   // change months
   const nextMonth = () => {
      if (canNavigateNext()) {
         setCurrentDate(addMonths(currentDate, 1));
      }
   };

   const prevMonth = () => {
      if (canNavigatePrev()) {
         setCurrentDate(subMonths(currentDate, 1));
      }
   };

   const handleDateClick = (day) => {
      if (isDateDisabled(day)) return;

      const cleanDate = new Date(
         day.getFullYear(),
         day.getMonth(),
         day.getDate()
      );
      setInternalSelectedDate(cleanDate);
      setCurrentDate(
         new Date(cleanDate.getFullYear(), cleanDate.getMonth(), 1)
      );

      const formatted = formatDateForStorage(cleanDate, isEndTime);
      onChange({ target: { value: formatted } });
      onClose();
   };

   // month and year change
   const handleMonthChange = (monthIdx) => {
      if (!isMonthAvailable(monthIdx)) return;

      const newDate = new Date(currentDate.getFullYear(), monthIdx, 1);
      setCurrentDate(newDate);
      if (internalSelectedDate) {
         const adjusted = adjustDate(
            internalSelectedDate,
            currentDate.getFullYear(),
            monthIdx
         );
         if (!isDateDisabled(adjusted)) {
            setInternalSelectedDate(adjusted);
            onChange({
               target: { value: formatDateForStorage(adjusted, isEndTime) },
            });
         }
      }
      setShowMonthDropdown(false);
   };

   const handleYearChange = (year) => {
      const newDate = new Date(year, currentDate.getMonth(), 1);
      setCurrentDate(newDate);
      if (internalSelectedDate) {
         const adjusted = adjustDate(
            internalSelectedDate,
            year,
            currentDate.getMonth()
         );
         if (!isDateDisabled(adjusted)) {
            setInternalSelectedDate(adjusted);
            onChange({
               target: { value: formatDateForStorage(adjusted, isEndTime) },
            });
         }
      }
      setShowYearDropdown(false);
   };

   const handleToday = () => {
      const todayDate = new Date();
      if (isDateDisabled(todayDate)) return;

      setInternalSelectedDate(todayDate);
      setCurrentDate(
         new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
      );
      onChange({
         target: { value: formatDateForStorage(todayDate, isEndTime) },
      });
      onClose();
   };

   // render header
   const renderHeader = () => (
      <div className="flex items-center justify-between mb-4">
         <button
            onClick={prevMonth}
            disabled={!canNavigatePrev()}
            className={`p-1.5 rounded-full ${
               canNavigatePrev()
                  ? 'hover:bg-gray-100 cursor-pointer'
                  : 'opacity-30 cursor-not-allowed'
            }`}
         >
            <ChevronLeft className="w-4 h-4" />
         </button>
         <div className="flex items-center space-x-2">
            <div className="relative">
               <button
                  onClick={(e) => {
                     e.stopPropagation();
                     setShowMonthDropdown(!showMonthDropdown);
                     setShowYearDropdown(false);
                  }}
                  className="flex items-center px-3 py-1.5 text-sm font-semibold text-gray-900 rounded-md hover:bg-gray-100"
               >
                  {format(currentDate, 'MMMM')}
                  <ChevronDown className="w-4 h-4 ml-1" />
               </button>
               {showMonthDropdown && (
                  <div
                     ref={monthDropdownRef}
                     className="absolute left-0 z-20 mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-48 min-w-[140px] hide-scrollbar"
                  >
                     {months.map((m, idx) => {
                        const available = isMonthAvailable(idx);
                        return (
                           <button
                              key={m}
                              type="button"
                              data-active={
                                 idx === currentDate.getMonth()
                                    ? 'true'
                                    : undefined
                              }
                              disabled={!available}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleMonthChange(idx);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                                 !available
                                    ? 'opacity-30 cursor-not-allowed'
                                    : idx === currentDate.getMonth()
                                    ? 'bg-primary/90 text-white font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100'
                              }`}
                           >
                              {m}
                           </button>
                        );
                     })}
                  </div>
               )}
            </div>

            <div className="relative">
               <button
                  onClick={(e) => {
                     e.stopPropagation();
                     setShowYearDropdown(!showYearDropdown);
                     setShowMonthDropdown(false);
                  }}
                  className="flex items-center px-3 py-1.5 text-sm font-semibold text-gray-900 rounded-md hover:bg-gray-100"
               >
                  {format(currentDate, 'yyyy')}
                  <ChevronDown className="w-4 h-4 ml-1" />
               </button>
               {showYearDropdown && (
                  <div
                     ref={yearDropdownRef}
                     className="absolute right-0 z-20 mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-48 min-w-[80px] hide-scrollbar"
                  >
                     {getAvailableYears().map((year) => (
                        <button
                           key={year}
                           type="button"
                           data-active={
                              year === currentDate.getFullYear()
                                 ? 'true'
                                 : undefined
                           }
                           onClick={(e) => {
                              e.stopPropagation();
                              handleYearChange(year);
                           }}
                           className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                              year === currentDate.getFullYear()
                                 ? 'bg-primary/90 text-white font-semibold'
                                 : 'text-gray-700 hover:bg-gray-100'
                           }`}
                        >
                           {year}
                        </button>
                     ))}
                  </div>
               )}
            </div>
         </div>
         <button
            onClick={nextMonth}
            disabled={!canNavigateNext()}
            className={`p-1.5 rounded-full ${
               canNavigateNext()
                  ? 'hover:bg-gray-100 cursor-pointer'
                  : 'opacity-30 cursor-not-allowed'
            }`}
         >
            <ChevronRight className="w-4 h-4" />
         </button>
      </div>
   );

   // render days
   const renderDays = () => {
      const days = [];
      const startDate = startOfWeek(startOfMonth(currentDate), {
         weekStartsOn: 0,
      });
      const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });

      let day = startDate;

      while (day <= endDate) {
         const isToday = isSameDay(day, today);
         const isSelected =
            internalSelectedDate &&
            day.getFullYear() === internalSelectedDate.getFullYear() &&
            day.getMonth() === internalSelectedDate.getMonth() &&
            day.getDate() === internalSelectedDate.getDate();
         const isCurrentMonth = isSameMonth(day, currentDate);
         const disabled = isDateDisabled(day);

         let dayClass =
            'p-2.5 text-sm text-center rounded-lg transition-all duration-200 ';

         if (disabled) {
            dayClass += 'text-gray-300 cursor-not-allowed opacity-40';
         } else if (!isCurrentMonth) {
            dayClass += 'text-gray-300 hover:text-gray-400 cursor-pointer';
         } else if (isSelected) {
            dayClass +=
               'bg-primary text-white font-semibold shadow-sm hover:bg-primary/90 cursor-pointer';
         } else if (isToday) {
            dayClass +=
               'bg-blue-50 text-blue-600 font-semibold border border-blue-200 hover:bg-blue-100 cursor-pointer';
         } else {
            dayClass +=
               'text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer';
         }

         const dayCopy = new Date(day.getTime());
         days.push(
            <div
               key={dayCopy.getTime()}
               onClick={() => !disabled && handleDateClick(dayCopy)}
               className={dayClass}
            >
               {format(dayCopy, 'd')}
            </div>
         );

         day = addDays(day, 1);
      }

      return <div className="grid grid-cols-7 gap-1">{days}</div>;
   };

   if (!isOpen || !mounted || (position.top === 0 && position.left === 0))
      return null;

   const isTodayDisabled = isDateDisabled(today);

   return createPortal(
      <div
         ref={calendarRef}
         className="absolute top-0 left-0 p-4 bg-white rounded-lg border border-gray-300 shadow-xl min-w-[320px] max-w-[320px] transition-all duration-200"
         style={{ top: position.top, left: position.left, zIndex: 9999 }}
      >
         {renderHeader()}

         <div className="grid grid-cols-7 mb-2 text-xs font-medium text-center text-gray-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
               <div key={d} className="py-2">
                  {d}
               </div>
            ))}
         </div>

         {renderDays()}

         <div className="pt-3 mt-4 border-t border-gray-200">
            <button
               type="button"
               onClick={handleToday}
               disabled={isTodayDisabled}
               className={`w-full px-3 py-2 text-sm font-medium text-center transition-colors rounded-md ${
                  isTodayDisabled
                     ? 'text-gray-400 cursor-not-allowed opacity-50'
                     : 'text-primary hover:text-primary hover:bg-primary/10 cursor-pointer'
               }`}
            >
               Today
            </button>
         </div>
      </div>,
      document.body
   );
}
