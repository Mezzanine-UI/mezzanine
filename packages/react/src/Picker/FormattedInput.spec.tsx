import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useState } from 'react';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import { CalendarConfigProvider } from '../Calendar';
import FormattedInput from './FormattedInput';

interface ControlledInputProps {
  format: string;
  initialValue: string;
  onChange: (formatted: string) => void;
}

function ControlledInput({
  format,
  initialValue,
  onChange,
}: ControlledInputProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <FormattedInput
        format={format}
        onChange={(isoValue) => {
          const formatted = moment(isoValue).format(format);

          setValue(formatted);
          onChange(formatted);
        }}
        value={value}
      />
    </CalendarConfigProvider>
  );
}

function renderInput(format: string, initialValue: string) {
  const onChange = jest.fn();
  const { container } = render(
    <ControlledInput
      format={format}
      initialValue={initialValue}
      onChange={onChange}
    />,
  );
  const input = container.querySelector('input') as HTMLInputElement;

  return { input, onChange };
}

/** Focus the input and place the cursor (or a selection) like a user would. */
function placeCursor(input: HTMLInputElement, start: number, end = start) {
  act(() => {
    input.focus();
  });
  input.setSelectionRange(start, end);
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

describe('<FormattedInput /> typing over an existing value', () => {
  afterEach(cleanup);

  it('should accept months 10-12 over a month whose second digit is above 2', async () => {
    const { input, onChange } = renderInput('YYYY-MM', '2026-08');

    placeCursor(input, 0, input.value.length);
    await typeKeys(input, '2025-12');

    expect(input.value).toBe('2025-12');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([
      '2025-08',
      '2025-12',
    ]);
  });

  it('should accept months 01-09 over a month whose second digit is 0', async () => {
    const { input, onChange } = renderInput('YYYY-MM', '2026-10');

    placeCursor(input, 5);
    await typeKeys(input, '05');

    expect(input.value).toBe('2026-05');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['2026-05']);
  });

  it('should accept days 30-31 over a day whose second digit is above 1', async () => {
    const { input, onChange } = renderInput('YYYY-MM-DD', '2026-08-15');

    placeCursor(input, 8);
    await typeKeys(input, '31');

    expect(input.value).toBe('2026-08-31');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['2026-08-31']);
  });

  it('should accept hours 20-23 over an hour whose second digit is above 3', async () => {
    const { input, onChange } = renderInput('HH:mm', '15:30');

    placeCursor(input, 0);
    await typeKeys(input, '21');

    expect(input.value).toBe('21:30');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['21:30']);
  });

  it('should clear the rest of a cell when typing its first digit and not emit until the cell is complete', async () => {
    const { input, onChange } = renderInput('YYYY-MM', '2026-08');

    placeCursor(input, 5);
    await typeKeys(input, '1');

    expect(input.value).toBe('2026-1M');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should still block a completed cell that is out of range', async () => {
    const { input, onChange } = renderInput('YYYY-MM', '2026-08');

    placeCursor(input, 5);
    await typeKeys(input, '13');

    expect(input.value).toBe('2026-1M');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should still validate a digit typed into the middle of a filled cell', async () => {
    const { input, onChange } = renderInput('YYYY-MM-DD', '2026-08-15');

    placeCursor(input, 9);
    await typeKeys(input, '9');

    expect(input.value).toBe('2026-08-19');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['2026-08-19']);
  });

  it('should pad a first digit that no in-range value starts with (month 5 → 05)', async () => {
    const { input, onChange } = renderInput('YYYY-MM', '2026-08');

    placeCursor(input, 5);
    await typeKeys(input, '5');

    expect(input.value).toBe('2026-05');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['2026-05']);
  });

  it('should pad a first day digit above 3 and keep the rest of the value', async () => {
    const { input, onChange } = renderInput('YYYY-MM-DD', '2026-08-15');

    placeCursor(input, 8);
    await typeKeys(input, '7');

    expect(input.value).toBe('2026-08-07');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['2026-08-07']);
  });

  it('should pad a first hour digit above 2 and move on to the minutes', async () => {
    const { input, onChange } = renderInput('HH:mm', '15:30');

    placeCursor(input, 0);
    await typeKeys(input, '945');

    expect(input.value).toBe('09:45');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([
      '09:30',
      '09:45',
    ]);
  });

  it('should block a first year digit that cannot reach the minimum', async () => {
    const { input, onChange } = renderInput('YYYY-MM', '2026-08');

    placeCursor(input, 0);
    await typeKeys(input, '0');

    expect(input.value).toBe('2026-08');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([]);
  });

  it('should still emit a pasted ISO value even when it equals the current value', () => {
    const { input, onChange } = renderInput('YYYY-MM', '2026-08');

    fireEvent.paste(input, {
      clipboardData: { getData: () => moment('2026-08-10').toISOString() },
    });

    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['2026-08']);
  });

  it('should not emit when the typed value equals the current value', async () => {
    const { input, onChange } = renderInput('YYYY-MM', '2026-08');

    placeCursor(input, 0, input.value.length);
    await typeKeys(input, '2026-08');

    expect(input.value).toBe('2026-08');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('<FormattedInput /> keys arriving within one frame', () => {
  afterEach(cleanup);

  /** Press each key with no frame in between, like a scanner or key rollover. */
  function typeKeysBackToBack(input: HTMLInputElement, keys: string[]) {
    keys.forEach((key) => {
      fireEvent.keyDown(input, { key });
    });
  }

  it('should keep every digit typed over an existing value', () => {
    const { input, onChange } = renderInput('YYYY-MM-DD', '2025-08-15');

    placeCursor(input, 0, input.value.length);
    typeKeysBackToBack(input, [...'20260601']);

    expect(input.value).toBe('2026-06-01');
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([
      '2026-08-15',
      '2026-06-15',
      '2026-06-01',
    ]);
  });

  it('should clear consecutive positions on repeated Backspace', () => {
    const { input } = renderInput('YYYY-MM-DD', '2026-08-15');

    placeCursor(input, 10);
    typeKeysBackToBack(input, ['Backspace', 'Backspace', 'Backspace']);

    expect(input.value).toBe('2026-0M-DD');
  });

  it('should move the cursor when the typed digit leaves the value unchanged', () => {
    const { input, onChange } = renderInput('YYYY-MM-DD', '2026-05-15');

    placeCursor(input, 6);
    typeKeysBackToBack(input, ['5']);

    expect(input.selectionStart).toBe(8);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not put the cursor back after a paste replaces the value', () => {
    const { input } = renderInput('YYYY-MM-DD', '2026-08-15');

    placeCursor(input, 0);
    typeKeysBackToBack(input, ['2']);
    fireEvent.paste(input, {
      clipboardData: { getData: () => moment('2027-03-20').toISOString() },
    });

    expect(input.value).toBe('2027-03-20');
    expect(input.selectionStart).toBe(10);
  });

  it('should not put the cursor back when the value changes from outside', () => {
    const renderWith = (value: string) => (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <FormattedInput format="YYYY-MM-DD" value={value} />
      </CalendarConfigProvider>
    );
    const { container, rerender } = render(renderWith('2026-08-15'));
    const input = container.querySelector('input') as HTMLInputElement;

    placeCursor(input, 8);
    typeKeysBackToBack(input, ['2']);
    rerender(renderWith('2027-03-20'));

    expect(input.value).toBe('2027-03-20');
    expect(input.selectionStart).toBe(10);
  });
});
