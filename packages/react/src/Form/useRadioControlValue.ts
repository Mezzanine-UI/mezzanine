import { ChangeEventHandler } from 'react';
import { useSwitchControlValue, UseSwitchControlValueProps } from './useSwitchControlValue';

export interface RadioGroupControlContextValue {
  disabled?: boolean;
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
}

export interface UseRadioControlValueProps extends UseSwitchControlValueProps {
  disabled?: boolean;
  name?: string;
  radioGroup?: RadioGroupControlContextValue;
  value?: string;
}

export function useRadioControlValue(props: UseRadioControlValueProps) {
  const {
    checked: checkedProp,
    defaultChecked,
    disabled,
    name,
    onChange: onChangeProp,
    radioGroup,
    value,
  } = props;
  const {
    disabled: disabledFromGroup,
    name: nameFromGroup,
    onChange: onChangeFromGroup,
  } = radioGroup || {};
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

  return [
    checked,
    setChecked,
    {
      disabled: disabled ?? disabledFromGroup,
      name: name || nameFromGroup,
    },
  ] as const;
}
