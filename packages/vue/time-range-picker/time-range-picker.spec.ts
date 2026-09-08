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
import MznTimeRangePicker from './time-range-picker.vue';

const range: [string, string] = [
  moment().hour(9).minute(0).second(0).toISOString(),
  moment().hour(17).minute(30).second(0).toISOString(),
];

function mountPicker(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    attachTo: document.body,
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: { default: () => h(MznTimeRangePicker, props) },
  });
}

const panel = () => document.body.querySelector(`.${timePanelClasses.host}`);

const columnButtons = (columnIndex: number): HTMLButtonElement[] => {
  const column = document.body.querySelectorAll(`.${timePanelClasses.column}`)[
    columnIndex
  ];

  if (!column) return [];

  return Array.from(
    column.querySelectorAll(`.${timePanelClasses.columnButton}`),
  ) as HTMLButtonElement[];
};

const footerButtons = () =>
  Array.from(
    document.body.querySelectorAll(`.${calendarClasses.footerActions} button`),
  ) as HTMLButtonElement[];

const displays = (wrapper: VueWrapper) =>
  wrapper
    .findAll(`.${pickerClasses.formattedInputDisplay}`)
    .map((display) => display.text());

describe('<MznTimeRangePicker />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render two inputs and a clock icon', () => {
    const wrapper = mountPicker();

    expect(wrapper.findAll('input')).toHaveLength(2);
    expect(
      wrapper
        .get('.mzn-text-field__suffix .mzn-icon')
        .attributes('data-icon-name'),
    ).toBe('clock');
  });

  it('should render both ends of the value', () => {
    const wrapper = mountPicker({ value: range });

    expect(displays(wrapper)).toEqual([
      moment(range[0]).format('HH:mm:ss'),
      moment(range[1]).format('HH:mm:ss'),
    ]);
  });

  it('should drop the seconds when hideSecond is set', () => {
    const wrapper = mountPicker({ hideSecond: true, value: range });

    expect(displays(wrapper)[0]).toBe(moment(range[0]).format('HH:mm'));
  });

  describe('panel', () => {
    it('should open from either input and report the toggle', async () => {
      const onPanelToggle = vi.fn();
      const wrapper = mountPicker({ onPanelToggle });

      await wrapper.findAll('input')[1].trigger('focus');

      expect(panel()).not.toBeNull();
      expect(onPanelToggle).toHaveBeenCalledWith(true);
    });

    it('should not open when readOnly', async () => {
      const wrapper = mountPicker({ readOnly: true });

      await wrapper.findAll('input')[0].trigger('focus');

      expect(panel()).toBeNull();
    });

    it('should start from the current time when the focused end is empty', async () => {
      const wrapper = mountPicker();

      await wrapper.findAll('input')[0].trigger('focus');

      // Something is preselected in each column rather than nothing.
      expect(
        document.body.querySelectorAll(`.${timePanelClasses.buttonActive}`)
          .length,
      ).toBeGreaterThan(0);
    });

    it('should hold the panel pick until Ok, then commit it to the focused end', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange, value: range });

      await wrapper.findAll('input')[1].trigger('focus');
      columnButtons(0)[9].click();
      await nextTick();

      expect(onChange).not.toHaveBeenCalled();

      footerButtons()[1].click();
      await nextTick();

      const [from, to] = onChange.mock.calls[0][0];

      expect(from).toBe(range[0]);
      expect(moment(to).hour()).toBe(9);
      expect(panel()).toBeNull();
    });

    it('should discard the pick on Cancel', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange, value: range });

      await wrapper.findAll('input')[0].trigger('focus');
      columnButtons(0)[9].click();
      await nextTick();

      footerButtons()[0].click();
      await nextTick();

      expect(onChange).not.toHaveBeenCalled();
      expect(displays(wrapper)).toEqual([
        moment(range[0]).format('HH:mm:ss'),
        moment(range[1]).format('HH:mm:ss'),
      ]);
      expect(panel()).toBeNull();
    });

    it('should close from the clock icon without committing', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange, value: range });
      const icon = wrapper.get('.mzn-text-field__suffix .mzn-icon');

      await wrapper.findAll('input')[0].trigger('focus');
      columnButtons(0)[9].click();
      await nextTick();

      await icon.trigger('click');
      await nextTick();

      expect(onChange).not.toHaveBeenCalled();
      expect(panel()).toBeNull();
    });

    it('should only offer units matching the step', async () => {
      const wrapper = mountPicker({ minuteStep: 15 });

      await wrapper.findAll('input')[0].trigger('focus');

      expect(columnButtons(1).map((button) => button.textContent)).toEqual([
        '00',
        '15',
        '30',
        '45',
      ]);
    });
  });

  describe('inputs', () => {
    it('should emit the pair when one end is typed', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange, value: [undefined, range[1]] });

      wrapper.findAll('input')[0].element.dispatchEvent(
        Object.assign(new Event('paste', { bubbles: true }), {
          clipboardData: { getData: () => '093000' },
        }),
      );
      await nextTick();

      const [from, to] = onChange.mock.calls.at(-1)?.[0] ?? [];

      expect(moment(from).format('HH:mm:ss')).toBe('09:30:00');
      expect(to).toBe(range[1]);
    });

    it('should emit undefined when cleared', async () => {
      const onChange = vi.fn();
      const wrapper = mountPicker({ onChange, value: range });

      await wrapper.get(`.${pickerClasses.host}`).trigger('mouseenter');
      await wrapper.get('.mzn-clear-actions').trigger('click');

      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });
});
