import { MznDateTimePicker } from './date-time-picker.component';

// Smoke spec — DateTimePicker is a CVA wrapper combining DatePicker + TimePicker.
describe('DateTimePicker', () => {
  it('should export MznDateTimePicker', () => {
    expect(MznDateTimePicker).toBeDefined();
  });
});
