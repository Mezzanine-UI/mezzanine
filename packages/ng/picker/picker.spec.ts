import { MznPickerTrigger } from './picker-trigger.component';
import { MznPickerTriggerWithSeparator } from './picker-trigger-with-separator.component';
import { MznRangePickerTrigger } from './range-picker-trigger.component';
import { MznFormattedInput } from './formatted-input.component';

// Family-level smoke spec — Picker has no single root component. It is a
// shared toolkit of trigger components reused by Date/Time/DateRange/etc.
// Pickers. Per-trigger behavior is exercised through consumer specs.
describe('Picker (family)', () => {
  it('should export MznPickerTrigger', () => {
    expect(MznPickerTrigger).toBeDefined();
  });

  it('should export MznPickerTriggerWithSeparator', () => {
    expect(MznPickerTriggerWithSeparator).toBeDefined();
  });

  it('should export MznRangePickerTrigger', () => {
    expect(MznRangePickerTrigger).toBeDefined();
  });

  it('should export MznFormattedInput', () => {
    expect(MznFormattedInput).toBeDefined();
  });
});
