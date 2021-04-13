import { DateType } from '../calendar';

/** Classes */
export const dateRangePickerPrefix = 'mzn-date-range-picker';
export const dateRangePickerCalendarGroupPrefix = `${dateRangePickerPrefix}-calendar-group`;
export const dateRangePickerCalendarPrefix = `${dateRangePickerPrefix}-calendar`;

export const dateRangePickerClasses = {
  host: dateRangePickerPrefix,
  arrowIcon: `${dateRangePickerPrefix}__arrow-icon`,

  /** Calendar Group */
  calendarGroup: dateRangePickerCalendarGroupPrefix,

  /** Calendar */
  calendar: dateRangePickerCalendarPrefix,
  calendarInactive: `${dateRangePickerCalendarPrefix}--inactive`,
};

/** Types */
export type DateRangePickerValue = undefined[] | [DateType, DateType];
export type DateRangePickerPickingValue =
 | DateRangePickerValue
 | [DateType]
 | [undefined, DateType]
 | [DateType, undefined];
