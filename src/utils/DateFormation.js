import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  parse,
  parseISO,
} from 'date-fns';

export function formatDate(date) {
  if (!date) {
    return '';
  }
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', // "Jan"
    day: 'numeric', // "4"
    year: 'numeric', // "2025"
  });
}

// Function to format date to YYYY-MM-DD
export function formatFormDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// function to calculate the difference between two dates
export const calculateDaysDifference = (dateResolved, dateIdentified) => {
  // Parse the dates into Date objects
  const resolvedDate = new Date(dateResolved);
  const identifiedDate = new Date(dateIdentified);

  // Calculate the difference in milliseconds
  const differenceInMs = resolvedDate - identifiedDate;

  // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return `${differenceInDays} days`;
};

export const convertTo12HourWithDateFns = (time24) => {
  try {
    // Parse the 24-hour time string into a Date object
    const date = parse(time24, 'HH:mm', new Date());

    // Format it to 12-hour format
    return format(date, 'h:mm a');
  } catch (error) {
    throw new Error(`Invalid time format: ${time24}. Expected format: HH:mm`);
  }
};

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateWithDaySuffix(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();

  const suffix =
    day === 1 || day === 21 || day === 31
      ? 'st'
      : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
          ? 'rd'
          : 'th';

  return `${day}${suffix} ${month} ${year}`;
}

export const formatFriendlyDateTime = (dateValue) => {
  if (!dateValue) return 'N/A';

  const date = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;

  if (isNaN(date)) return 'N/A';

  const timePart = format(date, 'h:mm a'); // e.g., "1:44 PM"

  if (isToday(date)) {
    return `Today, ${timePart}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow, ${timePart}`;
  }

  if (isYesterday(date)) {
    return `Yesterday, ${timePart}`;
  }

  // fallback for any other date
  return format(date, 'EEE, MMM d, h:mm a'); // e.g., "Fri, Oct 11, 1:44 PM"
};
