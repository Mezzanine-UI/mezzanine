import { MouseEvent } from 'react';
import isEqual from 'lodash/isEqual';
import { SelectValue } from '../Select/typings';
import { useControlValueState } from './useControlValueState';

export interface UseSelectBaseValueControl {
  onClear?(e: MouseEvent<Element>): void;
  onChange?(newOptions: SelectValue[] | SelectValue): any;
  onClose?(): void;
}

export type UseSelectMultipleValueControl = UseSelectBaseValueControl & {
  defaultValue?: SelectValue[];
  mode: 'multiple';
  onChange?(newOptions: SelectValue[]): any;
  value?: SelectValue[];
};

export type UseSelectSingleValueControl = UseSelectBaseValueControl & {
  defaultValue?: SelectValue;
  mode: 'single';
  onChange?(newOption: SelectValue): any;
  value?: SelectValue | null;
};

export type UseSelectValueControl =
  | UseSelectMultipleValueControl
  | UseSelectSingleValueControl;

export interface SelectBaseValueControl {
  onClear(e: MouseEvent<Element>): void;
}

export type SelectMultipleValueControl = SelectBaseValueControl & {
  onChange: (v: SelectValue | null) => SelectValue[];
  value: SelectValue[];
};

export type SelectSingleValueControl = SelectBaseValueControl & {
  onChange: (v: SelectValue | null) => SelectValue | null;
  value: SelectValue | null;
};

export type SelectValueControl =
  | SelectMultipleValueControl
  | SelectSingleValueControl;

const equalityFn = (
  a: SelectValue[] | SelectValue | null,
  b: SelectValue[] | SelectValue | null,
) => isEqual(a, b);

function useSelectBaseValueControl(
  props: UseSelectMultipleValueControl,
): SelectMultipleValueControl;
function useSelectBaseValueControl(
  props: UseSelectSingleValueControl,
): SelectSingleValueControl;
function useSelectBaseValueControl(props: UseSelectValueControl) {
  const {
    defaultValue,
    mode,
    onChange,
    onClear: onClearProp,
    onClose,
    value: valueProp,
  } = props;

  const [value, setValue] = useControlValueState<
    SelectValue[] | SelectValue | null
  >({
    defaultValue: defaultValue || (mode === 'multiple' ? [] : null),
    equalityFn,
    value: valueProp,
  });

  return {
    value,
    onChange: (chooseOption: SelectValue | null) => {
      if (!chooseOption) {
        if (mode === 'multiple') {
          return [];
        }

        return null;
      }

      let newValue: SelectValue[] | SelectValue | null =
        mode === 'multiple' ? [] : null;

      switch (mode) {
        case 'multiple': {
          const existedValueIdx = ((value as SelectValue[]) ?? []).findIndex(
            (v: SelectValue) => v.id === chooseOption.id,
          );

          if (~existedValueIdx) {
            newValue = [
              ...(value as SelectValue[]).slice(0, existedValueIdx),
              ...(value as SelectValue[]).slice(existedValueIdx + 1),
            ];
          } else {
            newValue = [...(value as SelectValue[]), chooseOption];
          }

          if (typeof onChange === 'function') onChange(newValue);

          break;
        }

        default: {
          newValue = chooseOption;

          if (typeof onClose === 'function') {
            /** single selection should close modal when clicked */
            onClose();
          }

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
      } else {
        setValue(null);
      }

      if (typeof onClearProp === 'function') {
        onClearProp(e);
      }
    },
  };
}

export const useSelectValueControl = (props: UseSelectValueControl) => {
  if (props.mode === 'multiple') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelectBaseValueControl(
      props as UseSelectMultipleValueControl,
    ) as SelectMultipleValueControl;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSelectBaseValueControl(
    props as UseSelectSingleValueControl,
  ) as SelectSingleValueControl;
};
