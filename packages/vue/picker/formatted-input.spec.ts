import { h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import MznFormattedInput from './formatted-input.vue';

function mountInput(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    attachTo: document.body,
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: {
      default: () => h(MznFormattedInput, { format: 'YYYY-MM-DD', ...props }),
    },
  });
}

const input = (wrapper: VueWrapper) => wrapper.get('input');

const segments = (wrapper: VueWrapper) =>
  wrapper
    .findAll(`.${classes.formattedInputSegment}`)
    .map((segment) => segment.text());

/** Types one digit through the mask, the way a keypress would. */
async function typeDigit(
  wrapper: VueWrapper,
  digit: string,
  selectionStart: number,
): Promise<void> {
  const element = input(wrapper).element as HTMLInputElement;

  element.setSelectionRange(selectionStart, selectionStart);
  await input(wrapper).trigger('keydown', { key: digit });
  await nextTick();
}

/** Mounts the input with a parent that commits every emitted value back. */
function mountControlled(format: string, initialValue: string) {
  const committed: string[] = [];
  const value = ref(initialValue);
  const wrapper = mount(MznCalendarConfigProvider, {
    attachTo: document.body,
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: {
      default: () =>
        h(MznFormattedInput, {
          format,
          onChange: (isoValue: string) => {
            const formatted = moment(isoValue).format(format);

            value.value = formatted;
            committed.push(formatted);
          },
          value: value.value,
        }),
    },
  });

  return { committed, wrapper };
}

