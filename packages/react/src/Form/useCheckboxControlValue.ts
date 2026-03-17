import { ChangeEventHandler } from 'react';
import {
  useSwitchControlValue,
  UseSwitchControlValueProps,
} from './useSwitchControlValue';

export interface CheckboxGroupControlContextValue {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string[];
}

export interface UseCheckboxControlValueProps
  extends UseSwitchControlValueProps {
  checkboxGroup?: CheckboxGroupControlContextValue;
  value?: string;
}

/**
 * 管理 Checkbox 勾選狀態的受控 Hook。
 *
 * 支援獨立使用與在 CheckboxGroup 內使用兩種情境：
 * 當傳入 `checkboxGroup` 上下文時，會自動從群組的 `value` 陣列中計算出當前勾選狀態。
 *
 * @example
 * ```tsx
 * import { useCheckboxControlValue } from '@mezzanine-ui/react';
 *
 * const [checked, handleChange] = useCheckboxControlValue({
 *   defaultChecked: false,
 *   onChange: (e) => console.log(e.target.checked),
 * });
 * ```
 *
 * @see {@link Checkbox} 搭配的元件
 * @see {@link CheckboxGroup} 搭配的元件
 */
export function useCheckboxControlValue(props: UseCheckboxControlValueProps) {
  const {
    checkboxGroup,
    checked: checkedProp,
    defaultChecked,
    onChange: onChangeProp,
    value,
  } = props;
  const { onChange: onChangeFromGroup } = checkboxGroup || {};
  const [checked, setChecked] = useSwitchControlValue({
    /**
     * To ensure checkbox inside checkbox group, not use destructure here
     */

    checked: checkboxGroup
      ? checkboxGroup.value && value != null
        ? checkboxGroup.value.includes(value)
        : false
      : checkedProp,
    defaultChecked,
    onChange: (event) => {
      if (onChangeProp) {
        onChangeProp(event);
      }

      if (onChangeFromGroup) {
        onChangeFromGroup(event);
      }
    },
  });

  return [checked, setChecked] as const;
}
