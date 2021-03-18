import { ChangeEventHandler } from 'react';
import { useSwitchControlValue, UseSwitchControlValueProps } from './useSwitchControlValue';

export interface CheckboxGroupControlContextValue {
  disabled?: boolean;
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string[];
}

export interface UseCheckboxControlValueProps extends UseSwitchControlValueProps {
  checkboxGroup?: CheckboxGroupControlContextValue;
  disabled?: boolean;
  name?: string;
  value?: string;
}

export function useCheckboxControlValue(props: UseCheckboxControlValueProps) {
  const {
    checkboxGroup,
    checked: checkedProp,
    defaultChecked,
    disabled,
    name,
    onChange: onChangeProp,
    value,
  } = props;
  const {
    disabled: disabledFromGroup,
    name: nameFromGroup,
    onChange: onChangeFromGroup,
  } = checkboxGroup || {};
  const [checked, setChecked] = useSwitchControlValue({
    /**
     * To ensure radio inside radio group, not use destructure here
     */
    // eslint-disable-next-line no-nested-ternary
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

  return [
    checked,
    setChecked,
    {
      disabled: disabled ?? disabledFromGroup,
      name: name || nameFromGroup,
    },
  ] as const;
}
