import { ChangeEventHandler } from 'react';
import { useLastCallback } from '../hooks/useLastCallback';
import {
  useControlValueState,
  UseControlValueStateProps,
} from './useControlValueState';

export interface UseInputControlValueProps<
  E extends HTMLInputElement | HTMLTextAreaElement,
> extends Omit<
    UseControlValueStateProps<string>,
    'defaultValue' | 'equalityFn'
  > {
  defaultValue?: string;
  onChange?: ChangeEventHandler<E>;
}

const equalityFn = (a: string, b: string) => a === b;

/**
 * 管理 Input／Textarea 文字值的受控狀態 Hook。
 *
 * 支援受控（`value`）與非受控（`defaultValue`）兩種用法，
 * 回傳當前文字值與穩定的 `onChange` 事件處理器。
 *
 * @example
 * ```tsx
 * import { useInputControlValue } from '@mezzanine-ui/react';
 *
 * function MyInput({ value, onChange }) {
 *   const [inputValue, handleChange] = useInputControlValue({ value, onChange });
 *   return <input value={inputValue} onChange={handleChange} />;
 * }
 * ```
 *
 * @see {@link Input} 搭配的元件
 * @see {@link Textarea} 搭配的元件
 */
export function useInputControlValue<
  E extends HTMLInputElement | HTMLTextAreaElement,
>(props: UseInputControlValueProps<E>) {
  const { defaultValue = '', onChange: onChangeProp, value: valueProp } = props;
  const [value, setValue] = useControlValueState({
    defaultValue,
    equalityFn,
    value: valueProp,
  });
  const onChange = useLastCallback<ChangeEventHandler<E>>((event) => {
    const nextValue = event.target.value;

    if (!equalityFn(value, nextValue)) {
      setValue(nextValue);

      if (onChangeProp) {
        onChangeProp(event);
      }
    }
  });

  return [value, onChange] as const;
}
