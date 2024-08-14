import { ChangeEventHandler } from 'react';
import { useLastCallback } from '../hooks/useLastCallback';
import { useControlValueState } from './useControlValueState';

export interface UseSwitchControlValueProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const equalityFn = (a: boolean, b: boolean) => a === b;

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
