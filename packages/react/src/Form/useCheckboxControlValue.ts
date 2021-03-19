import { ChangeEventHandler } from 'react';
import { useSwitchControlValue, UseSwitchControlValueProps } from './useSwitchControlValue';

export interface CheckboxGroupControlContextValue {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string[];
}

export interface UseCheckboxControlValueProps extends UseSwitchControlValueProps {
  checkboxGroup?: CheckboxGroupControlContextValue;
  value?: string;
}

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

  return [checked, setChecked] as const;
}
