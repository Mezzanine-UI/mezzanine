import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import { timePanelClasses } from '@mezzanine-ui/core/time-panel';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznTimePicker from './time-picker.vue';

function mountPicker(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    attachTo: document.body,
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: { default: () => h(MznTimePicker, props) },
  });
}

const panel = () => document.body.querySelector(`.${timePanelClasses.host}`);

function columnButtons(columnIndex: number): HTMLButtonElement[] {
  const column = document.body.querySelectorAll(`.${timePanelClasses.column}`)[
    columnIndex
  ];

  if (!column) return [];

  return Array.from(
    column.querySelectorAll(`.${timePanelClasses.columnButton}`),
  ) as HTMLButtonElement[];
}

const footerButtons = () =>
  Array.from(
    document.body.querySelectorAll('.mzn-calendar-footer-actions button'),
  ) as HTMLButtonElement[];

describe('<MznTimePicker />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render a picker trigger with a clock icon', () => {
    const wrapper = mountPicker();

    expect(wrapper.find(`.${pickerClasses.host}`).exists()).toBe(true);
    expect(
      wrapper
        .get('.mzn-text-field__suffix .mzn-icon')
        .attributes('data-icon-name'),
    ).toBe('clock');
  });

  it('should render the value in the input, defaulting the format to HH:mm:ss', () => {
    const wrapper = mountPicker({ value: '2026-09-15T08:30:45.000Z' });

    expect(wrapper.get(`.${pickerClasses.formattedInputDisplay}`).text()).toBe(
      moment('2026-09-15T08:30:45.000Z').format('HH:mm:ss'),
    );
  });

  it('should drop the seconds column and the format when hideSecond is set', async () => {
    const wrapper = mountPicker({
      hideSecond: true,
      value: '2026-09-15T08:30:45.000Z',
    });

    expect(wrapper.get(`.${pickerClasses.formattedInputDisplay}`).text()).toBe(
      moment('2026-09-15T08:30:45.000Z').format('HH:mm'),
    );

    await wrapper.get('input').trigger('focus');

    expect(
      document.body.querySelectorAll(`.${timePanelClasses.column}`),
    ).toHaveLength(2);
  });

  describe('panel', () => {
    it('should open on focus and report the toggle', async () => {
      const onPanelToggle = vi.fn();
      const wrapper = mountPicker({ onPanelToggle });

      expect(panel()).toBeNull();

      await wrapper.get('input').trigger('focus');

      expect(panel()).not.toBeNull();
      expect(onPanelToggle).toHaveBeenCalledWith(true);
    });

    it('should not open when readOnly', async () => {
      const wrapper = mountPicker({ readOnly: true });

      await wrapper.get('input').trigger('focus');

      expect(panel()).toBeNull();
    });

    it('should open and close from the clock icon', async () => {
      const wrapper = mountPicker();
      const icon = wrapper.get('.mzn-text-field__suffix .mzn-icon');

      await icon.trigger('click');
      expect(panel()).not.toBeNull();

      await icon.trigger('click');
      await nextTick();
      expect(panel()).toBeNull();
    });

    it('should not attach a click handler to the icon when readOnly', () => {
      const wrapper = mountPicker({ readOnly: true });

      expect(
        wrapper.get('.mzn-text-field__suffix .mzn-icon').attributes('style'),
      ).not.toContain('pointer');
    });
  });

  describe('selection', () => {
    it('should hold a column pick as pending until Ok is clicked', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange });

      await wrapper.get('input').trigger('focus');
      columnButtons(0)[9].click();
      await nextTick();

      expect(onChange).not.toHaveBeenCalled();

      footerButtons()[1].click();
      await nextTick();

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(moment(onChange.mock.calls[0][0]).hour()).toBe(9);
      expect(panel()).toBeNull();
    });

    it('should discard the pending pick on Cancel', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange });

      await wrapper.get('input').trigger('focus');
      columnButtons(0)[9].click();
      await nextTick();

      footerButtons()[0].click();
      await nextTick();

      expect(onChange).not.toHaveBeenCalled();
      expect(panel()).toBeNull();
    });

    it('should commit the pending pick on Enter', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange });

      await wrapper.get('input').trigger('focus');
      columnButtons(0)[9].click();
      await nextTick();

      await wrapper.get('input').trigger('keydown', { key: 'Enter' });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(moment(onChange.mock.calls[0][0]).hour()).toBe(9);
    });

    it('should emit undefined when cleared', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({
        onChange,
        value: '2026-09-15T08:30:45.000Z',
      });

      await wrapper.get(`.${pickerClasses.host}`).trigger('mouseenter');
      await wrapper.get('.mzn-clear-actions').trigger('click');

      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('steps', () => {
    it('should only offer units matching the step', async () => {
      const wrapper = mountPicker({ minuteStep: 15 });

      await wrapper.get('input').trigger('focus');

      expect(columnButtons(1).map((button) => button.textContent)).toEqual([
        '00',
        '15',
        '30',
        '45',
      ]);
    });

    it('should clear a typed value that does not match the step', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({
        minuteStep: 15,
        onChange,
        value: '2026-09-15T08:07:00.000Z',
      });

      await wrapper.get('input').trigger('blur');

      expect(onChange).toHaveBeenCalledWith('');
    });
  });
});
