import {
  MouseEvent,
} from 'react';
import intersectionBy from 'lodash/intersectionBy';
import { SelectValue } from '../Select/typings';
import { useControlValueState } from './useControlValueState';

export interface UseSelectValueControl {
  defaultValue?: SelectValue[];
  mode: string;
  onChange?(newOptions: SelectValue[]): any;
  onClear?(e: MouseEvent<Element>): void;
  onClose?(): void;
  value?: SelectValue[];
}

export interface SelectValueControl {
  onChange: (v: SelectValue | null) => SelectValue[];
  onClear(e: MouseEvent<Element>): void;
  value: SelectValue[];
}

const equalityFn = (a: SelectValue[], b: SelectValue[]) => (
  a.length === b.length && intersectionBy(a, b, 'id').length === a.length
);

export function useSelectValueControl(
  props: UseSelectValueControl,
): SelectValueControl {
  const {
    defaultValue,
    mode,
    onChange,
    onClear: onClearProp,
    onClose,
    value: valueProp,
  } = props;

  const [value, setValue] = useControlValueState<SelectValue[]>({
    defaultValue: defaultValue || [],
    equalityFn,
    value: valueProp,
  });

  return {
    value,
    onChange: (chooseOption: SelectValue | null) => {
      if (!chooseOption) return [];

      let newValue: SelectValue[] = [];

      switch (mode) {
        case 'single': {
          newValue = [chooseOption];

          if (typeof onClose === 'function') {
            /** single selection should close modal when clicked */
            onClose();
          }

          break;
        }

        case 'multiple': {
          const existedValueIdx = (value ?? []).findIndex((v) => v.id === chooseOption.id);

          if (~existedValueIdx) {
            newValue = [
              ...value.slice(0, existedValueIdx),
              ...value.slice(existedValueIdx + 1),
            ];
          } else {
            newValue = [
              ...value,
              chooseOption,
            ];
          }

          break;
        }

        default:
          break;
      }

      setValue(newValue);

      if (typeof onChange === 'function') onChange(newValue);

      return newValue;
    },
    onClear: (e: MouseEvent<Element>) => {
      e.stopPropagation();

      setValue([]);

      if (typeof onClearProp === 'function') {
        onClearProp(e);
      }
    },
  };
}
