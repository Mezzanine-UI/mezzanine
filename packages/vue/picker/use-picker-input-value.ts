import { ref } from 'vue';
import type { Ref } from 'vue';

export interface UsePickerInputValueProps {
  /** The value the input starts with when no `initialValue` is given. */
  defaultValue?: string;
  /** The value the input starts with; wins over `defaultValue`. */
  initialValue?: string;
  /** Called with the new text whenever the input changes. */
  onChange?: (val: string) => void;
}

export interface UsePickerInputValueResult {
  /** Binds to the input's `change`/`input` event. */
  inputChangeHandler: (event: Event) => void;
  /** The text the input is currently showing. */
  inputValue: Ref<string>;
  /** Sets the text without notifying `onChange`. */
  onChange: (val: string) => void;
}

/**
 * 保存 picker 輸入框目前的文字。
 *
 * `inputChangeHandler` 會同時更新內部狀態並通知 `onChange`；
 * 回傳的 `onChange` 則只設值、不通知，供外部同步用。
 *
 * @example
 * ```ts
 * const { inputChangeHandler, inputValue } = usePickerInputValue({
 *   onChange: (text) => console.warn(text),
 * });
 * ```
 *
 * @see usePickerValue 建於此之上、同時保存日期值的版本
 */
export function usePickerInputValue(
  props?: UsePickerInputValueProps,
): UsePickerInputValueResult {
  const {
    defaultValue = '',
    initialValue = '',
    onChange: onChangeProp,
  } = props || {};

  const value = ref<string>(initialValue || defaultValue);

  const setValue = (val: string): void => {
    value.value = val;
  };

  const onChange = (val: string): void => {
    setValue(val);

    if (onChangeProp) {
      onChangeProp(val);
    }
  };

  const onInputChange = (event: Event): void => {
    onChange((event.target as HTMLInputElement).value);
  };

  return {
    inputValue: value,
    inputChangeHandler: onInputChange,
    onChange: setValue,
  };
}

export default usePickerInputValue;
