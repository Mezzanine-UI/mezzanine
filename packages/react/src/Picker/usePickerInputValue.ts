import { ChangeEventHandler, useState } from 'react';

export interface UsePickerInputValueProps {
  defaultValue?: string;
  initialValue?: string;
  onChange?: (val: string) => void;
}

export function usePickerInputValue(props?: UsePickerInputValueProps) {
  const {
    defaultValue = '',
    initialValue = '',
    onChange: onChangeProp,
  } = props || {};

  const [value, setValue] = useState<string>(initialValue || defaultValue);

  const onChange = (val: string) => {
    setValue(val);

    if (onChangeProp) {
      onChangeProp(val);
    }
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const val = event.target.value;

    onChange(val);
  };

  return {
    inputValue: value,
    inputChangeHandler: onInputChange,
    onChange: setValue,
  };
}

export default usePickerInputValue;
