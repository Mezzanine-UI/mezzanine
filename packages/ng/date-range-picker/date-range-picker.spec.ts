import { MznDateRangePicker } from './date-range-picker.component';
import { MznDateRangePickerCalendar } from './date-range-picker-calendar.component';

// Smoke spec — DateRangePicker is a CVA wrapper around DateRangePickerCalendar.
// Detailed behavior covered indirectly via stories and core date-fns utils.
describe('DateRangePicker', () => {
  it('should export MznDateRangePicker', () => {
    expect(MznDateRangePicker).toBeDefined();
  });

  it('should export MznDateRangePickerCalendar', () => {
    expect(MznDateRangePickerCalendar).toBeDefined();
  });
});
