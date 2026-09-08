import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { calendarClasses } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznDateRangePicker from './date-range-picker.vue';

const referenceDate = '2026-09-01';

function mountPicker(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    attachTo: document.body,
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: {
      default: () => h(MznDateRangePicker, { referenceDate, ...props }),
    },
  });
}

const panel = () => document.body.querySelector(`.${calendarClasses.host}`);

const dayButton = (label: string) =>
  document.body.querySelector(
    `button[aria-label^="${label}"]`,
  ) as HTMLButtonElement | null;

const displays = (wrapper: VueWrapper) =>
  wrapper
    .findAll(`.${pickerClasses.formattedInputDisplay}`)
    .map((display) => display.text());

const footerButtons = () =>
  Array.from(
    document.body.querySelectorAll(`.${calendarClasses.footerActions} button`),
  ) as HTMLButtonElement[];

describe('<MznDateRangePicker />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render two inputs and a calendar icon', () => {
    const wrapper = mountPicker();

    expect(wrapper.findAll('input')).toHaveLength(2);
    expect(
      wrapper
        .get('.mzn-text-field__suffix .mzn-icon')
        .attributes('data-icon-name'),
    ).toBe('calendar');
  });

  it.each([
    ['day', undefined],
    ['month', pickerClasses.hostRangeSlim],
    ['year', pickerClasses.hostRangeYear],
  ] as const)('should size the trigger for %s mode', (mode, expected) => {
    const wrapper = mountPicker({ mode });
    const classes = wrapper.get(`.${pickerClasses.host}`).classes();

    if (expected) {
      expect(classes).toContain(expected);
    } else {
      expect(classes).not.toContain(pickerClasses.hostRangeSlim);
      expect(classes).not.toContain(pickerClasses.hostRangeYear);
    }
  });

  it('should render both ends of the value', () => {
    const wrapper = mountPicker({ value: ['2026-09-05', '2026-09-20'] });

    expect(displays(wrapper)).toEqual(['2026-09-05', '2026-09-20']);
  });

  describe('calendar', () => {
    it('should open on focus of either input and report the toggle', async () => {
      const onCalendarToggle = vi.fn();
      const wrapper = mountPicker({ onCalendarToggle });

      await wrapper.findAll('input')[1].trigger('focus');

      expect(panel()).not.toBeNull();
      expect(onCalendarToggle).toHaveBeenCalledWith(true);
    });

    it('should not open when readOnly', async () => {
      const wrapper = mountPicker({ readOnly: true });

      await wrapper.findAll('input')[0].trigger('focus');

      expect(panel()).toBeNull();
    });

    it('should render two calendars a month apart', async () => {
      const wrapper = mountPicker();

      await wrapper.findAll('input')[0].trigger('focus');

      const months = Array.from(
        document.body.querySelectorAll(
          `.${calendarClasses.controlsMain} button[aria-label^="Select month"]`,
        ),
      ).map((button) => button.textContent);

      expect(months).toEqual(['Sep', 'Oct']);
    });

    it('should complete a range on the second pick, then close', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange });

      await wrapper.findAll('input')[0].trigger('focus');

      dayButton('Tuesday, September 1, 2026')?.click();
      await nextTick();

      // Starting a range with nothing committed yet emits nothing.
      expect(onChange).not.toHaveBeenCalled();
      expect(panel()).not.toBeNull();

      dayButton('Friday, September 11, 2026')?.click();
      await nextTick();

      const [start, end] = onChange.mock.calls[0][0];

      expect(moment(start).format('YYYY-MM-DD')).toBe('2026-09-01');
      expect(moment(end).format('YYYY-MM-DD')).toBe('2026-09-11');
      expect(panel()).toBeNull();
    });

    it('should restart the selection when the range covers a disabled date', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({
        isDateDisabled: (date: string) =>
          moment(date).format('YYYY-MM-DD') === '2026-09-05',
        onChange,
      });

      await wrapper.findAll('input')[0].trigger('focus');
      dayButton('Tuesday, September 1, 2026')?.click();
      await nextTick();
      dayButton('Friday, September 11, 2026')?.click();
      await nextTick();

      // The closing click became a fresh start, so no range was submitted.
      expect(onChange.mock.calls.every(([value]) => value === undefined)).toBe(
        true,
      );
      expect(panel()).not.toBeNull();
    });

    it('should preview the hovered date in the end input while the range is half finished', async () => {
      const wrapper = mountPicker({ value: ['2026-09-05', undefined] });

      await wrapper.findAll('input')[0].trigger('focus');
      dayButton('Friday, September 11, 2026')?.dispatchEvent(
        new MouseEvent('mouseenter'),
      );
      await nextTick();

      expect(displays(wrapper)).toEqual(['2026-09-05', '2026-09-11']);
    });

    it('should drop the preview when the pointer leaves the panel', async () => {
      const wrapper = mountPicker({ value: ['2026-09-05', undefined] });

      await wrapper.findAll('input')[0].trigger('focus');
      dayButton('Friday, September 11, 2026')?.dispatchEvent(
        new MouseEvent('mouseenter'),
      );
      await nextTick();

      (panel()?.parentElement as HTMLElement).dispatchEvent(
        new MouseEvent('mouseleave'),
      );
      await nextTick();

      expect(displays(wrapper)).toEqual(['2026-09-05', 'YYYY-MM-DD']);
    });
  });

  describe('confirmMode', () => {
    it('should render no footer actions in immediate mode', async () => {
      const wrapper = mountPicker();

      await wrapper.findAll('input')[0].trigger('focus');

      expect(footerButtons()).toHaveLength(0);
    });

    it('should auto-generate Confirm and Cancel in manual mode', async () => {
      const wrapper = mountPicker({ confirmMode: 'manual' });

      await wrapper.findAll('input')[0].trigger('focus');

      expect(footerButtons().map((button) => button.textContent)).toEqual([
        'Cancel',
        'Confirm',
      ]);
      expect(footerButtons()[1].disabled).toBe(true);
    });

    it('should only emit change on Confirm, keeping the panel open until then', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ confirmMode: 'manual', onChange });

      await wrapper.findAll('input')[0].trigger('focus');
      dayButton('Tuesday, September 1, 2026')?.click();
      await nextTick();
      dayButton('Friday, September 11, 2026')?.click();
      await nextTick();

      expect(onChange).not.toHaveBeenCalled();
      expect(panel()).not.toBeNull();
      expect(footerButtons()[1].disabled).toBe(false);

      footerButtons()[1].click();
      await nextTick();

      const [start, end] = onChange.mock.calls[0][0];

      expect(moment(start).format('YYYY-MM-DD')).toBe('2026-09-01');
      expect(moment(end).format('YYYY-MM-DD')).toBe('2026-09-11');
      expect(panel()).toBeNull();
    });

    it('should discard the selection on Cancel', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ confirmMode: 'manual', onChange });

      await wrapper.findAll('input')[0].trigger('focus');
      dayButton('Tuesday, September 1, 2026')?.click();
      await nextTick();

      footerButtons()[0].click();
      await nextTick();

      expect(onChange).not.toHaveBeenCalled();
      expect(displays(wrapper)).toEqual(['YYYY-MM-DD', 'YYYY-MM-DD']);
      expect(panel()).toBeNull();
    });

    it('should let the caller override the action labels', async () => {
      const wrapper = mountPicker({
        actions: {
          primaryButtonProps: { children: '確定' },
          secondaryButtonProps: { children: '取消' },
        },
        confirmMode: 'manual',
      });

      await wrapper.findAll('input')[0].trigger('focus');

      expect(footerButtons().map((button) => button.textContent)).toEqual([
        '取消',
        '確定',
      ]);
    });

    it('should keep the panel open after a complete range when actions are given', async () => {
      const wrapper = mountPicker({
        actions: {
          primaryButtonProps: { children: 'Ok' },
          secondaryButtonProps: { children: 'Cancel' },
        },
      });

      await wrapper.findAll('input')[0].trigger('focus');
      dayButton('Tuesday, September 1, 2026')?.click();
      await nextTick();
      dayButton('Friday, September 11, 2026')?.click();
      await nextTick();

      expect(panel()).not.toBeNull();
    });
  });

  describe('inputs', () => {
    it('should swap the ends when the typed end is before the start', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({
        onChange,
        value: ['2026-09-10', undefined],
      });
      const input = wrapper.findAll('input')[1];

      // Fill the 'to' input in one go with a date before the current start.
      input.element.dispatchEvent(
        Object.assign(new Event('paste', { bubbles: true }), {
          clipboardData: { getData: () => '20260905' },
        }),
      );
      await nextTick();

      const [start, end] = onChange.mock.calls.at(-1)?.[0] ?? [];

      expect(moment(start).format('YYYY-MM-DD')).toBe('2026-09-05');
      expect(moment(end).format('YYYY-MM-DD')).toBe('2026-09-10');
    });

    it('should emit undefined when cleared', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({
        onChange,
        value: ['2026-09-05', '2026-09-20'],
      });

      await wrapper.get(`.${pickerClasses.host}`).trigger('mouseenter');
      await wrapper.get('.mzn-clear-actions').trigger('click');

      // The inputs keep showing the controlled value until the caller updates it.
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });
});
