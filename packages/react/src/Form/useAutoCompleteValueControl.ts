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

export interface UseAutoCompleteBaseValueControl {
  disabledOptionsFilter: boolean;
  onChange?(newOptions: SelectValue[] | SelectValue): any;
  onClear?(e: MouseEvent<Element>): void;
  onClose?(): void;
  onSearch?(input: string): any;
  options: SelectValue[];
}

export type UseAutoCompleteMultipleValueControl = UseAutoCompleteBaseValueControl & {
  defaultValue?: SelectValue[];
  mode: 'multiple';
  onChange?(newOptions: SelectValue[]): any;
  value?: SelectValue[];
};

export type UseAutoCompleteSingleValueControl = UseAutoCompleteBaseValueControl & {
  defaultValue?: SelectValue;
  mode: 'single';
  onChange?(newOption: SelectValue): any;
  value?: SelectValue | null;
};

export type UseAutoCompleteValueControl = UseAutoCompleteMultipleValueControl | UseAutoCompleteSingleValueControl;
export interface AutoCompleteBaseValueControl {
  focused: boolean;
  onClear(e: MouseEvent<Element>): void;
  onFocus: (f: boolean) => void;
  options: SelectValue[];
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
}

export type AutoCompleteMultipleValueControl = AutoCompleteBaseValueControl & {
  onChange: (v: SelectValue | null) => SelectValue[];
  value: SelectValue[];
};

export type AutoCompleteSingleValueControl = AutoCompleteBaseValueControl & {
  onChange: (v: SelectValue | null) => SelectValue | null;
  value: SelectValue | null;
};

const equalityFn = (a: SelectValue[] | SelectValue | null, b: SelectValue[] | SelectValue | null) => isEqual(a, b);

function useAutoCompleteBaseValueControl(props: UseAutoCompleteMultipleValueControl): AutoCompleteMultipleValueControl;
function useAutoCompleteBaseValueControl(props: UseAutoCompleteSingleValueControl): AutoCompleteSingleValueControl;
function useAutoCompleteBaseValueControl(props: UseAutoCompleteValueControl) {
  const {
    defaultValue,
    disabledOptionsFilter,
    mode,
    onChange,
    onClear: onClearProp,
    onClose,
    onSearch,
    options: optionsProp,
    value: valueProp,
  } = props;

  const [value, setValue] = useControlValueState<SelectValue[] | SelectValue | null>({
    defaultValue: defaultValue || (mode === 'multiple' ? [] : null),
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
      onChange?.(null);
      setSearchText('');

      if (typeof onClearProp === 'function') {
        onClearProp(e);
      }

      if (typeof onSearch === 'function') {
        onSearch('');
      }
    },
    onFocus,
    options,
    searchText,
    setSearchText,
    value,
  };
}

export const useAutoCompleteValueControl = (props: UseAutoCompleteValueControl) => {
  if (props.mode === 'multiple') {
    return useAutoCompleteBaseValueControl(
      props as UseAutoCompleteMultipleValueControl,
    ) as AutoCompleteMultipleValueControl;
  }

  return useAutoCompleteBaseValueControl(props as UseAutoCompleteSingleValueControl) as AutoCompleteSingleValueControl;
};
