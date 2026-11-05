import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { useState } from 'react';
import {
  act,
  cleanup,
  cleanupHook,
  fireEvent,
  render,
} from '../../__test-utils__';
import { CalendarConfigProvider } from '../Calendar';
import DateRangePicker from '.';

function ControlledDateRangePicker() {
  const [value, setValue] = useState<RangePickerValue | undefined>([
    moment('2026-08-01').toISOString(),
    moment('2027-02-28').toISOString(),
  ]);

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <DateRangePicker onChange={setValue} value={value} />
    </CalendarConfigProvider>
  );
}

describe('<DateRangePicker /> typing that reorders the range', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should keep the cursor on the next cell when the typed year swaps from and to', () => {
    const { container } = render(<ControlledDateRangePicker />);
    const from = container.querySelector('input') as HTMLInputElement;

    act(() => {
      from.focus();
    });
    from.setSelectionRange(0, 0);
    [...'2028'].forEach((key) => {
      fireEvent.keyDown(from, { key });
    });

    expect(from.value).toBe('2027-02-28');
    expect(from.selectionStart).toBe(5);
  });
});
