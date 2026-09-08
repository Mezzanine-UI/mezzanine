import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { calendarClasses } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import { timePanelClasses } from '@mezzanine-ui/core/time-panel';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznDateTimePicker from './date-time-picker.vue';

const value = '2026-09-15T08:30:45.000Z';

function mountPicker(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    attachTo: document.body,
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: { default: () => h(MznDateTimePicker, props) },
  });
}

const calendarPanel = () =>
  document.body.querySelector(`.${calendarClasses.host}`);

const timePanel = () =>
  document.body.querySelector(`.${timePanelClasses.host}`);

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

describe('<MznDateTimePicker />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render two inputs separated by a divider, with a calendar-time icon', () => {
    const wrapper = mountPicker();

    expect(wrapper.get(`.${pickerClasses.host}`).classes()).toContain(
      pickerClasses.hostDatetime,
    );
    expect(wrapper.find(`.${pickerClasses.separator}`).exists()).toBe(true);
    expect(
      wrapper
        .get('.mzn-text-field__suffix .mzn-icon')
        .attributes('data-icon-name'),
    ).toBe('calendar-time');
  });

  it('should split the value across the two inputs', () => {
    const wrapper = mountPicker({ value });

    expect(displays(wrapper)).toEqual([
      moment(value).format('YYYY-MM-DD'),
      moment(value).format('HH:mm:ss'),
    ]);
  });

  it('should drop the seconds from the time format when hideSecond is set', () => {
    const wrapper = mountPicker({ hideSecond: true, value });

    expect(displays(wrapper)[1]).toBe(moment(value).format('HH:mm'));
  });

  describe('panels', () => {
    it('should open the calendar from the left input and report the toggle', async () => {
      const onPanelToggle = vi.fn();
      const wrapper = mountPicker({ onPanelToggle });

      await wrapper.findAll('input')[0].trigger('focus');

      expect(calendarPanel()).not.toBeNull();
      expect(timePanel()).toBeNull();
      expect(onPanelToggle).toHaveBeenCalledWith(true, 'left');
    });

    it('should open the time panel from the right input', async () => {
      const onPanelToggle = vi.fn();
      const wrapper = mountPicker({ onPanelToggle });

      await wrapper.findAll('input')[1].trigger('focus');

      expect(timePanel()).not.toBeNull();
      expect(calendarPanel()).toBeNull();
      expect(onPanelToggle).toHaveBeenCalledWith(true, 'right');
    });

    it('should open neither panel when readOnly', async () => {
      const wrapper = mountPicker({ readOnly: true });

      await wrapper.findAll('input')[0].trigger('focus');
      await wrapper.findAll('input')[1].trigger('focus');

      expect(calendarPanel()).toBeNull();
      expect(timePanel()).toBeNull();
    });

    it('should close whatever is open from the icon', async () => {
      const wrapper = mountPicker();
      const icon = wrapper.get('.mzn-text-field__suffix .mzn-icon');

      await wrapper.findAll('input')[0].trigger('focus');
      expect(calendarPanel()).not.toBeNull();

      await icon.trigger('click');
      await nextTick();

      expect(calendarPanel()).toBeNull();
    });
  });

  describe('selection', () => {
    it('should emit change only once both halves are set', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange });

      await wrapper.findAll('input')[0].trigger('focus');
      dayButton('Thursday, September 10, 2026')?.click();
      await nextTick();

      // No time yet, so nothing is emitted.
      expect(onChange).not.toHaveBeenCalled();

      await wrapper.findAll('input')[1].trigger('focus');
      (
        document.body.querySelectorAll(
          `.${timePanelClasses.column} .${timePanelClasses.columnButton}`,
        )[9] as HTMLButtonElement
      ).click();
      await nextTick();

      // The panel pick is pending until Ok.
      expect(onChange).not.toHaveBeenCalled();

      footerButtons()[1].click();
      await nextTick();

      const emitted = moment(onChange.mock.calls[0][0]);

      expect(emitted.format('YYYY-MM-DD')).toBe('2026-09-10');
      expect(emitted.hour()).toBe(9);
      expect(timePanel()).toBeNull();
    });

    it('should discard the pending time on Cancel', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange, value });

      await wrapper.findAll('input')[1].trigger('focus');
      (
        document.body.querySelectorAll(
          `.${timePanelClasses.column} .${timePanelClasses.columnButton}`,
        )[9] as HTMLButtonElement
      ).click();
      await nextTick();

      footerButtons()[0].click();
      await nextTick();

      expect(onChange).not.toHaveBeenCalled();
      expect(displays(wrapper)[1]).toBe(moment(value).format('HH:mm:ss'));
      expect(timePanel()).toBeNull();
    });

    it('should move focus to the time input once a date is picked', async () => {
      const wrapper = mountPicker();

      await wrapper.findAll('input')[0].trigger('focus');
      dayButton('Thursday, September 10, 2026')?.click();
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(document.activeElement).toBe(wrapper.findAll('input')[1].element);
    });

    it('should fill the empty time from a pasted ISO date', async () => {
      const wrapper = mountPicker();

      wrapper.findAll('input')[0].element.dispatchEvent(
        Object.assign(new Event('paste', { bubbles: true }), {
          clipboardData: { getData: () => value },
        }),
      );
      await nextTick();

      expect(displays(wrapper)).toEqual([
        moment(value).format('YYYY-MM-DD'),
        moment(value).format('HH:mm:ss'),
      ]);
    });

    it('should emit undefined when cleared', async () => {
      const onChange = vi.fn();
      const onClear = vi.fn();
      const wrapper = mountPicker({ onChange, onClear, value });

      await wrapper.get(`.${pickerClasses.host}`).trigger('mouseenter');
      await wrapper.get('.mzn-clear-actions').trigger('click');

      expect(onChange).toHaveBeenCalledWith(undefined);
      expect(onClear).toHaveBeenCalledTimes(1);
      // Emptied inputs fall back to their native placeholders, which are the
      // two formats, and the segment display is dropped entirely.
      expect(displays(wrapper)).toEqual([]);
      expect(
        wrapper
          .findAll('input')
          .map((input) => input.attributes('placeholder')),
      ).toEqual(['YYYY-MM-DD', 'HH:mm:ss']);
    });
  });
});
