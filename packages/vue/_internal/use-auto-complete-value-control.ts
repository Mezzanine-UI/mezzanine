import { computed, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import compact from 'lodash/compact';
import differenceBy from 'lodash/differenceBy';
import isEqual from 'lodash/isEqual';
import type { SelectValue } from '../select/select.types';
import { useControlValueState } from './use-control-value-state';

export interface UseAutoCompleteValueControlOptions {
  /**
   * Whether option filtering should respect letter casing.
   * @default false
   */
  caseSensitive?: () => boolean;
  /** The selection the control starts with while uncontrolled. */
  defaultValue?: () => SelectValue[] | SelectValue | null | undefined;
  disabledOptionsFilter: () => boolean;
  /** Narrows the text the option filter runs on, for the bulk-create flow. */
  getOptionsFilterQuery?: (searchText: string) => string | undefined;
  mode: () => 'multiple' | 'single';
  onChange?: (newOptions: SelectValue[] | SelectValue | null) => void;
  onClear?: (event: MouseEvent) => void;
  onClose?: () => void;
  onSearch?: (input: string) => void;
  options: () => SelectValue[];
  value: () => SelectValue[] | SelectValue | null | undefined;
}

export interface AutoCompleteValueControl {
  /** Whether the trigger currently holds focus. */
  focused: Ref<boolean>;
  onChange: (
    chooseOption: SelectValue | null,
  ) => SelectValue[] | SelectValue | null;
  onClear: (event: MouseEvent) => void;
  onFocus: (focus: boolean) => void;
  /** The options left after filtering by the search text. */
  options: ComputedRef<SelectValue[]>;
  searchText: Ref<string>;
  /** The current selection, always as an array. */
  selectedOptions: ComputedRef<SelectValue[]>;
  /** The filtered options that are not selected. */
  unselectedOptions: ComputedRef<SelectValue[]>;
  value: ComputedRef<SelectValue[] | SelectValue | null>;
}

const equalityFn = (
  a: SelectValue[] | SelectValue | null,
  b: SelectValue[] | SelectValue | null,
): boolean => isEqual(a, b);

/**
 * 管理 AutoComplete 搜尋文字與選取值的受控狀態 composable。
 *
 * 依 `mode` 支援單選與多選，並內建選項過濾、焦點狀態與清除；
 * 過濾用的正規表示式會轉義特殊字元，`caseSensitive` 決定是否忽略大小寫。
 *
 * @example
 * ```ts
 * const control = useAutoCompleteValueControl({
 *   disabledOptionsFilter: () => false,
 *   mode: () => 'single',
 *   options: () => props.options,
 *   value: () => props.value,
 * });
 * ```
 *
 * @see MznAutoComplete 使用這個 composable 的元件
 */
export function useAutoCompleteValueControl(
  options: UseAutoCompleteValueControlOptions,
): AutoCompleteValueControl {
  const {
    caseSensitive,
    defaultValue,
    disabledOptionsFilter,
    getOptionsFilterQuery,
    mode,
    onChange: onChangeProp,
    onClear: onClearProp,
    onClose,
    onSearch,
    options: optionsProp,
    value: valueProp,
  } = options;

  const { setValue, value } = useControlValueState<
    SelectValue[] | SelectValue | null
  >({
    defaultValue: defaultValue?.() ?? (mode() === 'multiple' ? [] : null),
    equalityFn,
    value: valueProp,
  });

  const searchText = ref('');
  const focused = ref(false);

  const filteredOptions = computed((): SelectValue[] => {
    if (disabledOptionsFilter()) return optionsProp();

    const filterQuery =
      getOptionsFilterQuery?.(searchText.value) ?? searchText.value;

    /** escape all special characters; casing is ignored unless `caseSensitive` is set */
    const searchTextReg = new RegExp(
      filterQuery.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d'),
      caseSensitive?.() ? '' : 'i',
    );

    return optionsProp().filter((option) => !!option.name.match(searchTextReg));
  });

  const selectedOptions = computed((): SelectValue[] =>
    mode() === 'multiple'
      ? (value.value as SelectValue[])
      : compact([value.value as SelectValue | null]),
  );

  function onChange(
    chooseOption: SelectValue | null,
  ): SelectValue[] | SelectValue | null {
    if (!chooseOption) return mode() === 'multiple' ? [] : null;

    let newValue: SelectValue[] | SelectValue | null =
      mode() === 'multiple' ? [] : null;

    if (mode() === 'multiple') {
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

      onChangeProp?.(newValue);
    } else {
      newValue = chooseOption;

      onClose?.();
      onChangeProp?.(newValue);
    }

    setValue(newValue);

    return newValue;
  }

  function onClear(event: MouseEvent): void {
    event.stopPropagation();

    const emptied = mode() === 'multiple' ? [] : null;

    setValue(emptied);
    onChangeProp?.(emptied);
    searchText.value = '';
    onClearProp?.(event);
    onSearch?.('');
  }

  return {
    focused,
    onChange,
    onClear,
    onFocus: (focus: boolean) => {
      focused.value = focus;
    },
    options: filteredOptions,
    searchText,
    selectedOptions,
    unselectedOptions: computed((): SelectValue[] =>
      differenceBy(filteredOptions.value, selectedOptions.value, 'id'),
    ),
    value,
  };
}
