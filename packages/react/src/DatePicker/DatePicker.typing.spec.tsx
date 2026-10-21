import moment from 'moment';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useState } from 'react';
import {
  act,
  cleanup,
  cleanupHook,
  fireEvent,
  render,
} from '../../__test-utils__';
import { CalendarConfigProvider } from '../Calendar';
import DatePicker from '.';

interface ControlledDatePickerProps {
  initialValue: DateType;
  onChange: (value?: DateType) => void;
}

function ControlledDatePicker({
  initialValue,
  onChange,
}: ControlledDatePickerProps) {
  const [value, setValue] = useState<DateType | undefined>(initialValue);

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <DatePicker
        mode="month"
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
        value={value}
      />
    </CalendarConfigProvider>
  );
}

/** Press each key in turn, letting the formatter restore the cursor in between. */
async function typeKeys(input: HTMLInputElement, keys: string) {
  for (const key of keys) {
    fireEvent.keyDown(input, { key });

    await act(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        }),
    );
  }
}

describe('<DatePicker /> typing over an existing value', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should commit once per completed cell that changes the value', async () => {
    const onChange = jest.fn();
    const { container } = render(
      <ControlledDatePicker
        initialValue={moment('2026-08-01').toISOString()}
        onChange={onChange}
      />,
    );
    const input = container.querySelector('input') as HTMLInputElement;

    act(() => {
      input.focus();
    });
    input.setSelectionRange(0, input.value.length);
    await typeKeys(input, '2025-12');

    expect(input.value).toBe('2025-12');
    expect(
      onChange.mock.calls.map(([value]) => moment(value).format('YYYY-MM')),
    ).toEqual(['2025-08', '2025-12']);
  });
});
