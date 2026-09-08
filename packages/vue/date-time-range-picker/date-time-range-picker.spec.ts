import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { dateTimeRangePickerClasses as classes } from '@mezzanine-ui/core/date-time-range-picker';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznDateTimeRangePicker from './date-time-range-picker.vue';

const from = '2026-09-15T08:30:45.000Z';
const to = '2026-09-20T17:00:00.000Z';

function mountPicker(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    attachTo: document.body,
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: { default: () => h(MznDateTimeRangePicker, props) },
  });
}

const displays = (wrapper: VueWrapper) =>
  wrapper
    .findAll(`.${pickerClasses.formattedInputDisplay}`)
    .map((display) => display.text());

describe('<MznDateTimeRangePicker />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render two date-time pickers with an arrow between them', () => {
    const wrapper = mountPicker();
    const host = wrapper.get(`.${classes.host}`);

    expect(host.classes()).toContain(classes.row);
    expect(host.findAll(`.${pickerClasses.hostDatetime}`)).toHaveLength(2);
    expect(host.get(`.${classes.arrow}`).attributes('data-icon-name')).toBe(
      'long-tail-arrow-right',
    );
  });

  it('should turn the arrow and the host class in column direction', () => {
    const wrapper = mountPicker({ direction: 'column' });
    const host = wrapper.get(`.${classes.host}`);

    expect(host.classes()).toContain(classes.column);
    expect(host.get(`.${classes.arrow}`).attributes('data-icon-name')).toBe(
      'long-tail-arrow-down',
    );
  });

  it('should append class name on host element', () => {
    const wrapper = mountPicker({ class: 'foo' });

    expect(wrapper.get(`.${classes.host}`).classes()).toContain('foo');
  });

  it('should split the range across the two pickers', () => {
    const wrapper = mountPicker({ value: [from, to] });

    expect(displays(wrapper)).toEqual([
      moment(from).format('YYYY-MM-DD'),
      moment(from).format('HH:mm:ss'),
      moment(to).format('YYYY-MM-DD'),
      moment(to).format('HH:mm:ss'),
    ]);
  });

  it('should share every setting with both pickers', () => {
    const wrapper = mountPicker({ hideSecond: true, value: [from, to] });

    expect(displays(wrapper)).toEqual([
      moment(from).format('YYYY-MM-DD'),
      moment(from).format('HH:mm'),
      moment(to).format('YYYY-MM-DD'),
      moment(to).format('HH:mm'),
    ]);
  });

  it('should emit the whole pair when the start changes', async () => {
    const onChange = vi.fn();
    const wrapper = mountPicker({ onChange, value: [undefined, to] });

    wrapper.findAll('input')[0].element.dispatchEvent(
      Object.assign(new Event('paste', { bubbles: true }), {
        clipboardData: { getData: () => from },
      }),
    );
    await nextTick();

    const [newFrom, keptTo] = onChange.mock.calls.at(-1)?.[0] ?? [];

    expect(moment(newFrom).format('YYYY-MM-DD')).toBe(
      moment(from).format('YYYY-MM-DD'),
    );
    expect(keptTo).toBe(to);
  });

  it('should emit the whole pair when the end changes', async () => {
    const onChange = vi.fn();
    const wrapper = mountPicker({ onChange, value: [from, undefined] });

    wrapper.findAll('input')[2].element.dispatchEvent(
      Object.assign(new Event('paste', { bubbles: true }), {
        clipboardData: { getData: () => to },
      }),
    );
    await nextTick();

    const [keptFrom, newTo] = onChange.mock.calls.at(-1)?.[0] ?? [];

    expect(keptFrom).toBe(from);
    expect(moment(newTo).format('YYYY-MM-DD')).toBe(
      moment(to).format('YYYY-MM-DD'),
    );
  });

  it('should forward the panel toggle of whichever picker opened', async () => {
    const onPanelToggle = vi.fn();
    const wrapper = mountPicker({ onPanelToggle });

    await wrapper.findAll('input')[2].trigger('focus');

    expect(onPanelToggle).toHaveBeenCalledWith(true, 'left');
  });
});
