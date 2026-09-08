import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { calendarClasses } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznDatePicker from './date-picker.vue';

const referenceDate = '2026-09-15T00:00:00.000Z';

function mountPicker(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    attachTo: document.body,
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: {
      default: () => h(MznDatePicker, { referenceDate, ...props }),
    },
  });
}

const calendarPanel = () =>
  document.body.querySelector(`.${calendarClasses.host}`);

const dayButton = (label: string) =>
  document.body.querySelector(
    `button[aria-label^="${label}"]`,
  ) as HTMLButtonElement | null;

const displayText = (wrapper: VueWrapper) =>
  wrapper.get(`.${pickerClasses.formattedInputDisplay}`).text();

describe('<MznDatePicker />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render a date picker trigger with a calendar icon', () => {
    const wrapper = mountPicker();

    expect(wrapper.get(`.${pickerClasses.host}`).classes()).toContain(
      pickerClasses.hostDate,
    );
    expect(
      wrapper
        .get('.mzn-text-field__suffix .mzn-icon')
        .attributes('data-icon-name'),
    ).toBe('calendar');
  });

  it('should render the value with the mode default format', () => {
    const wrapper = mountPicker({ value: '2026-09-15T00:00:00.000Z' });

    expect(displayText(wrapper)).toBe('2026-09-15');
  });

  it('should use the month format in month mode', () => {
    const wrapper = mountPicker({
      mode: 'month',
      value: '2026-09-15T00:00:00.000Z',
    });

    expect(displayText(wrapper)).toBe('2026-09');
  });

  describe('calendar', () => {
    it('should open on focus and report the toggle', async () => {
      const onCalendarToggle = vi.fn();
      const wrapper = mountPicker({ onCalendarToggle });

      expect(calendarPanel()).toBeNull();

      await wrapper.get('input').trigger('focus');

      expect(calendarPanel()).not.toBeNull();
      expect(onCalendarToggle).toHaveBeenCalledWith(true);
    });

    it('should not open when readOnly', async () => {
      const wrapper = mountPicker({ readOnly: true });

      await wrapper.get('input').trigger('focus');

      expect(calendarPanel()).toBeNull();
    });

    it('should toggle from the calendar icon', async () => {
      const wrapper = mountPicker();
      const icon = wrapper.get('.mzn-text-field__suffix .mzn-icon');

      await icon.trigger('click');
      expect(calendarPanel()).not.toBeNull();

      await icon.trigger('click');
      await nextTick();
      expect(calendarPanel()).toBeNull();
    });

    it('should emit change and close when a date is picked', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange });

      await wrapper.get('input').trigger('focus');
      dayButton('Thursday, September 10, 2026')?.click();
      await nextTick();

      expect(moment(onChange.mock.calls[0][0]).format('YYYY-MM-DD')).toBe(
        '2026-09-10',
      );
      expect(calendarPanel()).toBeNull();
    });

    it('should switch to the month panel and stay open without emitting', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange });

      await wrapper.get('input').trigger('focus');
      (
        document.body.querySelector(
          `.${calendarClasses.controlsMain} button[aria-label^="Select month"]`,
        ) as HTMLButtonElement
      ).click();
      await nextTick();

      expect(calendarPanel()?.classList).toContain(
        calendarClasses.mode('month'),
      );

      (
        document.body.querySelector(
          'button[aria-label^="November 2026"]',
        ) as HTMLButtonElement
      ).click();
      await nextTick();

      // Selecting inside a pushed mode only moves the calendar.
      expect(onChange).not.toHaveBeenCalled();
      expect(calendarPanel()?.classList).toContain(calendarClasses.mode('day'));
      expect(calendarPanel()).not.toBeNull();
    });

    it('should preview the hovered date in the input while it is empty', async () => {
      const onHover = vi.fn();
      const wrapper = mountPicker({ onHover });

      await wrapper.get('input').trigger('focus');
      dayButton('Thursday, September 10, 2026')?.dispatchEvent(
        new MouseEvent('mouseenter'),
      );
      await nextTick();

      expect(onHover).toHaveBeenCalledTimes(1);
      expect(displayText(wrapper)).toBe('2026-09-10');
    });

    it('should clear the preview when the pointer leaves the panel', async () => {
      const onLeave = vi.fn();
      const wrapper = mountPicker({ onLeave });

      await wrapper.get('input').trigger('focus');
      dayButton('Thursday, September 10, 2026')?.dispatchEvent(
        new MouseEvent('mouseenter'),
      );
      await nextTick();

      (calendarPanel()?.parentElement as HTMLElement).dispatchEvent(
        new MouseEvent('mouseleave'),
      );
      await nextTick();

      expect(onLeave).toHaveBeenCalledTimes(1);
      expect(displayText(wrapper)).toBe('YYYY-MM-DD');
    });
  });

  describe('input', () => {
    it('should emit change and close on Enter', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({
        onChange,
        value: '2026-09-15T00:00:00.000Z',
      });

      await wrapper.get('input').trigger('focus');
      await wrapper.get('input').trigger('keydown', { key: 'Enter' });

      expect(onChange).toHaveBeenCalled();
      expect(calendarPanel()).toBeNull();
    });

    it('should emit undefined when cleared', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({
        onChange,
        value: '2026-09-15T00:00:00.000Z',
      });

      await wrapper.get(`.${pickerClasses.host}`).trigger('mouseenter');
      await wrapper.get('.mzn-clear-actions').trigger('click');

      expect(onChange).toHaveBeenCalledWith(undefined);
    });

    it('should size the input to the format', () => {
      const wrapper = mountPicker();

      expect(wrapper.get('input').attributes('size')).toBe('12');
    });

    it('should clear a typed date the mode rejects', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({
        isDateDisabled: (date: string) =>
          moment(date).format('YYYY-MM-DD') === '2026-09-10',
        onChange,
        value: '2026-09-10T00:00:00.000Z',
      });

      await wrapper.get('input').trigger('blur');

      expect(displayText(wrapper)).toBe('YYYY-MM-DD');
    });
  });
});
