import {
  useState,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
} from 'react';
import { SelectValue } from '../Select/typings';
import { useControlValueState } from './useControlValueState';

export interface UseAutoCompleteValueControl {
  defaultValue?: string;
  disabledOptionsFilter: boolean;
  onChange?(newOption: string): any;
  onClear?(e: MouseEvent<Element>): void;
  onClose?(): void;
  options: string[];
  value?: string;
}

export interface AutoCompleteValueControl {
  focused: boolean;
  onChange: (v: SelectValue | null) => SelectValue[];
  onClear(e: MouseEvent<Element>): void;
  onFocus: (f: boolean) => void;
  options: string[];
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  setValue: Dispatch<SetStateAction<string>>;
  value: SelectValue[];
}

const equalityFn = (a: string, b: string) => a === b;

export function useAutoCompleteValueControl(
  props: UseAutoCompleteValueControl,
): AutoCompleteValueControl {
  const {
    defaultValue = '',
    disabledOptionsFilter,
    onChange,
    onClear: onClearProp,
    onClose,
    options: optionsProp,
    value: valueProp,
  } = props;

  const [value, setValue] = useControlValueState({
    defaultValue,
    equalityFn,
    value: valueProp,
  });

  const [searchText, setSearchText] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const onFocus = useCallback((focus: boolean) => {
    setFocused(focus);

    /** sync current value */
    if (!focus) {
      onChange?.(value);
    }
  }, [
    value,
    onChange,
  ]);

  const getCurrentInputValue = () => (
    value ? [{
      id: value,
      name: value,
    }] : []
  );

  const options = disabledOptionsFilter
    ? optionsProp
    : optionsProp.filter((option) => ~option.search(searchText));

  return {
    focused,
    onChange: (chooseOption: SelectValue | null) => {
      if (!chooseOption) return [];

      onClose?.();
      setValue(chooseOption.name);
      onChange?.(chooseOption.name);

      return [chooseOption];
    },
    onClear: (e: MouseEvent<Element>) => {
      e.stopPropagation();

      setValue('');
      setSearchText('');

      if (typeof onClearProp === 'function') {
        onClearProp(e);
      }
    },
    onFocus,
    options,
    searchText,
    setSearchText,
    setValue,
    value: getCurrentInputValue(),
  };
}
