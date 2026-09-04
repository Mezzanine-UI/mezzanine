import { h } from 'vue';
import type { Component } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import moment from 'moment';
import MznCalendarConfigProvider from './calendar-config-provider.vue';
import MznCalendar from './calendar.vue';

const referenceDate = '2026-09-15T00:00:00.000Z';

function mountWithCalendar(
  component: Component,
  props: Record<string, unknown> = {},
): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: { default: () => h(component, props) },
  });
}

function mountCalendar(props: Record<string, unknown> = {}): VueWrapper {
  return mountWithCalendar(MznCalendar, { referenceDate, ...props });
}

describe('<MznCalendar />', () => {
  it('should bind host class and accessibility attributes', () => {
    const host = mountCalendar().get(`.${classes.host}`);

    expect(host.classes()).toContain(classes.mode('day'));
    expect(host.attributes('role')).toBe('application');
    expect(host.attributes('aria-label')).toBe('Calendar, day view');
  });

  it('should append class name on host element', () => {
    const wrapper = mountWithCalendar(MznCalendar, {
      class: 'foo',
      referenceDate,
    });
    const host = wrapper.get(`.${classes.host}`);

    expect(host.classes()).toContain('foo');
    expect(host.classes()).toContain(classes.host);
  });

  describe('prop: mode', () => {
    it.each([
      ['day', classes.daysGrid],
      ['week', classes.week],
      ['month', classes.twelveGrid],
      ['year', classes.twelveGrid],
    ] as const)('should render the %s panel', (mode, panelClass) => {
      const wrapper = mountCalendar({ mode });

      expect(wrapper.get(`.${classes.host}`).classes()).toContain(
        classes.mode(mode),
      );
      expect(wrapper.find(`.${panelClass}`).exists()).toBe(true);
    });

    it.each(['quarter', 'half-year'] as const)(
      'should render five rows in %s mode',
      (mode) => {
        const wrapper = mountCalendar({ mode });

        expect(
          wrapper.findAll(`.${classes.board} > .${classes.row}`),
        ).toHaveLength(5);
      },
    );
  });

  describe('controls', () => {
    it('should render no arrow when nothing listens for it', () => {
      const wrapper = mountCalendar();

      expect(wrapper.find(`.${classes.controlsButton}[title]`).exists()).toBe(
        false,
      );
      expect(wrapper.findAll(`.${classes.controlsButton}`)).toHaveLength(2);
    });

    it('should render an arrow per listener and emit the current mode', async () => {
      const onPrev = vi.fn();
      const onDoubleNext = vi.fn();
      const wrapper = mountWithCalendar(MznCalendar, {
        mode: 'day',
        onDoubleNext,
        onPrev,
        referenceDate,
      });

      const prev = wrapper.get('button[title="Previous Month"]');
      const doubleNext = wrapper.get('button[title="Next Year"]');

      expect(wrapper.find('button[title="Next Month"]').exists()).toBe(false);
      expect(wrapper.find('button[title="Previous Year"]').exists()).toBe(
        false,
      );

      await prev.trigger('click');
      await doubleNext.trigger('click');

      expect(onPrev).toHaveBeenCalledWith('day');
      expect(onDoubleNext).toHaveBeenCalledWith('day');
    });

    it('should disable an arrow through disableOnPrev', () => {
      const wrapper = mountWithCalendar(MznCalendar, {
        disableOnPrev: true,
        onPrev: () => {},
        referenceDate,
      });

      expect(
        wrapper.get('button[title="Previous Month"]').attributes('disabled'),
      ).toBeDefined();
    });

    it('should render month and year switches in day mode', async () => {
      const onMonthControlClick = vi.fn();
      const onYearControlClick = vi.fn();
      const wrapper = mountWithCalendar(MznCalendar, {
        onMonthControlClick,
        onYearControlClick,
        referenceDate,
      });
      const buttons = wrapper.get(`.${classes.controlsMain}`).findAll('button');

      expect(buttons.map((button) => button.text())).toEqual(['Sep', '2026']);

      await buttons[0].trigger('click');
      await buttons[1].trigger('click');

      expect(onMonthControlClick).toHaveBeenCalledTimes(1);
      expect(onYearControlClick).toHaveBeenCalledTimes(1);
    });

    it('should disable the switches through disabledMonthSwitch and disabledYearSwitch', () => {
      const wrapper = mountCalendar({
        disabledMonthSwitch: true,
        disabledYearSwitch: true,
      });
      const buttons = wrapper.get(`.${classes.controlsMain}`).findAll('button');

      expect(buttons[0].attributes('disabled')).toBeDefined();
      expect(buttons[1].attributes('disabled')).toBeDefined();
    });

    it('should render only the year switch in month mode', () => {
      const wrapper = mountCalendar({ mode: 'month' });
      const buttons = wrapper.get(`.${classes.controlsMain}`).findAll('button');

      expect(buttons).toHaveLength(1);
      expect(buttons[0].attributes('aria-label')).toBe(
        'Select year, currently 2026',
      );
    });

    it.each([
      ['year', 'Year range 2020 - 2039'],
      ['quarter', 'Quarter year range 2025 - 2029'],
      ['half-year', 'Half-year range 2025 - 2029'],
    ] as const)(
      'should render a disabled range label in %s mode',
      (mode, ariaLabel) => {
        const button = mountCalendar({ mode }).get(
          `.${classes.controlsMain} button`,
        );

        expect(button.attributes('disabled')).toBeDefined();
        expect(button.attributes('aria-label')).toBe(ariaLabel);
      },
    );
  });

  describe('footer control', () => {
    it.each([
      ['day', 'Today'],
      ['week', 'This week'],
      ['month', 'This month'],
      ['year', 'This year'],
      ['quarter', 'This quarter'],
      ['half-year', 'This half year'],
    ] as const)('should render %s footer control', (mode, label) => {
      const wrapper = mountCalendar({ mode });

      expect(wrapper.get(`.${classes.footerControl}`).text()).toBe(label);
    });

    it('should not render the footer control when disabled', () => {
      const wrapper = mountCalendar({ disabledFooterControl: true });

      expect(wrapper.find(`.${classes.footerControl}`).exists()).toBe(false);
    });

    it('should emit change with the start of today in day mode', async () => {
      const onChange = vi.fn();
      const wrapper = mountWithCalendar(MznCalendar, {
        onChange,
        referenceDate,
      });

      await wrapper.get(`.${classes.footerControl} button`).trigger('click');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(
        moment(onChange.mock.calls[0][0]).format('YYYY-MM-DD HH:mm:ss'),
      ).toBe(moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'));
    });

    it('should emit change with the first day of this month in month mode', async () => {
      const onChange = vi.fn();
      const wrapper = mountWithCalendar(MznCalendar, {
        mode: 'month',
        onChange,
        referenceDate,
      });

      await wrapper.get(`.${classes.footerControl} button`).trigger('click');

      expect(moment(onChange.mock.calls[0][0]).format('YYYY-MM-DD')).toBe(
        moment().startOf('month').format('YYYY-MM-DD'),
      );
    });
  });

  describe('prop: quickSelect', () => {
    it('should not render the quick select by default', () => {
      expect(mountCalendar().find(`.${classes.quickSelect}`).exists()).toBe(
        false,
      );
    });

    it('should render one button per option and mark the active one', () => {
      const wrapper = mountCalendar({
        quickSelect: {
          activeId: 'today',
          options: [
            { id: 'yesterday', name: 'Yesterday', onClick: () => {} },
            { id: 'today', name: 'Today', onClick: () => {} },
          ],
        },
      });
      const buttons = wrapper.findAll(`.${classes.quickSelectButton}`);

      expect(buttons).toHaveLength(2);
      expect(buttons[0].classes()).not.toContain(
        classes.quickSelectButtonActive,
      );
      expect(buttons[1].classes()).toContain(classes.quickSelectButtonActive);
      expect(buttons[1].find('.mzn-icon').exists()).toBe(true);
    });

    it('should call the option handler on click', async () => {
      const onClick = vi.fn();
      const wrapper = mountCalendar({
        quickSelect: { options: [{ id: 'today', name: 'Today', onClick }] },
      });

      await wrapper.get(`.${classes.quickSelectButton}`).trigger('click');

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('days', () => {
    const dayButton = (wrapper: VueWrapper, label: string) =>
      wrapper.get(`button[aria-label^="${label}"]`);

    it('should mark the value as active and emit it on click', async () => {
      const onChange = vi.fn();
      const wrapper = mountWithCalendar(MznCalendar, {
        onChange,
        referenceDate,
        value: '2026-09-10T00:00:00.000Z',
      });
      const button = dayButton(wrapper, 'Thursday, September 10, 2026');

      expect(button.attributes('aria-pressed')).toBe('true');

      await button.trigger('click');

      expect(moment(onChange.mock.calls[0][0]).format('YYYY-MM-DD')).toBe(
        '2026-09-10',
      );
    });

    it('should disable a date through isDateDisabled', () => {
      const wrapper = mountCalendar({
        isDateDisabled: (date: string) =>
          moment(date).format('YYYY-MM-DD') === '2026-09-10',
      });
      const button = dayButton(wrapper, 'Thursday, September 10, 2026');

      expect(button.attributes('disabled')).toBeDefined();
      expect(button.classes()).toContain(classes.buttonDisabled);
    });

    it('should render annotations, falling back to a dash', () => {
      const wrapper = mountCalendar({
        renderAnnotations: (date: string) =>
          moment(date).format('YYYY-MM-DD') === '2026-09-10'
            ? { color: 'text-success' as const, value: '12.4%' }
            : (undefined as unknown as { value: string }),
      });

      expect(dayButton(wrapper, 'Thursday, September 10, 2026').text()).toBe(
        '1012.4%',
      );
      expect(dayButton(wrapper, 'Friday, September 11, 2026').text()).toBe(
        '11--',
      );
      expect(
        wrapper.find(`.${classes.cell}.${classes.cellWithAnnotation}`).exists(),
      ).toBe(true);
    });
  });
});
