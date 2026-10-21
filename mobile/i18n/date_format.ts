// i18n/date_format.ts
import { TFunction } from "i18next";
import { DateFormat, DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT, isDateFormat } from "@/utils/date_formatter";

/**
 * Date format of the active language ("date.format" / "date.format_time" in the locales).
 * Falls back to the default format if a locale has no valid entry.
 */
export function localDateFormat(t: TFunction, withTime = false): DateFormat {
  const format = t(withTime ? "date.format_time" : "date.format");
  if (isDateFormat(format)) return format;
  return withTime ? DEFAULT_DATE_TIME_FORMAT : DEFAULT_DATE_FORMAT;
}

export type DatePart = "day" | "month" | "year";

/**
 * Order of day, month and year in the active language, derived from "date.format"
 * (e.g. ["year", "month", "day"] for "YYYY/MM/DD"). Used by the date picker and date view.
 */
export function localDateOrder(t: TFunction): DatePart[] {
  const format = localDateFormat(t);
  const positions: [DatePart, number][] = [
    ["day", format.indexOf("DD")],
    ["month", format.indexOf("MM")],
    ["year", format.indexOf("YYYY")],
  ];
  return positions.sort((a, b) => a[1] - b[1]).map(([part]) => part);
}
