import { MznMultipleDatePicker } from './multiple-date-picker.component';
import { MznMultipleDatePickerTrigger } from './multiple-date-picker-trigger.component';

// Smoke spec — MultipleDatePicker is a CVA wrapper. Detailed behavior is
// covered through Storybook stories and shared date-fns utils.
describe('MultipleDatePicker', () => {
  it('should export MznMultipleDatePicker', () => {
    expect(MznMultipleDatePicker).toBeDefined();
  });

  it('should export MznMultipleDatePickerTrigger', () => {
    expect(MznMultipleDatePickerTrigger).toBeDefined();
  });
});
