import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import type { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import moment from 'moment';
import MznCalendarConfigProvider from './calendar-config-provider.vue';
import { useCalendarControls } from './use-calendar-controls';
import { useCalendarModeStack } from './use-calendar-mode-stack';
import { useRangeScan, type UseRangeScanProps } from './use-range-scan';

/**
 * Runs a composable inside a provider, the way a calendar would, and hands
 * back what it returned.
 */
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

describe('useCalendarModeStack', () => {
  it('should start at the given mode', () => {
    expect(useCalendarModeStack('week').currentMode.value).toBe('week');
  });

  it('should push and pop', () => {
    const { currentMode, popModeStack, pushModeStack } =
      useCalendarModeStack('day');

    pushModeStack('month');
    expect(currentMode.value).toBe('month');

    pushModeStack('year');
    expect(currentMode.value).toBe('year');

    popModeStack();
    expect(currentMode.value).toBe('month');

    popModeStack();
    expect(currentMode.value).toBe('day');
  });

  it('should never pop the initial mode', () => {
    const { currentMode, popModeStack } = useCalendarModeStack('day');

    popModeStack();
    popModeStack();

    expect(currentMode.value).toBe('day');
  });
});

describe('useCalendarControls', () => {
  const referenceDate = '2026-09-15T00:00:00.000Z';

  it('should step by a month and a year in day mode', () => {
    const {
      onPrev,
      onNext,
      onDoublePrev,
      onDoubleNext,
      referenceDate: date,
    } = withCalendarContext(() => useCalendarControls(referenceDate, 'day'));

    onPrev.value?.();
    expect(moment(date.value).format('YYYY-MM')).toBe('2026-08');

    onNext.value?.();
    onNext.value?.();
    expect(moment(date.value).format('YYYY-MM')).toBe('2026-10');

    onDoublePrev.value?.();
    expect(moment(date.value).format('YYYY-MM')).toBe('2025-10');

    onDoubleNext.value?.();
    expect(moment(date.value).format('YYYY-MM')).toBe('2026-10');
  });

  it('should offer no double step in month mode', () => {
    const { onDoubleNext, onDoublePrev, onNext } = withCalendarContext(() =>
      useCalendarControls(referenceDate, 'month'),
    );

    expect(onDoublePrev.value).toBeUndefined();
    expect(onDoubleNext.value).toBeUndefined();
    expect(onNext.value).toBeTypeOf('function');
  });

  it('should step by twenty years in year mode', () => {
    const { onNext, referenceDate: date } = withCalendarContext(() =>
      useCalendarControls(referenceDate, 'year'),
    );

    onNext.value?.();

    expect(moment(date.value).format('YYYY')).toBe('2046');
  });

  it('should follow the reference date it was given', async () => {
    const source = ref<DateType>(referenceDate);
    const { referenceDate: date } = withCalendarContext(() =>
      useCalendarControls(() => source.value),
    );

    source.value = '2027-01-01T00:00:00.000Z';
    await Promise.resolve();

    expect(moment(date.value).format('YYYY-MM-DD')).toBe('2027-01-01');
  });

  it('should push month and year modes and pop back', () => {
    const {
      currentMode,
      onMonthControlClick,
      onYearControlClick,
      popModeStack,
    } = withCalendarContext(() => useCalendarControls(referenceDate, 'day'));

    onMonthControlClick();
    expect(currentMode.value).toBe('month');

    onYearControlClick();
    expect(currentMode.value).toBe('year');

    popModeStack();
    popModeStack();
    expect(currentMode.value).toBe('day');
  });
});

describe('useRangeScan', () => {
  const scanWith = (options: UseRangeScanProps) =>
    withCalendarContext(() => useRangeScan(() => options));

  it('should report clear without a predicate, whatever the range', () => {
    const scan = scanWith({ mode: 'day' });

    expect(scan('1900-01-01', '2100-01-01')).toBe('clear');
  });

  it('should report clear when no unit in the range is disabled', () => {
    const scan = scanWith({
      isDateDisabled: (date) =>
        moment(date).format('YYYY-MM-DD') === '2026-10-01',
      mode: 'day',
    });

    expect(scan('2026-09-01', '2026-09-30')).toBe('clear');
  });

  it('should report disabled when a unit in the range is disabled', () => {
    const scan = scanWith({
      isDateDisabled: (date) =>
        moment(date).format('YYYY-MM-DD') === '2026-09-20',
      mode: 'day',
    });

    expect(scan('2026-09-01', '2026-09-30')).toBe('disabled');
  });

  it('should scan whichever way round the ends are given', () => {
    const scan = scanWith({
      isDateDisabled: (date) =>
        moment(date).format('YYYY-MM-DD') === '2026-09-20',
      mode: 'day',
    });

    expect(scan('2026-09-30', '2026-09-01')).toBe('disabled');
  });

  it('should report incomplete when the range exceeds the step cap', () => {
    const scan = scanWith({
      isDateDisabled: () => false,
      mode: 'day',
    });

    expect(scan('2000-01-01', '2020-09-11')).toBe('incomplete');
  });

  it('should step by the mode own unit, so the same span fits in month mode', () => {
    const scan = scanWith({
      isMonthDisabled: () => false,
      mode: 'month',
    });

    expect(scan('2000-01-01', '2020-09-11')).toBe('clear');
  });

  it('should consult the predicate of the current mode only', () => {
    const isDateDisabled = vi.fn(() => true);
    const scan = scanWith({
      isDateDisabled,
      mode: 'month' as CalendarMode,
    });

    expect(scan('2026-09-01', '2026-10-01')).toBe('clear');
    expect(isDateDisabled).not.toHaveBeenCalled();
  });
});
