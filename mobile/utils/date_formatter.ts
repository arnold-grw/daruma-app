// Supported date formats (examples for 13.04.2026 18:23:45)
export const DATE_FORMATS = [
  'DD.MM.YYYY HH:mm',      // 13.04.2026 18:23
  'DD.MM.YYYY',            // 13.04.2026
  'YYYY-MM-DD HH:mm',      // 2026-04-13 18:23
  'YYYY-MM-DD',            // 2026-04-13
  'YYYY.MM.DD HH:mm',      // 2026.04.13 18:23
  'YYYY.MM.DD',            // 2026.04.13
  'YYYY/MM/DD HH:mm',      // 2026/04/13 18:23 (ja, zh)
  'YYYY/MM/DD',            // 2026/04/13 (ja, zh)
  'MM/DD/YYYY HH:mm',      // 04/13/2026 18:23
  'MM/DD/YYYY',            // 04/13/2026
  'DD/MM/YYYY HH:mm',      // 13/04/2026 18:23
  'DD/MM/YYYY',            // 13/04/2026
  'YYYY-MM-DD HH:mm:ss',   // 2026-04-13 18:23:45 (ISO format)
] as const;

export type DateFormat = typeof DATE_FORMATS[number];

export function isDateFormat(value: string): value is DateFormat {
  return (DATE_FORMATS as readonly string[]).includes(value);
}

export const DEFAULT_DATE_TIME_FORMAT: DateFormat = 'DD.MM.YYYY HH:mm';

export const DEFAULT_DATE_FORMAT: DateFormat = 'DD.MM.YYYY';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse an ISO string. Date-only strings ("YYYY-MM-DD") are read as local midnight
 * (new Date() would read them as UTC midnight, which can shift the day).
 */
export function parseDate(value: string): Date {
  if (DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

/**
 * Local calendar date as "YYYY-MM-DD". Deadlines are stored in this format.
 */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Last moment (local time) of the deadline's day: the deadline day itself still counts.
 * Also works for older deadlines that were stored as full ISO timestamps.
 */
export function getDeadlineEnd(deadline: string): Date {
  const date = parseDate(deadline);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function isDeadlinePassed(deadline: string, now: Date = new Date()): boolean {
  return getDeadlineEnd(deadline).getTime() < now.getTime();
}

/**
 * Calendar days from today until the deadline day (0 = the deadline is today).
 */
export function getDaysUntilDeadline(deadline: string, now: Date = new Date()): number {
  const date = parseDate(deadline);
  const deadlineDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // round instead of floor: days around a DST switch are 23 or 25 hours long
  return Math.round((deadlineDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format an ISO date string to a specified format
 * @param isoDateString - ISO 8601 date string
 * @param format - Format pattern to use
 * @returns Formatted date string
 */
export function formatDate(
  isoDateString: string,
  format: DateFormat = DEFAULT_DATE_TIME_FORMAT
): string {
  try {
    const date = parseDate(isoDateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    switch (format) {
      case 'DD.MM.YYYY HH:mm':
        return `${day}.${month}.${year} ${hours}:${minutes}`;
      case 'DD.MM.YYYY':
        return `${day}.${month}.${year}`;
      case 'YYYY-MM-DD HH:mm':
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'YYYY.MM.DD HH:mm':
        return `${year}.${month}.${day} ${hours}:${minutes}`;
      case 'YYYY.MM.DD':
        return `${year}.${month}.${day}`;
      case 'YYYY/MM/DD HH:mm':
        return `${year}/${month}/${day} ${hours}:${minutes}`;
      case 'YYYY/MM/DD':
        return `${year}/${month}/${day}`;
      case 'MM/DD/YYYY HH:mm':
        return `${month}/${day}/${year} ${hours}:${minutes}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY HH:mm':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD HH:mm:ss':
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      default:
        return isoDateString;
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Get all available date formats with their descriptions
 */
export function getAvailableDateFormats(): Array<{ format: DateFormat; description: string; example: string }> {
  const exampleDate = new Date('2026-04-13T18:23:45.000Z');
  
  return [
    { format: 'DD.MM.YYYY HH:mm', description: 'European with time', example: formatDate(exampleDate.toISOString(), 'DD.MM.YYYY HH:mm') },
    { format: 'DD.MM.YYYY', description: 'European date only', example: formatDate(exampleDate.toISOString(), 'DD.MM.YYYY') },
    { format: 'YYYY-MM-DD HH:mm', description: 'ISO with time', example: formatDate(exampleDate.toISOString(), 'YYYY-MM-DD HH:mm') },
    { format: 'YYYY-MM-DD', description: 'ISO date only', example: formatDate(exampleDate.toISOString(), 'YYYY-MM-DD') },
    { format: 'YYYY.MM.DD HH:mm', description: 'ISO dots with time', example: formatDate(exampleDate.toISOString(), 'YYYY.MM.DD HH:mm') },
    { format: 'YYYY.MM.DD', description: 'ISO dots date only', example: formatDate(exampleDate.toISOString(), 'YYYY.MM.DD') },
    { format: 'YYYY/MM/DD HH:mm', description: 'East Asian with time', example: formatDate(exampleDate.toISOString(), 'YYYY/MM/DD HH:mm') },
    { format: 'YYYY/MM/DD', description: 'East Asian date only', example: formatDate(exampleDate.toISOString(), 'YYYY/MM/DD') },
    { format: 'MM/DD/YYYY HH:mm', description: 'US format with time', example: formatDate(exampleDate.toISOString(), 'MM/DD/YYYY HH:mm') },
    { format: 'MM/DD/YYYY', description: 'US date only', example: formatDate(exampleDate.toISOString(), 'MM/DD/YYYY') },
    { format: 'DD/MM/YYYY HH:mm', description: 'Slash European with time', example: formatDate(exampleDate.toISOString(), 'DD/MM/YYYY HH:mm') },
    { format: 'DD/MM/YYYY', description: 'Slash European date only', example: formatDate(exampleDate.toISOString(), 'DD/MM/YYYY') },
    { format: 'YYYY-MM-DD HH:mm:ss', description: 'ISO with seconds', example: formatDate(exampleDate.toISOString(), 'YYYY-MM-DD HH:mm:ss') },
  ];
}

export function getDaysBetweenDates(startDate: Date, endDate: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInMs = endDate.getTime() - startDate.getTime();
  return Math.floor(diffInMs / oneDay);
}

export function getTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
