import isEqual from 'lodash/isEqual';
import type { ComputedRef } from 'vue';
import type { SelectValue } from '../select/select.types';
import { useControlValueState } from './use-control-value-state';

export interface UseSelectValueControlOptions {
  /** The selection the control starts with while uncontrolled. */
  defaultValue?: () => SelectValue[] | SelectValue | null | undefined;
  /** Whether one or many options can be selected. */
  mode: () => 'multiple' | 'single';
  /** Called with the new selection after it actually moved. */
  onChange?: (value: SelectValue[] | SelectValue | null) => void;
  /** Called after the clear button emptied the selection. */
  onClear?: (event: MouseEvent) => void;
  /** Called when a single-mode pick should close the menu. */
  onClose?: () => void;
  /** Reads the controlled selection. `undefined` means uncontrolled. */
  value: () => SelectValue[] | SelectValue | null | undefined;
}

export interface SelectValueControl {
  /**
   * Toggles an option in multiple mode, replaces it in single mode, and hands
   * back the resulting selection the way React's does.
   */
  onChange: (
    chooseOption: SelectValue[] | SelectValue | null,
  ) => SelectValue[] | SelectValue | null;
  /** Empties the selection and stops the event from reaching the trigger. */
  onClear: (event: MouseEvent) => void;
  /** The current selection: an array in multiple mode, one value or null otherwise. */
  value: ComputedRef<SelectValue[] | SelectValue | null>;
}

const equalityFn = (
  a: SelectValue[] | SelectValue | null,
  b: SelectValue[] | SelectValue | null,
): boolean => isEqual(a, b);

/**
 * 管理 Select 單選／多選值的受控狀態 composable。
 *
 * 依 `mode` 分別處理單選與多選：多選會切換選項的存在與否，單選則直接取代並關閉選單。
 * 兩種模式都提供 `onClear`，清空後才呼叫呼叫端的 `onClear`。
 *
 * @example
 * ```ts
 * const { onChange, onClear, value } = useSelectValueControl({
 *   mode: () => props.mode,
 *   onChange: (next) => emit('change', next),
 *   value: () => props.value,
 * });
 * ```
 *
 * @see MznSelect 使用這個 composable 的元件
 */
export function useSelectValueControl(
  options: UseSelectValueControlOptions,
): SelectValueControl {
  const {
    defaultValue,
    mode,
    onChange: onChangeProp,
    onClear: onClearProp,
    onClose,
    value: valueProp,
  } = options;

  const { setValue, value } = useControlValueState<
    SelectValue[] | SelectValue | null
  >({
    defaultValue: defaultValue?.() ?? (mode() === 'multiple' ? [] : null),
    equalityFn,
    value: valueProp,
  });

  function onChangeMultiple(
    chooseOption: SelectValue[] | SelectValue | null,
  ): SelectValue[] {
    if (!chooseOption) return [];

    let newValue: SelectValue[] = [];

    if (Array.isArray(chooseOption)) {
      newValue = chooseOption;
    } else {
      const current = (value.value as SelectValue[]) ?? [];
      const existedValueIdx = current.findIndex(
        (v) => v.id === chooseOption.id,
      );

      if (~existedValueIdx) {
        newValue = [
          ...current.slice(0, existedValueIdx),
          ...current.slice(existedValueIdx + 1),
        ];
      } else {
        newValue = [...current, chooseOption];
      }
    }

    onChangeProp?.(newValue);
    setValue(newValue);

    return newValue;
  }

  function onChangeSingle(
    chooseOption: SelectValue[] | SelectValue | null,
  ): SelectValue | null {
    if (!chooseOption || Array.isArray(chooseOption)) return null;

    /** single selection should close modal when clicked */
    onClose?.();

    onChangeProp?.(chooseOption);
    setValue(chooseOption);

    return chooseOption;
  }

  function onClear(event: MouseEvent): void {
    event.stopPropagation();

    const emptied = mode() === 'multiple' ? [] : null;

    setValue(emptied);
    onChangeProp?.(emptied);
    onClearProp?.(event);
  }

  return {
    onChange: (chooseOption) =>
      mode() === 'multiple'
        ? onChangeMultiple(chooseOption)
        : onChangeSingle(chooseOption),
    onClear,
    value,
  };
}
