import {
  KeyboardEvent,
  KeyboardEventHandler,
  Ref,
  useCallback,
} from 'react';

import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';

import { createDropdownKeydownHandler } from '../Dropdown/dropdownKeydownHandler';
import { SelectValue } from '../Select/typings';

type UseAutoCompleteKeyboardParams = {
  activeIndex: number | null;
  addable: boolean;
  createSeparators: string[];
  dropdownOptions: DropdownOption[];
  handleBulkCreate: (texts: string[]) => void;
  handleDropdownSelect: (option: DropdownOption) => void;
  inputRef?: Ref<HTMLInputElement>;
  inputPropsOnKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  isMultiple: boolean;
  mode: 'single' | 'multiple';
  onFocus: (focus: boolean) => void;
  open: boolean;
  processBulkCreate: (text: string) => string[];
  searchText: string;
  searchTextExistWithoutOption: boolean;
  setActiveIndex: (index: number | null) => void;
  setListboxHasVisualFocus: (focus: boolean) => void;
  setInsertText: (value: string) => void;
  setSearchText: (value: string) => void;
  toggleOpen: (newOpen: boolean | ((prev: boolean) => boolean)) => void;
  value: SelectValue[] | SelectValue | null | undefined;
  wrappedOnChange: (chooseOption: SelectValue | null) => SelectValue[] | SelectValue | null;
};

function isMultipleValue(value: SelectValue[] | SelectValue | null | undefined): value is SelectValue[] {
  return Array.isArray(value);
}

export function useAutoCompleteKeyboard({
  activeIndex,
  addable,
  createSeparators,
  dropdownOptions,
  handleBulkCreate,
  handleDropdownSelect,
  inputPropsOnKeyDown,
  inputRef,
  isMultiple,
  mode,
  onFocus,
  open,
  processBulkCreate,
  searchText,
  searchTextExistWithoutOption,
  setActiveIndex,
  setInsertText,
  setListboxHasVisualFocus,
  setSearchText,
  toggleOpen,
  value,
  wrappedOnChange,
}: UseAutoCompleteKeyboardParams) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) =>
      createDropdownKeydownHandler({
        activeIndex,
        onEnterSelect: (option) => {
          handleDropdownSelect(option);
          if (mode === 'single') {
            toggleOpen(false);
            onFocus(false);
          }
        },
        onEscape: () => {
          toggleOpen(false);
          setActiveIndex(null);
          setListboxHasVisualFocus(false);
          if (inputRef && typeof inputRef !== 'function') {
            inputRef.current?.blur();
          }
        },
        open,
        options: dropdownOptions,
        setActiveIndex,
        setListboxHasVisualFocus,
        setOpen: (newOpen) => {
          if (newOpen && !open) {
            toggleOpen(true);
          } else if (!newOpen && open) {
            toggleOpen(false);
          }
        },
      })(e),
    [
      activeIndex,
      dropdownOptions,
      handleDropdownSelect,
      inputRef,
      mode,
      onFocus,
      open,
      setActiveIndex,
      setListboxHasVisualFocus,
      toggleOpen,
    ],
  );

  const handleEnterKey = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && open) {
        if (addable && searchText) {
          const hasSeparator = createSeparators.some((sep) => searchText.includes(sep));

          if (hasSeparator && mode === 'multiple') {
            e.preventDefault();
            e.stopPropagation();
            const textsToCreate = processBulkCreate(searchText);
            if (textsToCreate.length > 0) {
              handleBulkCreate(textsToCreate);
              setSearchText('');
              setInsertText('');
              return true;
            }
          }

          if (!hasSeparator && searchTextExistWithoutOption) {
            e.preventDefault();
            e.stopPropagation();
            const textsToCreate = processBulkCreate(searchText);
            if (textsToCreate.length > 0) {
              handleBulkCreate(textsToCreate);
              setSearchText('');
              setInsertText('');
            }
            return true;
          }
        }

        if (activeIndex === null && dropdownOptions.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          const optionToSelect = dropdownOptions[0];
          if (optionToSelect) {
            handleDropdownSelect(optionToSelect);
            if (mode === 'single') {
              toggleOpen(false);
              onFocus(false);
            }
          }
          return true;
        }
      }

      return false;
    },
    [
      activeIndex,
      addable,
      createSeparators,
      dropdownOptions,
      handleBulkCreate,
      handleDropdownSelect,
      mode,
      onFocus,
      open,
      processBulkCreate,
      searchText,
      searchTextExistWithoutOption,
      setInsertText,
      setSearchText,
      toggleOpen,
    ],
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (handleEnterKey(e)) return;

      if (
        mode === 'multiple' &&
        isMultipleValue(value) &&
        value.length > 0 &&
        !searchText
      ) {
        if (e.key === 'Backspace') {
          e.preventDefault();
          const lastValue = value[value.length - 1];
          if (lastValue) {
            wrappedOnChange(lastValue);
          }
          return;
        }

        if (e.key === 'Delete') {
          e.preventDefault();
          const firstValue = value[0];
          if (firstValue) {
            wrappedOnChange(firstValue);
          }
          return;
        }
      }

      handleKeyDown(e);
      inputPropsOnKeyDown?.(e);
    },
    [
      handleEnterKey,
      handleKeyDown,
      inputPropsOnKeyDown,
      mode,
      searchText,
      value,
      wrappedOnChange,
    ],
  );

  return {
    handleInputKeyDown,
  };
}

