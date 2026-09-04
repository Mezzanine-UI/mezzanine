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
 * React derives the change event from the click with `Object.create` and then
 * assigns `target`, which its synthetic event allows. On a native event
 * `target` and `currentTarget` are getter-only accessors inherited from
 * `Event.prototype`, so assigning to them throws — they are defined as own
 * properties here instead.
 */
function clearEvent(
  target: HTMLInputElement | HTMLTextAreaElement,
  originalEvent: MouseEvent,
): Event {
  const event = new Event('change');

  Object.defineProperties(event, {
    currentTarget: { configurable: true, value: target },
    originalEvent: { configurable: true, value: originalEvent },
    target: { configurable: true, value: target },
  });

  return event;
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
    onChange(clearEvent(target, event));
    target.value = originalValue;
  }

  return { onChange, onClear, value };
}
