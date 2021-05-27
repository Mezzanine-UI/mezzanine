import {
  useState,
  MouseEvent,
} from 'react';
import { SelectValue } from '../Select/typings';

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

  const [value, setValue] = useState<SelectValue[]>((valueProp ?? defaultValue) || []);

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
