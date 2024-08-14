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