/** Presses each key in turn, letting the formatter restore the cursor in between. */
async function typeKeys(wrapper: VueWrapper, keys: string): Promise<void> {
  for (const key of keys) {
    await input(wrapper).trigger('keydown', { key });
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
}

/** Focuses the input and places the cursor (or a selection) like a user would. */
async function placeCursor(
  wrapper: VueWrapper,
  start: number,
  end = start,
): Promise<void> {
  const element = input(wrapper).element as HTMLInputElement;

  element.focus();
  await nextTick();
  element.setSelectionRange(start, end);
}

describe('<MznFormattedInput />', () => {
  it('should render the format template as segments', () => {
    const wrapper = mountInput();

    expect(wrapper.find(`.${classes.formattedInput}`).exists()).toBe(true);
    expect(segments(wrapper).join('')).toBe('YYYY-MM-DD');
  });

  it('should hide the display and use the native placeholder when one is given', () => {
    const wrapper = mountInput({ placeholder: 'Pick a date' });

    expect(wrapper.find(`.${classes.formattedInputDisplay}`).exists()).toBe(
      false,
    );
    expect(input(wrapper).attributes('placeholder')).toBe('Pick a date');
  });

  it('should show the template as the placeholder while focused', async () => {
    const wrapper = mountInput({ placeholder: 'Pick a date' });

    await input(wrapper).trigger('focus');

    expect(input(wrapper).attributes('placeholder')).toBe('YYYY-MM-DD');
  });

  it('should render a hover preview instead of the placeholder', () => {
    const wrapper = mountInput({
      hoverValue: '2026-09-15',
      placeholder: 'Pick a date',
    });

    expect(segments(wrapper).join('')).toBe('2026-09-15');
    expect(input(wrapper).attributes('placeholder')).toBeUndefined();
    expect(
      wrapper.findAll(`.${classes.formattedInputSegmentFilled}`),
    ).toHaveLength(0);
  });

  it('should render an external value, marking filled segments', () => {
    const wrapper = mountInput({ value: '2026-09-15' });

    expect(segments(wrapper).join('')).toBe('2026-09-15');
    expect(
      wrapper.findAll(`.${classes.formattedInputSegmentFilled}`).length,
    ).toBeGreaterThan(0);
  });

  describe('typing', () => {
    it('should accept digits and move on to the next cell', async () => {
      const wrapper = mountInput();

      await typeDigit(wrapper, '2', 0);
      await typeDigit(wrapper, '0', 1);
      await typeDigit(wrapper, '2', 2);
      await typeDigit(wrapper, '6', 3);

      expect(segments(wrapper).join('')).toBe('2026-MM-DD');
    });

    it('should block a digit that would put the cell out of range', async () => {
      const wrapper = mountInput({ value: '2026-MM-DD' });

      await typeDigit(wrapper, '1', 5);
      await typeDigit(wrapper, '9', 6);

      expect(segments(wrapper).join('')).toBe('2026-1M-DD');
    });

    it('should clear the previous position on Backspace', async () => {
      const wrapper = mountInput({ value: '2026-09-15' });
      const element = input(wrapper).element as HTMLInputElement;

      element.setSelectionRange(4, 4);
      await input(wrapper).trigger('keydown', { key: 'Backspace' });
      await nextTick();

      expect(segments(wrapper).join('')).toBe('202Y-09-15');
    });

    it('should block letters', async () => {
      const wrapper = mountInput();

      await input(wrapper).trigger('keydown', { key: 'a' });
      await nextTick();

      expect(segments(wrapper).join('')).toBe('YYYY-MM-DD');
    });

    it('should emit change once the value is complete and parseable', async () => {
      const onChange = vi.fn();
      const wrapper = mountInput({ onChange, value: '2026-09-1D' });

      await typeDigit(wrapper, '5', 9);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][1]).toBe('20260915');
      expect(moment(onChange.mock.calls[0][0]).format('YYYY-MM-DD')).toBe(
        '2026-09-15',
      );
    });
  });

  describe('typing over an existing value', () => {
    it('should accept months 10-12 over a month whose second digit is above 2', async () => {
      const { committed, wrapper } = mountControlled('YYYY-MM', '2026-08');

      await placeCursor(wrapper, 0, 7);
      await typeKeys(wrapper, '2025-12');

      expect(segments(wrapper).join('')).toBe('2025-12');
      expect(committed).toEqual(['2025-08', '2025-12']);
    });

    it('should accept months 01-09 over a month whose second digit is 0', async () => {
      const { committed, wrapper } = mountControlled('YYYY-MM', '2026-10');

      await placeCursor(wrapper, 5);
      await typeKeys(wrapper, '05');

      expect(segments(wrapper).join('')).toBe('2026-05');
      expect(committed).toEqual(['2026-05']);
    });

    it('should accept days 30-31 over a day whose second digit is above 1', async () => {
      const { committed, wrapper } = mountControlled(
        'YYYY-MM-DD',
        '2026-08-15',
      );

      await placeCursor(wrapper, 8);
      await typeKeys(wrapper, '31');

      expect(segments(wrapper).join('')).toBe('2026-08-31');
      expect(committed).toEqual(['2026-08-31']);
    });

    it('should accept hours 20-23 over an hour whose second digit is above 3', async () => {
      const { committed, wrapper } = mountControlled('HH:mm', '15:30');

      await placeCursor(wrapper, 0);
      await typeKeys(wrapper, '21');

      expect(segments(wrapper).join('')).toBe('21:30');
      expect(committed).toEqual(['21:30']);
    });

    it('should clear the rest of a cell when typing its first digit and not emit until the cell is complete', async () => {
      const { committed, wrapper } = mountControlled('YYYY-MM', '2026-08');

      await placeCursor(wrapper, 5);
      await typeKeys(wrapper, '1');

      expect(segments(wrapper).join('')).toBe('2026-1M');
      expect(committed).toEqual([]);
    });

    it('should still block a completed cell that is out of range', async () => {
      const { committed, wrapper } = mountControlled('YYYY-MM', '2026-08');

      await placeCursor(wrapper, 5);
      await typeKeys(wrapper, '13');

      expect(segments(wrapper).join('')).toBe('2026-1M');
      expect(committed).toEqual([]);
    });

    it('should still validate a digit typed into the middle of a filled cell', async () => {
      const { committed, wrapper } = mountControlled(
        'YYYY-MM-DD',
        '2026-08-15',
      );

      await placeCursor(wrapper, 9);
      await typeKeys(wrapper, '9');

      expect(segments(wrapper).join('')).toBe('2026-08-19');
      expect(committed).toEqual(['2026-08-19']);
    });

    it('should pad a first digit that no in-range value starts with (month 5 → 05)', async () => {
      const { committed, wrapper } = mountControlled('YYYY-MM', '2026-08');

      await placeCursor(wrapper, 5);
      await typeKeys(wrapper, '5');

      expect(segments(wrapper).join('')).toBe('2026-05');
      expect(committed).toEqual(['2026-05']);
    });

    it('should pad a first day digit above 3 and keep the rest of the value', async () => {
      const { committed, wrapper } = mountControlled(
        'YYYY-MM-DD',
        '2026-08-15',
      );

      await placeCursor(wrapper, 8);
      await typeKeys(wrapper, '7');

      expect(segments(wrapper).join('')).toBe('2026-08-07');
      expect(committed).toEqual(['2026-08-07']);
    });

    it('should pad a first hour digit above 2 and move on to the minutes', async () => {
      const { committed, wrapper } = mountControlled('HH:mm', '15:30');

      await placeCursor(wrapper, 0);
      await typeKeys(wrapper, '945');

      expect(segments(wrapper).join('')).toBe('09:45');
      expect(committed).toEqual(['09:30', '09:45']);
    });

    it('should block a first year digit that cannot reach the minimum', async () => {
      const { committed, wrapper } = mountControlled('YYYY-MM', '2026-08');

      await placeCursor(wrapper, 0);
      await typeKeys(wrapper, '0');

      expect(segments(wrapper).join('')).toBe('2026-08');
      expect(committed).toEqual([]);
    });

    it('should still emit a pasted ISO value even when it equals the current value', async () => {
      const { committed, wrapper } = mountControlled('YYYY-MM', '2026-08');

      input(wrapper).element.dispatchEvent(
        Object.assign(new Event('paste', { bubbles: true }), {
          clipboardData: { getData: () => moment('2026-08-10').toISOString() },
        }),
      );
      await nextTick();

      expect(committed).toEqual(['2026-08']);
    });

    it('should not emit when the typed value equals the current value', async () => {
      const { committed, wrapper } = mountControlled('YYYY-MM', '2026-08');

      await placeCursor(wrapper, 0, 7);
      await typeKeys(wrapper, '2026-08');

      expect(segments(wrapper).join('')).toBe('2026-08');
      expect(committed).toEqual([]);
    });
  });

  describe('blur', () => {
    it('should clear an incomplete value and report it', async () => {
      const onChange = vi.fn();
      const wrapper = mountInput({ onChange, value: '2026-09-DD' });

      await input(wrapper).trigger('blur');

      expect(segments(wrapper).join('')).toBe('YYYY-MM-DD');
      expect(onChange).toHaveBeenCalledWith('', '');
    });

    it('should keep a complete value', async () => {
      const onChange = vi.fn();
      const wrapper = mountInput({ onChange, value: '2026-09-15' });

      await input(wrapper).trigger('blur');

      expect(segments(wrapper).join('')).toBe('2026-09-15');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should clear a complete value that fails the custom validation', async () => {
      const onChange = vi.fn();
      const wrapper = mountInput({
        onChange,
        validate: () => false,
        value: '2026-09-15',
      });

      await input(wrapper).trigger('blur');

      expect(segments(wrapper).join('')).toBe('YYYY-MM-DD');
      expect(onChange).toHaveBeenCalledWith('', '');
    });
  });

  describe('paste', () => {
    const pasteEvent = (text: string): ClipboardEvent =>
      Object.assign(new Event('paste', { bubbles: true }), {
        clipboardData: { getData: () => text },
      }) as unknown as ClipboardEvent;

    it('should format a pasted ISO value and report it', async () => {
      const onPasteIsoValue = vi.fn();
      const wrapper = mountInput({ onPasteIsoValue });

      input(wrapper).element.dispatchEvent(
        pasteEvent('2026-09-15T00:00:00.000Z'),
      );
      await nextTick();

      expect(onPasteIsoValue).toHaveBeenCalledWith('2026-09-15T00:00:00.000Z');
      expect(segments(wrapper).join('')).toBe('2026-09-15');
    });

    it('should fill the mask digit by digit when the paste is not a date', async () => {
      const wrapper = mountInput();

      input(wrapper).element.dispatchEvent(pasteEvent('2026 09 15'));
      await nextTick();

      expect(segments(wrapper).join('')).toBe('2026-09-15');
    });
  });
});
