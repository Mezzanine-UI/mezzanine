import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import { usePickerInputValue } from './use-picker-input-value';
import { usePickerValue } from './use-picker-value';

function withCalendarContext<T>(setup: () => T): T {
  let result!: T;

  mount(MznCalendarConfigProvider, {
    props: { locale: 'en-US', methods: CalendarMethodsMoment },
    slots: {
      default: () =>
        h(
          defineComponent({
            setup() {
              result = setup();

              return () => null;
            },
          }),
        ),
    },
  });

  return result;
}

describe('usePickerInputValue', () => {
  it('should start from initialValue, falling back to defaultValue', () => {
    expect(usePickerInputValue().inputValue.value).toBe('');
    expect(usePickerInputValue({ defaultValue: 'a' }).inputValue.value).toBe(
      'a',
    );
    expect(
      usePickerInputValue({ defaultValue: 'a', initialValue: 'b' }).inputValue
        .value,
    ).toBe('b');
  });

  it('should notify onChange from the input handler only', () => {
    const onChange = vi.fn();
    const {
      inputChangeHandler,
      inputValue,
      onChange: setValue,
    } = usePickerInputValue({ onChange });

    inputChangeHandler({
      target: { value: 'typed' },
    } as unknown as Event);

    expect(inputValue.value).toBe('typed');
    expect(onChange).toHaveBeenCalledWith('typed');

    setValue('set');

    expect(inputValue.value).toBe('set');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('usePickerValue', () => {
  const format = 'YYYY-MM-DD';

  it('should format the controlled value for the input', () => {
    const { inputValue, value } = withCalendarContext(() =>
      usePickerValue({
        format,
        inputRef: ref(null),
        value: '2026-09-15T00:00:00.000Z',
      }),
    );

    expect(value.value).toBe('2026-09-15T00:00:00.000Z');
    expect(inputValue.value).toBe(
      moment('2026-09-15T00:00:00.000Z').format(format),
    );
  });

  it('should follow the controlled value', async () => {
    const source = ref<string | undefined>('2026-09-15T00:00:00.000Z');
    const { value } = withCalendarContext(() =>
      usePickerValue({
        format,
        inputRef: ref(null),
        value: () => source.value,
      }),
    );

    source.value = '2026-10-01T00:00:00.000Z';
    await nextTick();

    expect(value.value).toBe('2026-10-01T00:00:00.000Z');
  });

  it('should set value and input together through onChange', () => {
    const { inputValue, onChange, value } = withCalendarContext(() =>
      usePickerValue({ format, inputRef: ref(null) }),
    );

    onChange('2026-09-15T00:00:00.000Z');

    expect(value.value).toBe('2026-09-15T00:00:00.000Z');
    expect(inputValue.value).toBe(
      moment('2026-09-15T00:00:00.000Z').format(format),
    );

    onChange(undefined);

    expect(value.value).toBeUndefined();
    expect(inputValue.value).toBe('');
  });

  it('should blur and restore the controlled value on Enter', () => {
    const input = document.createElement('input');
    const blur = vi.spyOn(input, 'blur');
    const { onKeyDown, value } = withCalendarContext(() =>
      usePickerValue({
        format,
        inputRef: ref(input),
        value: '2026-09-15T00:00:00.000Z',
      }),
    );

    value.value = undefined;
    onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(blur).toHaveBeenCalledTimes(1);
    expect(value.value).toBe('2026-09-15T00:00:00.000Z');
  });

  it('should ignore keys pressed while composing', () => {
    const input = document.createElement('input');
    const blur = vi.spyOn(input, 'blur');
    const { onKeyDown } = withCalendarContext(() =>
      usePickerValue({ format, inputRef: ref(input) }),
    );

    onKeyDown(
      new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }),
    );

    expect(blur).not.toHaveBeenCalled();
  });

  it('should restore the controlled value on blur when nothing valid is held', () => {
    const { onBlur, value } = withCalendarContext(() =>
      usePickerValue({
        format,
        inputRef: ref(null),
        value: '2026-09-15T00:00:00.000Z',
      }),
    );

    value.value = undefined;
    onBlur();

    expect(value.value).toBe('2026-09-15T00:00:00.000Z');
  });
});
