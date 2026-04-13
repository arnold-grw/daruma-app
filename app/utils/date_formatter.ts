// Date format types
export type DateFormat = 
  | 'DD.MM.YYYY HH:mm'      // 13.04.2026 18:23
  | 'DD.MM.YYYY'             // 13.04.2026
  | 'YYYY-MM-DD HH:mm'       // 2026-04-13 18:23
  | 'YYYY-MM-DD'             // 2026-04-13
  | 'YYYY.MM.DD HH:mm'       // 2026.04.13 18:23
  | 'YYYY.MM.DD'             // 2026.04.13
  | 'MM/DD/YYYY HH:mm'       // 04/13/2026 18:23
  | 'MM/DD/YYYY'             // 04/13/2026
  | 'DD/MM/YYYY HH:mm'       // 13/04/2026 18:23
  | 'DD/MM/YYYY'             // 13/04/2026
  | 'YYYY-MM-DD HH:mm:ss';   // 2026-04-13 18:23:45 (ISO format)

export const DEFAULT_DATE_FORMAT: DateFormat = 'DD.MM.YYYY HH:mm';

/**
 * Format an ISO date string to a specified format
 * @param isoDateString - ISO 8601 date string
 * @param format - Format pattern to use
 * @returns Formatted date string
 */
export function formatDate(
  isoDateString: string,
  format: DateFormat = DEFAULT_DATE_FORMAT
): string {
  try {
    const date = new Date(isoDateString);
    
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
    { format: 'MM/DD/YYYY HH:mm', description: 'US format with time', example: formatDate(exampleDate.toISOString(), 'MM/DD/YYYY HH:mm') },
    { format: 'MM/DD/YYYY', description: 'US date only', example: formatDate(exampleDate.toISOString(), 'MM/DD/YYYY') },
    { format: 'DD/MM/YYYY HH:mm', description: 'Slash European with time', example: formatDate(exampleDate.toISOString(), 'DD/MM/YYYY HH:mm') },
    { format: 'DD/MM/YYYY', description: 'Slash European date only', example: formatDate(exampleDate.toISOString(), 'DD/MM/YYYY') },
    { format: 'YYYY-MM-DD HH:mm:ss', description: 'ISO with seconds', example: formatDate(exampleDate.toISOString(), 'YYYY-MM-DD HH:mm:ss') },
  ];
}
