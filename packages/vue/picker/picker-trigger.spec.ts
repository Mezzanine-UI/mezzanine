import { h } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import MznPickerTrigger from './picker-trigger.vue';
import MznRangePickerTrigger from './range-picker-trigger.vue';

function mountTrigger(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: {
      default: () =>
        h(MznPickerTrigger, { format: 'YYYY-MM-DD', ...props }, slots),
    },
  });
}

describe('<MznPickerTrigger />', () => {
  it('should render a text field carrying the picker host class', () => {
    const wrapper = mountTrigger();
    const host = wrapper.get(`.${textFieldClasses.host}`);

    expect(host.classes()).toContain(classes.host);
    expect(host.attributes('role')).toBe('presentation');
    expect(wrapper.find(`.${classes.formattedInput}`).exists()).toBe(true);
  });

  it('should mark the input disabled and pass the state to the text field', () => {
    const wrapper = mountTrigger({ disabled: true });

    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
    expect(wrapper.get('input').attributes('aria-disabled')).toBe('true');
    expect(wrapper.get(`.${textFieldClasses.host}`).classes()).toContain(
      textFieldClasses.disabled,
    );
  });

  it('should mark the input readonly and turn off clearing', () => {
    const wrapper = mountTrigger({ clearable: true, readOnly: true });

    expect(wrapper.get('input').attributes('aria-readonly')).toBe('true');
    expect(wrapper.get(`.${textFieldClasses.host}`).classes()).toContain(
      textFieldClasses.readonly,
    );
  });

  it('should mark the input required', () => {
    expect(
      mountTrigger({ required: true }).get('input').attributes('aria-required'),
    ).toBe('true');
  });

  it('should render the suffix slot', () => {
    const wrapper = mountTrigger({}, { suffix: () => h('span', 'suffix') });

    expect(wrapper.get(`.${textFieldClasses.suffix}`).text()).toBe('suffix');
  });

  it('should forward inputProps to the input element', () => {
    const wrapper = mountTrigger({ inputProps: { name: 'start-date' } });

    expect(wrapper.get('input').attributes('name')).toBe('start-date');
  });

  it('should emit the formatted value on change', async () => {
    const onChange = vi.fn();
    const wrapper = mountTrigger({ onChange, value: '2026-09-1D' });
    const element = wrapper.get('input').element as HTMLInputElement;

    element.setSelectionRange(9, 9);
    await wrapper.get('input').trigger('keydown', { key: '5' });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(typeof onChange.mock.calls[0][0]).toBe('string');
  });
});

function mountRangeTrigger(props: Record<string, unknown> = {}): VueWrapper {
  return mount(MznCalendarConfigProvider, {
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: {
      default: () =>
        h(MznRangePickerTrigger, { format: 'YYYY-MM-DD', ...props }),
    },
  });
}

describe('<MznRangePickerTrigger />', () => {
  it('should render two labelled inputs and the arrow between them', () => {
    const wrapper = mountRangeTrigger();
    const inputs = wrapper.findAll('input');

    expect(wrapper.get(`.${textFieldClasses.host}`).classes()).toContain(
      classes.hostRange,
    );
    expect(inputs.map((input) => input.attributes('aria-label'))).toEqual([
      'Start date',
      'End date',
    ]);
    expect(
      wrapper.get(`.${classes.arrowIcon}`).attributes('data-icon-name'),
    ).toBe('long-tail-arrow-right');
  });

  it('should default the suffix to a calendar icon that emits iconClick', async () => {
    const onIconClick = vi.fn();
    const wrapper = mountRangeTrigger({ onIconClick });
    const suffix = wrapper.get(`.${textFieldClasses.suffix}`);

    expect(suffix.get('.mzn-icon').attributes('data-icon-name')).toBe(
      'calendar',
    );

    await suffix.get('.mzn-icon').trigger('click');

    expect(onIconClick).toHaveBeenCalledTimes(1);
  });

  it('should let suffixActionIcon replace the calendar icon', () => {
    const wrapper = mountRangeTrigger({
      suffixActionIcon: h('span', { class: 'custom-suffix' }, 'x'),
    });

    expect(wrapper.find('.custom-suffix').exists()).toBe(true);
    expect(wrapper.find(`.${textFieldClasses.suffix} .mzn-icon`).exists()).toBe(
      false,
    );
  });

  it('should render the values of both inputs', () => {
    const wrapper = mountRangeTrigger({
      inputFromValue: '2026-09-15',
      inputToValue: '2026-09-20',
    });
    const displays = wrapper.findAll(`.${classes.formattedInputDisplay}`);

    expect(displays[0].text()).toBe('2026-09-15');
    expect(displays[1].text()).toBe('2026-09-20');
  });

  it('should emit inputFromChange with the formatted value and raw digits', async () => {
    const onInputFromChange = vi.fn();
    const wrapper = mountRangeTrigger({
      inputFromValue: '2026-09-1D',
      onInputFromChange,
    });
    const element = wrapper.findAll('input')[0].element as HTMLInputElement;

    element.setSelectionRange(9, 9);
    await wrapper.findAll('input')[0].trigger('keydown', { key: '5' });

    expect(onInputFromChange).toHaveBeenCalledTimes(1);
    expect(onInputFromChange.mock.calls[0][1]).toBe('20260915');
  });
});
