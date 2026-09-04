import type { ComputedRef, Ref } from 'vue';
import {
  useInputControlValue,
  type UseInputControlValueOptions,
} from './use-input-control-value';

export interface UseInputWithClearControlValueOptions
  extends UseInputControlValueOptions {
  /** The input element, needed to synthesise the clearing change event. */
  elementRef: Ref<HTMLInputElement | HTMLTextAreaElement | null>;
}

export interface InputWithClearControlValue {
  /** Bind to the input's `input`/`change` event. */
  onChange: (event: Event) => void;
  /** Bind to the clear button; reports an empty value through `onChange`. */
  onClear: (event: MouseEvent) => void;
  /** The text to render. */
  value: ComputedRef<string>;
}

/**
 * 在 useInputControlValue 之上加一個清除處理器。
 *
 * 清除時會暫時把輸入框的值設成空字串、送出一次 change，再還原 —— 這樣受控流程拿到的
 * `event.target.value` 才會是空字串，與 React 版的做法相同。
 *
 * @example
 * ```ts
 * const { onChange, onClear, value } = useInputWithClearControlValue({
 *   elementRef: input,
 *   value: () => props.value,
 * });
 * ```
 *
 * @see MznInput 使用這個 composable 的元件
 */
export function useInputWithClearControlValue(
  options: UseInputWithClearControlValueOptions,
): InputWithClearControlValue {
  const { elementRef, ...rest } = options;
  const { onChange, value } = useInputControlValue(rest);

  function onClear(event: MouseEvent): void {
    const target = elementRef.value;

    if (!target) return;

    const originalValue = target.value;

    /**
     * Change target value so `event.target.value` is '' while clearing,
     * then put the original back.
     */
    target.value = '';
    onChange(
      Object.assign(new Event('change'), {
        target,
        currentTarget: target,
        originalEvent: event,
      }),
    );
    target.value = originalValue;
  }

  return { onChange, onClear, value };
}
