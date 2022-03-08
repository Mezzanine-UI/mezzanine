import {
  useState,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
} from 'react';
import isEqual from 'lodash/isEqual';
import { SelectValue } from '../Select/typings';
import { useControlValueState } from './useControlValueState';

export interface UseAutoCompleteValueControl {
  defaultValue?: SelectValue | null;
  disabledOptionsFilter: boolean;
  onChange?(newOption: SelectValue | null): any;
  onClear?(e: MouseEvent<Element>): void;
  onClose?(): void;
  options: SelectValue[];
  value?: SelectValue | null;
}

export interface AutoCompleteValueControl {
  focused: boolean;
  onChange: (v: SelectValue | null) => SelectValue | null;
  onClear(e: MouseEvent<Element>): void;
  onFocus: (f: boolean) => void;
  options: SelectValue[];
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  setValue: (option: SelectValue) => void;
  value: SelectValue | null;
}

const equalityFn = (a: SelectValue | null, b: SelectValue | null) => isEqual(a, b);

export function useAutoCompleteValueControl(
  props: UseAutoCompleteValueControl,
): AutoCompleteValueControl {
  const {
    defaultValue = null,
    disabledOptionsFilter,
    onChange,
    onClear: onClearProp,
    onClose,
    options: optionsProp,
    value: valueProp,
  } = props;

  const [value, setValue] = useControlValueState<SelectValue | null>({
    defaultValue,
    equalityFn,
    value: valueProp,
  });

  const [searchText, setSearchText] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const onChangeValue = useCallback((option: SelectValue) => {
    setValue(option);
    onChange?.(option);
  }, [setValue, onChange]);

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

  const options = disabledOptionsFilter
    ? optionsProp
    : optionsProp.filter((option) => !!option.name.includes(searchText));

  return {
    focused,
    onChange: (chooseOption: SelectValue | null) => {
      if (!chooseOption) return null;

      onClose?.();
      setValue(chooseOption);
      onChange?.(chooseOption);
      setSearchText('');

      return chooseOption;
    },
    onClear: (e: MouseEvent<Element>) => {
      e.stopPropagation();

      setValue(null);
      setSearchText('');

      if (typeof onClearProp === 'function') {
        onClearProp(e);
      }
    },
    onFocus,
    options,
    searchText,
    setSearchText,
    setValue: onChangeValue,
    value,
  };
}
