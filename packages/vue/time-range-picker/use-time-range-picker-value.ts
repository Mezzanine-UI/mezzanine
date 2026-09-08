import { computed, ref, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { useCalendarContext } from '../calendar/calendar-context';

export type TimeRangePickerValue = [DateType | undefined, DateType | undefined];

export interface UseTimeRangePickerValueProps {
  /**
   * The format pattern for the inputs (e.g., "HH:mm:ss")
   */
  format: MaybeRefOrGetter<string>;
  /**
   * Change handler called when value changes
   */
  onChange?: (value?: TimeRangePickerValue) => void;
  /**
   * Controlled value
   */
  value?: MaybeRefOrGetter<TimeRangePickerValue | undefined>;
}

export interface UseTimeRangePickerValueResult {
  /** Which of the two inputs the user is in, if either. */
  focusedInput: Ref<'from' | 'to' | null>;
  /** The formatted text of the 'from' input. */
  inputFromValue: ComputedRef<string>;
  /** The formatted text of the 'to' input. */
  inputToValue: ComputedRef<string>;
  /** Sets both ends at once. */
  onChange: (target?: TimeRangePickerValue) => TimeRangePickerValue | undefined;
  /** Empties both ends. */
  onClear: () => void;
  /** Marks the 'from' input as the one being edited. */
  onFromFocus: () => void;
  /** Takes what was typed into the 'from' input. */
  onInputFromChange: (formattedValue: string | undefined) => void;
  /** Takes what was typed into the 'to' input. */
  onInputToChange: (formattedValue: string | undefined) => void;
  /** Reverts whatever the panel was editing. */
  onPanelCancel: () => void;
  /** Records the panel's pick for the focused input, without committing it. */
  onPanelChange: (newTime: DateType | undefined) => void;
  /** Commits the panel's pick for the focused input. */
  onPanelConfirm: () => void;
  /** Marks the 'to' input as the one being edited. */
  onToFocus: () => void;
  /** What the panel shows: the pending pick, else the committed value. */
  panelValue: ComputedRef<DateType | undefined>;
  /** The two ends as the picker currently holds them. */
  value: ComputedRef<TimeRangePickerValue>;
}

/**
 * 管理時間區間選取器的值狀態。
 *
 * 面板上的調整先存在 pending 值裡，按下 Ok 才會寫回並通知呼叫端；
 * 因此受控的 `value` 不會在面板開啟時把使用者正在調的值蓋掉。
 * 直接在輸入框打字則會立即送出。
 *
 * @example
 * ```ts
 * const { inputFromValue, inputToValue, onPanelConfirm, panelValue } =
 *   useTimeRangePickerValue({
 *     format: 'HH:mm:ss',
 *     onChange: (value) => emit('change', value),
 *     value: () => props.value,
 *   });
 * ```
 *
 * @see MznTimeRangePicker 搭配的元件
 */
export function useTimeRangePickerValue({
  format,
  onChange: onChangeProp,
  value: valueProp,
}: UseTimeRangePickerValueProps): UseTimeRangePickerValueResult {
  const calendar = useCalendarContext();

  const internalFrom = ref<DateType | undefined>(toValue(valueProp)?.[0]);
  const internalTo = ref<DateType | undefined>(toValue(valueProp)?.[1]);

  // Track which input is focused: 'from' | 'to' | null
  const focusedInput = ref<'from' | 'to' | null>(null);

  /**
   * Pending values: what the user is actively editing in the TimePanel.
   * Separate from internalFrom/To so they are never overridden by the
   * controlled value while the panel is open.
   */
  const pendingFrom = ref<DateType | undefined>(undefined);
  const pendingTo = ref<DateType | undefined>(undefined);

  const from = computed(
    (): DateType | undefined => toValue(valueProp)?.[0] ?? internalFrom.value,
  );
  const to = computed(
    (): DateType | undefined => toValue(valueProp)?.[1] ?? internalTo.value,
  );

  const formatTime = (time: DateType | undefined): string => {
    if (!time) return '';

    return calendar.value.formatToString(
      calendar.value.locale,
      time,
      toValue(format),
    );
  };

  return {
    focusedInput,
    inputFromValue: computed((): string => formatTime(from.value)),
    inputToValue: computed((): string => formatTime(to.value)),
    onChange: (target) => {
      if (!target) {
        internalFrom.value = undefined;
        internalTo.value = undefined;

        return undefined;
      }

      const [newFrom, newTo] = target;

      internalFrom.value = newFrom;
      internalTo.value = newTo;

      return target;
    },
    onClear: () => {
      internalFrom.value = undefined;
      internalTo.value = undefined;
      onChangeProp?.(undefined);
    },
    onFromFocus: () => {
      focusedInput.value = 'from';
    },
    onInputFromChange: (formattedValue) => {
      if (formattedValue) {
        internalFrom.value = formattedValue;
        onChangeProp?.([formattedValue, to.value]);

        return;
      }

      internalFrom.value = undefined;
      onChangeProp?.([undefined, to.value]);
    },
    onInputToChange: (formattedValue) => {
      if (formattedValue) {
        internalTo.value = formattedValue;
        onChangeProp?.([from.value, formattedValue]);

        return;
      }

      internalTo.value = undefined;
      onChangeProp?.([from.value, undefined]);
    },
    /**
     * Revert the pending value for the focused input (cancel).
     */
    onPanelCancel: () => {
      pendingFrom.value = undefined;
      pendingTo.value = undefined;
    },
    /**
     * Update the pending value for the focused input.
     * Uses pendingFrom/To so it is never overridden by the controlled value.
     * Does NOT notify the caller — that happens on confirm.
     */
    onPanelChange: (newTime) => {
      if (focusedInput.value === 'from') {
        pendingFrom.value = newTime;
      } else if (focusedInput.value === 'to') {
        pendingTo.value = newTime;
      }
    },
    /**
     * Commit the pending value for the focused input and notify the caller.
     */
    onPanelConfirm: () => {
      const confirmedFrom =
        focusedInput.value === 'from'
          ? (pendingFrom.value ?? from.value)
          : from.value;
      const confirmedTo =
        focusedInput.value === 'to' ? (pendingTo.value ?? to.value) : to.value;

      internalFrom.value = confirmedFrom;
      internalTo.value = confirmedTo;
      pendingFrom.value = undefined;
      pendingTo.value = undefined;

      onChangeProp?.([confirmedFrom, confirmedTo]);
    },
    onToFocus: () => {
      focusedInput.value = 'to';
    },
    /**
     * Panel value: use the pending value if being edited, fall back to
     * the committed value so the panel reflects the current selection.
     */
    panelValue: computed((): DateType | undefined => {
      if (focusedInput.value === 'from') return pendingFrom.value ?? from.value;
      if (focusedInput.value === 'to') return pendingTo.value ?? to.value;

      return undefined;
    }),
    value: computed((): TimeRangePickerValue => [from.value, to.value]),
  };
}
