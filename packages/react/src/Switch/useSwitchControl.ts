import { ChangeEventHandler, useState } from 'react';

export interface UseSwitchControlConfig {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export type SwitchControl = Required<Omit<UseSwitchControlConfig, 'defaultChecked'>>;

export function useSwitchControl(config: UseSwitchControlConfig): SwitchControl {
  const {
    checked: checkedConfig,
    defaultChecked: defaultCheckedConfig,
    onChange,
  } = config;
  const [checked, setChecked] = useState(() => (checkedConfig ?? defaultCheckedConfig) || false);

  if (typeof checkedConfig !== 'undefined' && checkedConfig !== checked) {
    setChecked(checkedConfig);
  }

  return {
    checked: checkedConfig ?? checked,
    onChange: (event) => {
      setChecked(event.target.checked);

      if (onChange) {
        onChange(event);
      }
    },
  };
}
