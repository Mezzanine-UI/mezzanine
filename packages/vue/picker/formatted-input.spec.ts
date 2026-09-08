import { h, nextTick } from 'vue';
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

      await typeDigit(wrapper, '9', 5);
      await typeDigit(wrapper, '9', 6);

      expect(segments(wrapper).join('')).toBe('2026-9M-DD');
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
