import type { Ref } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { isImeComposing } from '@mezzanine-ui/core/utils';
import { createDropdownKeydownHandler } from '../dropdown/dropdown-keydown-handler';
import type { SelectValue } from '../select/select.types';

export interface UseAutoCompleteKeyboardOptions {
  activeIndex: Ref<number | null>;
  addable: () => boolean;
  createSeparators: () => string[];
  dropdownOptions: () => DropdownOption[];
  handleActionCustom: () => void;
  handleBulkCreate: (texts: string[]) => void;
  handleDropdownSelect: (option: DropdownOption) => void;
  inputPropsOnKeyDown?: (event: KeyboardEvent) => void;
  inputRef: Ref<HTMLInputElement | null>;
  keyboardActiveIndex: Ref<number | null>;
  mode: () => 'multiple' | 'single';
  onFocus: (focus: boolean) => void;
  open: () => boolean;
  processBulkCreate: (text: string) => string[];
  searchText: () => string;
  searchTextExistWithoutOption: () => boolean;
  setInsertText: (value: string) => void;
  setListboxHasVisualFocus: (focus: boolean) => void;
  setSearchText: (value: string) => void;
  stepByStepBulkCreate?: () => boolean;
  toggleOpen: (newOpen: boolean) => void;
  value: () => SelectValue[] | SelectValue | null | undefined;
  wrappedOnChange: (
    chooseOption: SelectValue | null,
  ) => SelectValue[] | SelectValue | null;
}

export interface AutoCompleteKeyboard {
  handleInputKeyDown: (event: KeyboardEvent) => void;
}

function isMultipleValue(
  value: SelectValue[] | SelectValue | null | undefined,
): value is SelectValue[] {
  return Array.isArray(value);
}

/**
 * AutoComplete 輸入框的鍵盤處理 composable。
 *
 * Enter 在 addable 模式下優先建立新項目，沒有高亮時則選第一個選項；
 * 多選且搜尋框為空時，Backspace 移除最後一個、Delete 移除第一個標籤；
 * 其餘交給共用的下拉鍵盤處理器。
 *
 * @example
 * ```ts
 * const { handleInputKeyDown } = useAutoCompleteKeyboard({ activeIndex, ... });
 * ```
 *
 * @see MznAutoComplete 使用這個 composable 的元件
 * @see createDropdownKeydownHandler 底層的方向鍵處理
 */
export function useAutoCompleteKeyboard(
  options: UseAutoCompleteKeyboardOptions,
): AutoCompleteKeyboard {
  const {
    activeIndex,
    addable,
    createSeparators,
    dropdownOptions,
    handleActionCustom,
    handleBulkCreate,
    handleDropdownSelect,
    inputPropsOnKeyDown,
    inputRef,
    keyboardActiveIndex,
    mode,
    onFocus,
    open,
    processBulkCreate,
    searchText,
    searchTextExistWithoutOption,
    setInsertText,
    setListboxHasVisualFocus,
    setSearchText,
    stepByStepBulkCreate,
    toggleOpen,
    value,
    wrappedOnChange,
  } = options;

  const handleKeyDown = createDropdownKeydownHandler({
    activeIndex,
    keyboardActiveIndex,
    onEnterSelect: (option) => {
      handleDropdownSelect(option);

      if (mode() === 'single') {
        toggleOpen(false);
        onFocus(false);
      }
    },
    onEscape: () => {
      toggleOpen(false);
      activeIndex.value = null;
      keyboardActiveIndex.value = null;
      setListboxHasVisualFocus(false);
      inputRef.value?.blur();
    },
    open,
    options: dropdownOptions,
    setListboxHasVisualFocus,
    setOpen: (newOpen) => {
      if (newOpen !== open()) toggleOpen(newOpen);
    },
  });

  /** Returns whether the Enter key was fully handled here. */
  function handleEnterKey(event: KeyboardEvent): boolean {
    if (event.key !== 'Enter' || !open()) return false;

    const text = searchText();

    if (addable() && text) {
      const hasSeparator = createSeparators().some((sep) => text.includes(sep));

      if (hasSeparator && mode() === 'multiple') {
        if (stepByStepBulkCreate?.()) {
          event.preventDefault();
          event.stopPropagation();
          handleActionCustom();

          return true;
        }

        event.preventDefault();
        event.stopPropagation();

        const textsToCreate = processBulkCreate(text);

        if (textsToCreate.length > 0) {
          handleBulkCreate(textsToCreate);
          setSearchText('');
          setInsertText('');

          return true;
        }
      }

      if (!hasSeparator && searchTextExistWithoutOption()) {
        event.preventDefault();
        event.stopPropagation();

        const textsToCreate = processBulkCreate(text);

        if (textsToCreate.length > 0) {
          handleBulkCreate(textsToCreate);
          setSearchText('');
          setInsertText('');
        }

        return true;
      }
    }

    if (activeIndex.value === null && dropdownOptions().length > 0) {
      event.preventDefault();
      event.stopPropagation();

      const optionToSelect = dropdownOptions()[0];

      if (optionToSelect) {
        handleDropdownSelect(optionToSelect);

        if (mode() === 'single') {
          toggleOpen(false);
          onFocus(false);
        }
      }

      return true;
    }

    return false;
  }

  function handleInputKeyDown(event: KeyboardEvent): void {
    if (isImeComposing(event)) return;

    if (handleEnterKey(event)) return;

    const current = value();

    if (
      mode() === 'multiple' &&
      isMultipleValue(current) &&
      current.length > 0 &&
      !searchText()
    ) {
      if (event.key === 'Backspace') {
        event.preventDefault();

        const lastValue = current[current.length - 1];

        if (lastValue) wrappedOnChange(lastValue);

        return;
      }

      if (event.key === 'Delete') {
        event.preventDefault();

        const firstValue = current[0];

        if (firstValue) wrappedOnChange(firstValue);

        return;
      }
    }

    handleKeyDown(event);
    inputPropsOnKeyDown?.(event);
  }

  return { handleInputKeyDown };
}
