import { computed, ref, toValue, watch } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { isImeComposing } from '@mezzanine-ui/core/utils';
import { useCalendarContext } from '../calendar/calendar-context';
import { usePickerInputValue } from './use-picker-input-value';

export interface UsePickerValueProps {
  /** The value the picker starts with when uncontrolled. */
  defaultValue?: DateType;
  /** The format the input text is rendered in. */
  format: MaybeRefOrGetter<string>;
  /** The input element, blurred when Enter or Escape is pressed. */
  inputRef: Ref<HTMLInputElement | null>;
  /** The controlled value. */
  value?: MaybeRefOrGetter<DateType | undefined>;
}

export interface UsePickerValueResult {
  /** The formatted text for the input. */
  inputValue: ComputedRef<string>;
  /** Restores the last valid value when the input loses focus. */
  onBlur: () => void;
  /** Sets the value and the input text together. */
  onChange: (val?: DateType) => void;
  /** Binds to the input's change event. */
  onInputChange: (event: Event) => void;
  /**
   * Blurs and restores on Enter or Escape, ignoring IME composition.
   *
   * Spelled Vue's way, not React's `onKeyDown`: the result of this composable
   * ends up in a prop object bound to an `<input>`, and Vue hyphenates a
   * handler key into its event name, so `onKeyDown` would listen for a
   * `key-down` event that never fires.
   */
  onKeydown: (event: KeyboardEvent) => void;
  /** The value the picker currently holds. */
  value: Ref<DateType | undefined>;
}

/**
 * 保存 picker 內部的日期值與輸入框文字。
 *
 * 輸入框顯示的是依 `format` 格式化後的文字；按下 Enter 或 Escape 會讓輸入框失焦，
 * 並在目前沒有有效值時還原成外部傳入的值，失焦時也一樣。IME 組字中的按鍵會被忽略。
 *
 * @example
 * ```ts
 * const { inputValue, onBlur, onInputChange, onKeyDown, value } = usePickerValue({
 *   format: 'YYYY-MM-DD',
 *   inputRef,
 *   value: () => props.value,
 * });
 * ```
 *
 * @see MznPickerTrigger 使用這個值的輸入框
 */
export function usePickerValue({
  defaultValue,
  format,
  inputRef,
  value: valueProp,
}: UsePickerValueProps): UsePickerValueResult {
  const calendar = useCalendarContext();
  const inputDefaultValue = defaultValue
    ? calendar.value.formatToString(
        calendar.value.locale,
        defaultValue,
        toValue(format),
      )
    : '';

  const value = ref<DateType | undefined>(toValue(valueProp));

  const onChange = (val?: DateType): void => {
    value.value = val;
  };

  const onInputChange = (val: string): void => {
    onChange(val);
  };

  const {
    inputChangeHandler,
    inputValue,
    onChange: setInputValue,
  } = usePickerInputValue({
    defaultValue: inputDefaultValue,
    onChange: onInputChange,
  });

  watch(
    [
      () => toValue(valueProp),
      () => toValue(format),
      () => calendar.value.locale,
    ],
    () => {
      setInputValue(toValue(valueProp) || '');
      onChange(toValue(valueProp));
    },
    { immediate: true },
  );

  const onSyncInputAndStateChange = (val?: DateType): void => {
    setInputValue(val || '');
    value.value = val;
  };

  const guardValidDateTypeOnEvents = (): void => {
    if (!value.value) {
      onSyncInputAndStateChange(toValue(valueProp));
    }
  };

  const guardValidDateTypeOnKeyDown = (event: KeyboardEvent): void => {
    if (isImeComposing(event)) return;

    if (event.key === 'Enter' || event.key === 'Escape') {
      inputRef.value?.blur();

      guardValidDateTypeOnEvents();
    }
  };

  return {
    inputValue: computed((): string =>
      inputValue.value
        ? calendar.value.formatToString(
            calendar.value.locale,
            inputValue.value,
            toValue(format),
          )
        : '',
    ),
    onBlur: guardValidDateTypeOnEvents,
    onChange: onSyncInputAndStateChange,
    onInputChange: inputChangeHandler,
    onKeydown: guardValidDateTypeOnKeyDown,
    value,
  };
}
