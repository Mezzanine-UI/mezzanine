import { h } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { calendarClasses } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { timePanelClasses as classes } from '@mezzanine-ui/core/time-panel';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import MznTimePanel from './time-panel.vue';

const value = '2026-09-15T08:30:45.000Z';

function mountTimePanel(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: { default: () => h(MznTimePanel, props) },
  });
}

const columns = (wrapper: VueWrapper) => wrapper.findAll(`.${classes.column}`);

const unitButtons = (wrapper: VueWrapper, columnIndex: number) =>
  columns(wrapper)[columnIndex].findAll(`.${classes.columnButton}`);

describe('<MznTimePanel />', () => {
  it('should bind host class and render three columns', () => {
    const wrapper = mountTimePanel();

    expect(wrapper.find(`.${classes.host}`).exists()).toBe(true);
    expect(wrapper.find(`.${classes.columns}`).exists()).toBe(true);
    expect(columns(wrapper)).toHaveLength(3);
  });

  it('should append class name on host element', () => {
    const wrapper = mountTimePanel({ class: 'foo' });

    expect(wrapper.get(`.${classes.host}`).classes()).toContain('foo');
  });

  it.each(['hideHour', 'hideMinute', 'hideSecond'] as const)(
    'should hide a column through %s',
    (prop) => {
      const wrapper = mountTimePanel({ [prop]: true });

      expect(columns(wrapper)).toHaveLength(2);
    },
  );

  it('should render 24 hours and 60 minutes and seconds by default', () => {
    const wrapper = mountTimePanel();

    expect(unitButtons(wrapper, 0)).toHaveLength(24);
    expect(unitButtons(wrapper, 1)).toHaveLength(60);
    expect(unitButtons(wrapper, 2)).toHaveLength(60);
  });

  it('should apply the steps', () => {
    const wrapper = mountTimePanel({
      hourStep: 2,
      minuteStep: 5,
      secondStep: 10,
    });

    expect(unitButtons(wrapper, 0)).toHaveLength(12);
    expect(unitButtons(wrapper, 1)).toHaveLength(12);
    expect(unitButtons(wrapper, 2)).toHaveLength(6);
    expect(unitButtons(wrapper, 1)[1].text()).toBe('05');
  });

  it('should pad each unit label to two digits', () => {
    expect(unitButtons(mountTimePanel(), 0)[0].text()).toBe('00');
  });

  describe('prop: value', () => {
    it('should mark the matching unit of every column active', () => {
      const wrapper = mountTimePanel({ value });
      const active = wrapper.findAll(`.${classes.buttonActive}`);
      const hour = moment(value).hour();

      expect(active.map((button) => button.text())).toEqual([
        `${hour}`.padStart(2, '0'),
        '30',
        '45',
      ]);
    });

    it('should mark nothing active without a value', () => {
      expect(mountTimePanel().findAll(`.${classes.buttonActive}`)).toHaveLength(
        0,
      );
    });
  });

  describe('emit: change', () => {
    it('should apply the clicked unit to the current value', async () => {
      const onChange = vi.fn();
      const wrapper = mountTimePanel({ onChange, value });

      await unitButtons(wrapper, 1)[10].trigger('click');

      const emitted = moment(onChange.mock.calls[0][0]);

      expect(emitted.minute()).toBe(10);
      expect(emitted.second()).toBe(moment(value).second());
      expect(emitted.format('YYYY-MM-DD')).toBe(
        moment(value).format('YYYY-MM-DD'),
      );
    });

    it('should fall back to the start of today when there is no value', async () => {
      const onChange = vi.fn();
      const wrapper = mountTimePanel({ onChange });

      await unitButtons(wrapper, 0)[9].trigger('click');

      const emitted = moment(onChange.mock.calls[0][0]);

      expect(emitted.format('YYYY-MM-DD')).toBe(moment().format('YYYY-MM-DD'));
      expect(emitted.hour()).toBe(9);
      expect(emitted.minute()).toBe(0);
      expect(emitted.second()).toBe(0);
    });
  });

  describe('footer actions', () => {
    it('should render Cancel and Ok', () => {
      const buttons = mountTimePanel()
        .get(`.${calendarClasses.footerActions}`)
        .findAll('button');

      expect(buttons.map((button) => button.text())).toEqual(['Cancel', 'Ok']);
    });

    it('should emit cancel and confirm', async () => {
      const onCancel = vi.fn();
      const onConfirm = vi.fn();
      const wrapper = mountTimePanel({ onCancel, onConfirm });
      const buttons = wrapper
        .get(`.${calendarClasses.footerActions}`)
        .findAll('button');

      await buttons[0].trigger('click');
      await buttons[1].trigger('click');

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('column scrolling', () => {
    it('should pad each column with three placeholders top and bottom', () => {
      const wrapper = mountTimePanel();

      expect(
        columns(wrapper)[0].findAll(`.${classes.columnPlaceholder}`),
      ).toHaveLength(6);
    });

    // The scroll itself waits for OverlayScrollbars to hand over its viewport,
    // which never initialises under jsdom — React's own spec stops here too.
  });
});
