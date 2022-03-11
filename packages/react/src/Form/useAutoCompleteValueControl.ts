import {
  useState,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
} from 'react';
import isEqual from 'lodash/isEqual';
import differenceBy from 'lodash/differenceBy';
import { SelectValue } from '../Select/typings';
import { useControlValueState } from './useControlValueState';

export interface UseAutoCompleteBaseValueControl {
  disabledOptionsFilter: boolean;
  onChange?(newOptions: SelectValue[] | SelectValue | null): any;
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
  onChange?(newOption: SelectValue | null): any;
  value?: SelectValue | null;
};

export type UseAutoCompleteValueControl = UseAutoCompleteMultipleValueControl | UseAutoCompleteSingleValueControl;

export interface AutoCompleteBaseValueControl {
  focused: boolean;
  onClear(e: MouseEvent<Element>): void;
  onFocus: (f: boolean) => void;
  options: SelectValue[];
  searchText: string;
  selectedOptions: SelectValue[];
  setSearchText: Dispatch<SetStateAction<string>>;
  unselectedOptions: SelectValue[];
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
  }, []);

  const options = disabledOptionsFilter
    ? optionsProp
    : optionsProp.filter((option) => !!option.name.includes(searchText));

  const selectedOptions = mode === 'multiple'
    ? options.filter((option) => !!(value as SelectValue[]).find((vp) => vp.id === option.id)) : [value];

  const unselectedOptions = differenceBy(options, selectedOptions, 'id');

  return {
    focused,
    onChange: (chooseOption: SelectValue | null) => {
      if (!chooseOption) {
        if (mode === 'multiple') {
          return [];
        }

        return null;
      }

      let newValue: SelectValue[] | SelectValue | null = mode === 'multiple' ? [] : null;

      switch (mode) {
        case 'multiple': {
          const existedValueIdx = (value as SelectValue[] ?? []).findIndex(
            (v: SelectValue) => v.id === chooseOption.id,
          );

          if (~existedValueIdx) {
            newValue = [
              ...(value as SelectValue[]).slice(0, existedValueIdx),
              ...(value as SelectValue[]).slice(existedValueIdx + 1),
            ];
          } else {
            newValue = [
              ...value as SelectValue[],
              chooseOption,
            ];
          }

          if (typeof onChange === 'function') onChange(newValue);

          break;
        }

        default: {
          newValue = chooseOption;

          if (typeof onClose === 'function') onClose();

          if (typeof onChange === 'function') onChange(newValue);

          break;
        }
      }

      setValue(newValue);

      return newValue;
    },
    onClear: (e: MouseEvent<Element>) => {
      e.stopPropagation();

      if (mode === 'multiple') {
        setValue([]);
        onChange?.([]);
      } else {
        setValue(null);
        onChange?.(null);
      }

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
    selectedOptions,
    setSearchText,
    unselectedOptions,
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
