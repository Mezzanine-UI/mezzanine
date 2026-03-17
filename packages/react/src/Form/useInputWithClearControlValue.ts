import { ChangeEvent, MouseEvent, RefObject } from 'react';
import {
  useInputControlValue,
  UseInputControlValueProps,
} from './useInputControlValue';

export interface UseInputWithClearControlValueProps<
  E extends HTMLInputElement | HTMLTextAreaElement,
> extends UseInputControlValueProps<E> {
  ref: RefObject<E | null>;
}

/**
 * 為可清除 Input 提供值管理的受控狀態 Hook。
 *
 * 在 `useInputControlValue` 的基礎上額外提供 `onClear` 清除處理器，
 * 透過操作原生 DOM ref 模擬一個值為空字串的 change 事件，確保受控流程完整。
 *
 * @example
 * ```tsx
 * import { useInputWithClearControlValue } from '@mezzanine-ui/react';
 *
 * const inputRef = useRef<HTMLInputElement>(null);
 * const [value, onChange, onClear] = useInputWithClearControlValue({
 *   ref: inputRef,
 *   value: controlledValue,
 *   onChange: handleChange,
 * });
 * ```
 *
 * @see {@link Input} 搭配的元件（clearable 變體）
 */
export function useInputWithClearControlValue<
  E extends HTMLInputElement | HTMLTextAreaElement,
>(props: UseInputWithClearControlValueProps<E>) {
  const { defaultValue, onChange: onChangeProp, ref, value: valueProp } = props;
  const [value, onChange] = useInputControlValue({
    defaultValue,
    onChange: onChangeProp,
    value: valueProp,
  });
  const onClear = (event: MouseEvent) => {
    const target = ref.current;

    if (target) {
      const changeEvent: ChangeEvent<E> = Object.create(event);
      const originalValue = target.value;

      changeEvent.target = target;
      changeEvent.currentTarget = target;

      /**
       * Change target ref value cause e.target.value should be '' when clear input
       * And then reset ref value
       */
      target.value = '';
      onChange(changeEvent);
      target.value = originalValue;
    }
  };

  return [value, onChange, onClear] as const;
}
