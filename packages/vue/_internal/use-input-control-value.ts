import type { ComputedRef } from 'vue';
import { useControlValueState } from './use-control-value-state';

export interface UseInputControlValueOptions {
  /** The text the input starts with while uncontrolled. */
  defaultValue?: () => string | undefined;
  /** Called with the original DOM event after the text actually moved. */
  onChange?: (event: Event) => void;
  /** Reads the controlled text. `undefined` means uncontrolled. */
  value: () => string | undefined;
}

export interface InputControlValue {
  /** Bind to the input's `input`/`change` event. */
  onChange: (event: Event) => void;
  /** The text to render. */
  value: ComputedRef<string>;
}

const equalityFn = (a: string, b: string): boolean => a === b;

/**
 * 管理輸入框文字的受控狀態 composable。
 *
 * 值沒有真的改變時不會通知呼叫端，與 React 版一致。
 *
 * @example
 * ```ts
 * const { onChange, value } = useInputControlValue({
 *   onChange: (event) => emit('change', event),
 *   value: () => props.value,
 * });
 * ```
 *
 * @see useInputWithClearControlValue 多一個清除處理器的版本
 */
export function useInputControlValue(
  options: UseInputControlValueOptions,
): InputControlValue {
  const { defaultValue, onChange: onChangeProp, value: valueProp } = options;
  const { setValue, value } = useControlValueState<string>({
    defaultValue: defaultValue?.() ?? '',
    equalityFn,
    value: valueProp,
  });

  function onChange(event: Event): void {
    const nextValue = (event.target as HTMLInputElement | HTMLTextAreaElement)
      .value;

    if (!equalityFn(value.value, nextValue)) {
      setValue(nextValue);

      if (onChangeProp) {
        onChangeProp(event);
      }
    }
  }

  return { onChange, value };
}
