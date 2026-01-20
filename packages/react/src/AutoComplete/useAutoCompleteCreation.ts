import {
  ClipboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { SelectValue } from '../Select/typings';

type UseAutoCompleteCreationParams = {
  addable: boolean;
  createSeparators: string[];
  filterUnselected: (options: SelectValue[]) => SelectValue[];
  clearUnselected: () => void;
  isMultiple: boolean;
  isSingle: boolean;
  markCreated: (id: string) => void;
  clearNewlyCreated: (ids?: string[]) => void;
  markUnselected: (ids: string[]) => void;
  onChangeMultiple?: (newOptions: SelectValue[]) => void;
  onFocus: (focus: boolean) => void;
  onInsert?: (text: string, currentOptions: SelectValue[]) => SelectValue[];
  options: SelectValue[];
  toggleOpen: (newOpen: boolean | ((prev: boolean) => boolean)) => void;
  trimOnCreate: boolean;
  value: SelectValue[] | SelectValue | null | undefined;
  wrappedOnChange: (
    chooseOption: SelectValue | null,
  ) => SelectValue[] | SelectValue | null;
  setSearchText: (value: string) => void;
};

type ProcessBulkCreate = (text: string) => string[];

function isMultipleValue(
  value: SelectValue[] | SelectValue | null | undefined,
): value is SelectValue[] {
  return Array.isArray(value);
}

function isSingleValue(
  value: SelectValue[] | SelectValue | null | undefined,
): value is SelectValue {
  return value !== null && value !== undefined && !Array.isArray(value);
}

function isOptionSelected(
  option: SelectValue,
  value: SelectValue[] | SelectValue | null | undefined,
  isMultiple: boolean,
): boolean {
  if (isMultiple && isMultipleValue(value)) {
    return value.some((v) => v.id === option.id);
  }
  if (!isMultiple && isSingleValue(value)) {
    return value.id === option.id;
  }
  return false;
}

export function useAutoCompleteCreation({
  addable,
  createSeparators,
  filterUnselected,
  clearUnselected,
  isMultiple,
  isSingle,
  markCreated,
  markUnselected,
  onChangeMultiple,
  onFocus,
  onInsert,
  options,
  toggleOpen,
  trimOnCreate,
  value,
  wrappedOnChange,
  setSearchText,
  clearNewlyCreated,
}: UseAutoCompleteCreationParams) {
  const [insertText, setInsertText] = useState<string>('');
  const valueRef = useRef<SelectValue[] | SelectValue | null | undefined>(
    value,
  );

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const resetCreationInputs = useCallback(() => {
    setSearchText('');
    setInsertText('');
  }, [setSearchText]);

  const processBulkCreate = useCallback<ProcessBulkCreate>(
    (text: string) => {
      if (!text || !addable || !onInsert) return [];

      let parts: string[] = [text];
      createSeparators.forEach((separator) => {
        const newParts: string[] = [];
        parts.forEach((part) => {
          newParts.push(...part.split(separator));
        });
        parts = newParts;
      });

      const processed = parts
        .map((part) => (trimOnCreate ? part.trim() : part))
        .filter((part) => part.length > 0);

      const selectedNames = new Set<string>();
      if (isMultiple && isMultipleValue(valueRef.current)) {
        valueRef.current.forEach((v) =>
          selectedNames.add(v.name.toLowerCase()),
        );
      } else if (isSingle && isSingleValue(valueRef.current)) {
        selectedNames.add(valueRef.current.name.toLowerCase());
      }

      return processed.filter((part) => !selectedNames.has(part.toLowerCase()));
    },
    [addable, createSeparators, isMultiple, isSingle, onInsert, trimOnCreate],
  );

  const handleBulkCreate = useCallback(
    (texts: string[]) => {
      if (!addable || texts.length === 0 || !onInsert) return;

      let currentOptions = filterUnselected(options);
      clearUnselected();

      const itemsToAdd: SelectValue[] = [];
      const newlyCreatedIds: Set<string> = new Set();
      const newlySelectedIds: Set<string> = new Set();

      texts.forEach((text) => {
        const existingOption = currentOptions.find(
          (option) => option.name === text,
        );

        if (existingOption) {
          const alreadySelected = isOptionSelected(
            existingOption,
            valueRef.current,
            isMultiple,
          );
          if (!alreadySelected) {
            itemsToAdd.push(existingOption);
          }
        } else {
          try {
            const updatedOptions = onInsert(text, currentOptions);

            if (!Array.isArray(updatedOptions)) {
              return;
            }

            const newOption = updatedOptions.find(
              (opt) =>
                !currentOptions.some((existing) => existing.id === opt.id),
            );

            if (newOption) {
              itemsToAdd.push(newOption);
              newlyCreatedIds.add(newOption.id);
              markCreated(newOption.id);
              currentOptions = updatedOptions;
            }
          } catch {
            console.warn('Invalid insert result');
            // Ignore invalid insert result; do not mutate currentOptions
          }
        }
      });

      if (itemsToAdd.length > 0) {
        if (isSingle && itemsToAdd[0]) {
          wrappedOnChange(itemsToAdd[0]);
          toggleOpen(false);
          onFocus(false);
          newlySelectedIds.add(itemsToAdd[0].id);
        } else if (isMultiple) {
          const currentValues = isMultipleValue(valueRef.current)
            ? valueRef.current
            : [];
          const newItemsToAdd = itemsToAdd.filter(
            (item) =>
              !currentValues.some((existing) => existing.id === item.id),
          );
          const mergedValues = [...currentValues, ...newItemsToAdd];

          if (onChangeMultiple) {
            onChangeMultiple(mergedValues);
            mergedValues.forEach((v) => newlySelectedIds.add(v.id));
          } else {
            newItemsToAdd.forEach((item) => {
              wrappedOnChange(item);
              newlySelectedIds.add(item.id);
            });
          }
        }

        if (newlySelectedIds.size) {
          clearNewlyCreated(Array.from(newlySelectedIds));
          newlySelectedIds.forEach((id) => newlyCreatedIds.delete(id));
        }

        if (newlyCreatedIds.size) {
          markUnselected(Array.from(newlyCreatedIds));
        }
      }
    },
    [
      addable,
      clearNewlyCreated,
      clearUnselected,
      filterUnselected,
      isMultiple,
      isSingle,
      markCreated,
      markUnselected,
      onChangeMultiple,
      onFocus,
      onInsert,
      options,
      toggleOpen,
      wrappedOnChange,
    ],
  );

  const handleActionCustom = useCallback(() => {
    if (!addable || !insertText) return;

    const hasSeparator = createSeparators.some((sep) =>
      insertText.includes(sep),
    );

    if (hasSeparator && isMultiple) {
      const textsToCreate = processBulkCreate(insertText);
      if (textsToCreate.length > 0) {
        handleBulkCreate(textsToCreate);
        resetCreationInputs();
        return;
      }
    }

    const textsToCreate = processBulkCreate(insertText);
    if (textsToCreate.length > 0) {
      handleBulkCreate(textsToCreate);
      resetCreationInputs();
    }
  }, [
    addable,
    createSeparators,
    handleBulkCreate,
    insertText,
    isMultiple,
    processBulkCreate,
    resetCreationInputs,
  ]);

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      if (!addable || !onInsert) {
        return;
      }

      const pastedText = e.clipboardData.getData('text');
      if (!pastedText) {
        return;
      }

      if (isMultiple) {
        const hasSeparator = createSeparators.some((sep) =>
          pastedText.includes(sep),
        );

        if (hasSeparator) {
          e.preventDefault();
          const textsToCreate = processBulkCreate(pastedText);
          if (textsToCreate.length > 0) {
            handleBulkCreate(textsToCreate);
            resetCreationInputs();
            return;
          }
        }
      }
    },
    [
      addable,
      createSeparators,
      handleBulkCreate,
      isMultiple,
      onInsert,
      processBulkCreate,
      resetCreationInputs,
    ],
  );

  return {
    handleActionCustom,
    handleBulkCreate,
    handlePaste,
    insertText,
    processBulkCreate,
    resetCreationInputs,
    setInsertText,
  };
}
