import { computed, ref, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import type {
  RangePickerPickingValue,
  RangePickerValue,
} from '@mezzanine-ui/core/picker';
import { useCalendarContext } from '../calendar/calendar-context';

export interface UseDateRangePickerValueProps {
  /**
   * The format pattern for the inputs (e.g., "YYYY-MM-DD")
   */
  format: MaybeRefOrGetter<string>;
  /**
   * Function to check if there are disabled dates in the range
   *
   * @deprecated `MznDateRangePicker` no longer supplies this. Deciding whether
   * a range covers a disabled unit moved into `MznRangeCalendar`, where a
   * shared, bounded scan drives both highlighting and calendar selection.
   * Still honoured for external callers of this composable.
   */
  hasDisabledDateInRange?: (start: DateType, end: DateType) => boolean;
  /**
   * The 'from' input element
   */
  inputFromRef: Ref<HTMLInputElement | null>;
  /**
   * The 'to' input element, focused when a new range is started
   */
  inputToRef: Ref<HTMLInputElement | null>;
  /**
   * Calendar mode
   */
  mode?: MaybeRefOrGetter<CalendarMode | undefined>;
  /**
   * Change handler called when range is complete
   */
  onChange?: (value?: RangePickerValue) => void;
  /**
   * Controlled value
   */
  value?: MaybeRefOrGetter<RangePickerValue | undefined>;
}

export interface UseDateRangePickerValueResult {
  /** The anchors the calendars paint, hover preview folded in. */
  calendarValue: ComputedRef<DateType[] | undefined>;
  /**
   * @deprecated Unused by `MznDateRangePicker` — see `hasDisabledDateInRange`.
   * Note that the returned value does not depend on the date passed in; it
   * describes the range as a whole.
   */
  checkIsInRange: (date: DateType) => boolean;
  /** The anchors the user has committed, with no hover preview mixed in. */
  committedCalendarValue: ComputedRef<DateType[] | undefined>;
  /** The formatted hover preview for the 'from' input. */
  hoverFromValue: ComputedRef<string | undefined>;
  /** The formatted hover preview for the 'to' input. */
  hoverToValue: ComputedRef<string | undefined>;
  /** The date currently under the pointer. */
  hoverValue: Ref<DateType | undefined>;
  /** The formatted text of the 'from' input. */
  inputFromValue: ComputedRef<string>;
  /** The formatted text of the 'to' input. */
  inputToValue: ComputedRef<string>;
  /** Takes what the calendar committed, sorting and completing the range. */
  onCalendarChange: (rangeValue: [DateType, DateType | undefined]) => void;
  /** Records the hovered date while the range is unfinished. */
  onCalendarHover: (date: DateType) => void;
  /** Sets both ends at once, sorting them. */
  onChange: (
    target?: RangePickerPickingValue,
  ) => RangePickerPickingValue | undefined;
  /** Empties both ends and the preview. */
  onClear: () => void;
  /** Blur handler for the 'from' input. */
  onFromBlur: () => void;
  /** Focus handler for the 'from' input. */
  onFromFocus: () => void;
  /** Drops the hover preview. */
  onHoverClear: () => void;
  /** Takes what was typed into the 'from' input. */
  onInputFromChange: (formattedValue: string) => void;
  /** Takes what was typed into the 'to' input. */
  onInputToChange: (formattedValue: string) => void;
  /** Blur handler for the 'to' input. */
  onToBlur: () => void;
  /** Focus handler for the 'to' input. */
  onToFocus: () => void;
  /** The two ends as the picker currently holds them. */
  value: ComputedRef<RangePickerPickingValue>;
}

/**
 * 管理日期區間選取器的值狀態與互動邏輯的 composable。
 *
 * 協調「起始日期輸入框」、「結束日期輸入框」與「日曆」三者之間的狀態同步，
 * 支援鍵盤輸入、日曆點選、hover 預覽以及清除功能。輸入顛倒的兩端會自動對調。
 *
 * @example
 * ```ts
 * const {
 *   calendarValue, inputFromValue, inputToValue,
 *   onCalendarChange, onInputFromChange, onInputToChange, onClear,
 * } = useDateRangePickerValue({
 *   format: 'YYYY-MM-DD',
 *   inputFromRef,
 *   inputToRef,
 *   value: () => props.value,
 *   onChange: (value) => emit('change', value),
 * });
 * ```
 *
 * @see MznDateRangePicker 搭配的元件
 */
export function useDateRangePickerValue({
  format,
  hasDisabledDateInRange,
  inputFromRef: _inputFromRef,
  inputToRef,
  mode,
  onChange: onChangeProp,
  value: valueProp,
}: UseDateRangePickerValueProps): UseDateRangePickerValueResult {
  const calendar = useCalendarContext();

  const internalFrom = ref<DateType | undefined>(toValue(valueProp)?.[0]);
  const internalTo = ref<DateType | undefined>(toValue(valueProp)?.[1]);

  // Track if user is currently selecting a new range
  // When selecting, we use internal state; otherwise, we prefer valueProp
  const isSelecting = ref(false);

  const from = computed((): DateType | undefined =>
    isSelecting.value
      ? internalFrom.value
      : (toValue(valueProp)?.[0] ?? internalFrom.value),
  );
  const to = computed((): DateType | undefined =>
    isSelecting.value
      ? internalTo.value
      : (toValue(valueProp)?.[1] ?? internalTo.value),
  );
  const value = computed(
    (): RangePickerPickingValue =>
      [from.value, to.value] as RangePickerPickingValue,
  );

  const formatDate = (date: DateType | undefined): string => {
    if (!date) return '';

    return calendar.value.formatToString(
      calendar.value.locale,
      date,
      toValue(format),
    );
  };

  const sortValues = (v1: DateType, v2: DateType): [DateType, DateType] =>
    calendar.value.isBefore(v1, v2) ? [v1, v2] : [v2, v1];

  const hoverValue = ref<DateType | undefined>(undefined);

  function onInputFromChange(formattedValue: string): void {
    if (formattedValue) {
      isSelecting.value = true;

      if (to.value && calendar.value.isBefore(to.value, formattedValue)) {
        const previousTo = to.value;

        internalFrom.value = previousTo;
        internalTo.value = formattedValue;

        // Range is complete, trigger onChange (only in immediate mode)
        onChangeProp?.([previousTo, formattedValue]);
      } else {
        internalFrom.value = formattedValue;

        // If to is also set, range is complete (only trigger in immediate mode)
        if (to.value) {
          onChangeProp?.([formattedValue, to.value]);
        }
      }
    } else {
      internalFrom.value = undefined;
    }

    hoverValue.value = undefined;
  }

  function onInputToChange(formattedValue: string): void {
    if (formattedValue) {
      isSelecting.value = true;

      if (from.value && calendar.value.isBefore(formattedValue, from.value)) {
        const previousFrom = from.value;

        internalTo.value = previousFrom;
        internalFrom.value = formattedValue;

        // Range is complete, trigger onChange (only in immediate mode)
        onChangeProp?.([formattedValue, previousFrom]);
      } else {
        internalTo.value = formattedValue;

        // If from is also set, range is complete (only trigger in immediate mode)
        if (from.value) {
          onChangeProp?.([from.value, formattedValue]);
        }
      }
    } else {
      internalTo.value = undefined;
    }

    hoverValue.value = undefined;
  }

  function onCalendarChange(
    rangeValue: [DateType, DateType | undefined],
  ): void {
    const [newFrom, newTo] = rangeValue;
    const hadRange = Boolean(from.value && to.value);

    internalFrom.value = newFrom;

    if (newTo) {
      const adjustedTo =
        toValue(mode) === 'week' ? calendar.value.addDay(newTo, 6) : newTo;

      internalTo.value = adjustedTo;

      if (newFrom && adjustedTo) {
        const [sortedFrom, sortedTo] = sortValues(newFrom, adjustedTo);

        onChangeProp?.([sortedFrom, sortedTo]);
      }
    } else {
      internalTo.value = undefined;
      isSelecting.value = true;

      // 開始新的選取，則先清除值
      if (hadRange) {
        onChangeProp?.(undefined);
      }

      inputToRef.value?.focus();
    }

    hoverValue.value = undefined;
  }

  function onChange(
    target?: RangePickerPickingValue,
  ): RangePickerPickingValue | undefined {
    // Reset selecting state when value is explicitly changed (e.g., cancel/close)
    isSelecting.value = false;

    if (!target) {
      internalFrom.value = undefined;
      internalTo.value = undefined;

      return undefined;
    }

    const [newFrom, newTo] = target;

    if (newFrom && newTo) {
      const sorted = sortValues(newFrom, newTo);

      internalFrom.value = sorted[0];
      internalTo.value = sorted[1];

      return sorted;
    }

    internalFrom.value = newFrom;
    internalTo.value = newTo;

    return target;
  }

  const anchor1 = computed((): DateType | undefined => from.value || to.value);
  const anchor2 = computed((): DateType | undefined =>
    from.value && to.value ? to.value : hoverValue.value,
  );

  /**
   * The anchors the user has actually committed, with no hover preview mixed
   * in.
   *
   * Anything deciding *how far the selection has got* must read this rather
   * than `calendarValue`: that one folds the hovered date into its second
   * slot, which makes a half-finished range look finished.
   */
  const committedCalendarValue = computed((): DateType[] | undefined => {
    if (from.value && to.value) {
      return [from.value, to.value];
    }

    const onlyAnchor = from.value || to.value;

    return onlyAnchor ? [onlyAnchor] : undefined;
  });

  const calendarValue = computed((): DateType[] | undefined => {
    if (anchor1.value && anchor2.value) {
      return [anchor1.value, anchor2.value];
    }

    if (anchor1.value) {
      return [anchor1.value];
    }

    return undefined;
  });

  /**
   * Check if date is in range, considering disabled dates
   * Returns a function that can be used as isDateInRange handler
   */
  function checkIsInRange(): boolean {
    if (!anchor1.value || !anchor2.value) return false;

    // Check if the range crosses any disabled dates
    if (hasDisabledDateInRange?.(anchor1.value, anchor2.value)) {
      return false;
    }

    return true;
  }

  return {
    calendarValue,
    checkIsInRange,
    committedCalendarValue,
    hoverValue,
    hoverFromValue: computed((): string | undefined =>
      !from.value ? formatDate(hoverValue.value) : undefined,
    ),
    hoverToValue: computed((): string | undefined =>
      from.value && !to.value ? formatDate(hoverValue.value) : undefined,
    ),
    inputFromValue: computed((): string => formatDate(from.value)),
    inputToValue: computed((): string => formatDate(to.value)),
    onCalendarChange,
    /** React withholds the handler entirely once the range is complete. */
    onCalendarHover: (date: DateType) => {
      if (from.value && to.value) return;

      hoverValue.value = date;
    },
    onChange,
    onClear: () => {
      internalFrom.value = undefined;
      internalTo.value = undefined;
      hoverValue.value = undefined;
      isSelecting.value = false;
      onChangeProp?.(undefined);
    },
    onFromBlur: () => {
      // Optional: add blur logic
    },
    onFromFocus: () => {
      // Optional: add focus logic
    },
    onHoverClear: () => {
      hoverValue.value = undefined;
    },
    onInputFromChange,
    onInputToChange,
    onToBlur: () => {
      // Optional: add blur logic
    },
    onToFocus: () => {
      // Optional: add focus logic
    },
    value,
  };
}
