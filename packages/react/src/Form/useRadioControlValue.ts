import { ChangeEventHandler } from 'react';
import {
  useSwitchControlValue,
  UseSwitchControlValueProps,
} from './useSwitchControlValue';

export interface RadioGroupControlContextValue {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
}

export interface UseRadioControlValueProps extends UseSwitchControlValueProps {
  radioGroup?: RadioGroupControlContextValue;
  value?: string;
}

/**
 * 管理 Radio 選取狀態的受控 Hook。
 *
 * 支援獨立使用與在 RadioGroup 內使用兩種情境：
 * 當傳入 `radioGroup` 上下文時，會以群組的 `value` 與本身的 `value` 進行比對來決定是否選中。
 *
 * @example
 * ```tsx
 * import { useRadioControlValue } from '@mezzanine-ui/react';
 *
 * const [checked, handleChange] = useRadioControlValue({
 *   value: 'option-a',
 *   radioGroup: { value: selectedValue, onChange: handleGroupChange },
 * });
 * ```
 *
 * @see {@link Radio} 搭配的元件
 * @see {@link RadioGroup} 搭配的元件
 */
export function useRadioControlValue(props: UseRadioControlValueProps) {
  const {
    checked: checkedProp,
    defaultChecked,
    onChange: onChangeProp,
    radioGroup,
    value,
  } = props;
  const { onChange: onChangeFromGroup } = radioGroup || {};
  const [checked, setChecked] = useSwitchControlValue({
    /**
     * To ensure radio inside radio group, not use destructure here
     */
    checked: radioGroup ? radioGroup.value === value : checkedProp,
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
