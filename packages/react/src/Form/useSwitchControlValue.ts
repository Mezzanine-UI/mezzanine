import { ChangeEventHandler } from 'react';
import { useLastCallback } from '../hooks/useLastCallback';
import { useControlValueState } from './useControlValueState';

export interface UseSwitchControlValueProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const equalityFn = (a: boolean, b: boolean) => a === b;

/**
 * 管理布林開關（checked）狀態的受控 Hook。
 *
 * 適用於任何基於 `<input type="checkbox">` 的切換元件，
 * 回傳當前勾選狀態與穩定的 `onChange` 事件處理器。
 *
 * @example
 * ```tsx
 * import { useSwitchControlValue } from '@mezzanine-ui/react';
 *
 * const [checked, handleChange] = useSwitchControlValue({
 *   defaultChecked: false,
 *   onChange: (e) => console.log(e.target.checked),
 * });
 * ```
 *
 * @see {@link Switch} 搭配的元件
 */
export function useSwitchControlValue(props: UseSwitchControlValueProps) {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onChange: onChangeProp,
  } = props;
  const [checked, setChecked] = useControlValueState({
    defaultValue: defaultChecked,
    equalityFn,
    value: checkedProp,
  });
  const onChange = useLastCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const nextChecked = event.target.checked;

      if (!equalityFn(checked, nextChecked)) {
        setChecked(nextChecked);

        if (onChangeProp) {
          onChangeProp(event);
        }
      }
    },
  );

  return [checked, onChange] as const;
}
