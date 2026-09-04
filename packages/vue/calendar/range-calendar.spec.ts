import { h } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import moment from 'moment';
import MznCalendarConfigProvider from './calendar-config-provider.vue';
import MznRangeCalendar from './range-calendar.vue';

function mountRangeCalendar(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: {
      default: () =>
        h(MznRangeCalendar, { referenceDate: '2026-09-01', ...props }),
    },
  });
}

const dayButton = (wrapper: VueWrapper, label: string) =>
  wrapper.get(`button[aria-label^="${label}"]`);

const format = (value: unknown): string =>
  moment(value as string).format('YYYY-MM-DD HH:mm:ss.SSS');

describe('<MznRangeCalendar />', () => {
  it('should render two calendars a month apart, without footer controls', () => {
    const wrapper = mountRangeCalendar();
    const host = wrapper.get(`.${classes.host}`);
    const calendars = wrapper.findAll(
      `.${classes.mainRangeCalendarWrapper} > .${classes.host}`,
    );

    expect(host.attributes('role')).toBe('application');
    expect(host.attributes('aria-label')).toBe('Range calendar, day view');
    expect(calendars).toHaveLength(2);
    expect(
      calendars.map((calendar) =>
        calendar.get(`.${classes.controlsMain}`).findAll('button')[0].text(),
      ),
    ).toEqual(['Sep', 'Oct']);
    expect(wrapper.find(`.${classes.footerControl}`).exists()).toBe(false);
  });

  it('should give the left calendar the back arrows and the right one the forward arrows', () => {
    const wrapper = mountRangeCalendar();
    const [first, second] = wrapper.findAll(
      `.${classes.mainRangeCalendarWrapper} > .${classes.host}`,
    );

    expect(first.find('button[title="Previous Month"]').exists()).toBe(true);
    expect(first.find('button[title="Next Month"]').exists()).toBe(false);
    expect(second.find('button[title="Next Month"]').exists()).toBe(true);
    expect(second.find('button[title="Previous Month"]').exists()).toBe(false);
  });

  describe('range selection', () => {
    it('should start a new range on the first click', async () => {
      const onChange = vi.fn();
      const wrapper = mountRangeCalendar({ onChange });

      await dayButton(wrapper, 'Thursday, September 10, 2026').trigger('click');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(format(onChange.mock.calls[0][0][0])).toBe(
        '2026-09-10 00:00:00.000',
      );
      expect(onChange.mock.calls[0][0][1]).toBeUndefined();
    });

    it('should complete the range on the second click, normalized to the unit', async () => {
      const onChange = vi.fn();
      const wrapper = mountRangeCalendar({
        onChange,
        value: ['2026-09-10T08:30:00.000Z'],
      });

      await dayButton(wrapper, 'Monday, September 14, 2026').trigger('click');

      const [start, end] = onChange.mock.calls[0][0];

      expect(format(start)).toBe('2026-09-10 00:00:00.000');
      expect(format(end)).toBe('2026-09-14 23:59:59.999');
    });

    it('should swap the anchors when the second click is before the first', async () => {
      const onChange = vi.fn();
      const wrapper = mountRangeCalendar({
        onChange,
        value: ['2026-09-14T00:00:00.000Z'],
      });

      await dayButton(wrapper, 'Thursday, September 10, 2026').trigger('click');

      const [start, end] = onChange.mock.calls[0][0];

      expect(format(start)).toBe('2026-09-10 00:00:00.000');
      expect(format(end)).toBe('2026-09-14 23:59:59.999');
    });

    it('should restart the selection when the range contains a disabled date', async () => {
      const onChange = vi.fn();
      const wrapper = mountRangeCalendar({
        isDateDisabled: (date: string) =>
          moment(date).format('YYYY-MM-DD') === '2026-09-12',
        onChange,
        value: ['2026-09-10T00:00:00.000Z'],
      });

      await dayButton(wrapper, 'Monday, September 14, 2026').trigger('click');

      expect(format(onChange.mock.calls[0][0][0])).toBe(
        '2026-09-14 00:00:00.000',
      );
      expect(onChange.mock.calls[0][0][1]).toBeUndefined();
    });

    it('should restart the selection when the range is too long to scan', async () => {
      const onChange = vi.fn();
      // Nothing inside the range is disabled, so only the step cap can stop
      // this range from being committed.
      const wrapper = mountRangeCalendar({
        isDateDisabled: (date: string) =>
          moment(date).format('YYYY-MM-DD') === '1999-01-01',
        onChange,
        referenceDate: '2020-09-01',
        value: ['2000-01-01'],
      });

      await dayButton(wrapper, 'Friday, September 11, 2020').trigger('click');

      expect(format(onChange.mock.calls[0][0][0])).toBe(
        '2020-09-11 00:00:00.000',
      );
      expect(onChange.mock.calls[0][0][1]).toBeUndefined();
    });

    it('should start over once a range is complete', async () => {
      const onChange = vi.fn();
      const wrapper = mountRangeCalendar({
        onChange,
        value: ['2026-09-10T00:00:00.000Z', '2026-09-14T23:59:59.999Z'],
      });

      await dayButton(wrapper, 'Friday, September 18, 2026').trigger('click');

      expect(onChange.mock.calls[0][0][1]).toBeUndefined();
    });
  });

  describe('in-range highlighting', () => {
    const inRangeCount = (wrapper: VueWrapper): number =>
      wrapper.findAll(`button.${classes.buttonInRange}`).length;

    it('should paint the caller supplied range', () => {
      const wrapper = mountRangeCalendar({
        isDateInRange: (date: string) =>
          moment(date).isBetween('2026-09-05', '2026-09-25', 'day', '[]'),
        referenceDate: '2026-09-01',
        value: ['2026-09-05', '2026-09-25'],
      });

      expect(inRangeCount(wrapper)).toBeGreaterThan(0);
    });

    it('should not paint a range that contains a disabled date', () => {
      const wrapper = mountRangeCalendar({
        isDateDisabled: (date: string) =>
          moment(date).format('YYYY-MM-DD') === '2026-09-20',
        isDateInRange: (date: string) =>
          moment(date).isBetween('2026-09-05', '2026-09-25', 'day', '[]'),
        referenceDate: '2026-09-01',
        value: ['2026-09-05', '2026-09-25'],
      });

      expect(inRangeCount(wrapper)).toBe(0);
    });
  });

  describe('prop: previewValue', () => {
    it('should paint the hovered date as the range end without committing it', () => {
      const wrapper = mountRangeCalendar({
        previewValue: '2026-09-14T00:00:00.000Z',
        value: ['2026-09-10T00:00:00.000Z'],
      });

      expect(
        dayButton(wrapper, 'Monday, September 14, 2026').attributes(
          'aria-pressed',
        ),
      ).toBe('true');
    });
  });

  describe('prop: actions', () => {
    it('should not render the footer actions by default', () => {
      expect(
        mountRangeCalendar().find(`.${classes.footerActions}`).exists(),
      ).toBe(false);
    });

    it('should default the labels to Cancel and Ok', () => {
      const wrapper = mountRangeCalendar({
        actions: { primaryButtonProps: {}, secondaryButtonProps: {} },
      });
      const buttons = wrapper
        .get(`.${classes.footerActions}`)
        .findAll('button');

      expect(buttons.map((button) => button.text())).toEqual(['Cancel', 'Ok']);
    });

    it('should let the caller override the labels and handlers', async () => {
      const onClick = vi.fn();
      const wrapper = mountRangeCalendar({
        actions: {
          primaryButtonProps: { children: 'Apply', onClick },
          secondaryButtonProps: { children: 'Dismiss', disabled: true },
        },
      });
      const buttons = wrapper
        .get(`.${classes.footerActions}`)
        .findAll('button');

      expect(buttons.map((button) => button.text())).toEqual([
        'Dismiss',
        'Apply',
      ]);
      expect(buttons[0].attributes('disabled')).toBeDefined();

      await buttons[1].trigger('click');

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('mode stack', () => {
    it('should switch both calendars to the month picker and back on select', async () => {
      const onChange = vi.fn();
      const wrapper = mountRangeCalendar({ onChange });

      await wrapper
        .get(`.${classes.controlsMain} button[aria-label^="Select month"]`)
        .trigger('click');

      const calendars = wrapper.findAll(
        `.${classes.mainRangeCalendarWrapper} > .${classes.host}`,
      );

      expect(calendars[0].classes()).toContain(classes.mode('month'));
      expect(calendars[1].classes()).toContain(classes.mode('month'));

      await wrapper.get('button[aria-label^="November 2026"]').trigger('click');

      // Selecting inside a pushed mode only moves the calendars.
      expect(onChange).not.toHaveBeenCalled();
      expect(
        wrapper
          .findAll(`.${classes.mainRangeCalendarWrapper} > .${classes.host}`)[0]
          .classes(),
      ).toContain(classes.mode('day'));
    });
  });
});
