import { ref } from 'vue';
import type { Ref } from 'vue';
import type { SelectValue } from '../select/select.types';
import { isSameOptionName, normalizeOptionName } from './is-same-option-name';

export interface UseAutoCompleteCreationOptions {
  addable: () => boolean;
  caseSensitive?: () => boolean;
  clearNewlyCreated: (ids?: string[]) => void;
  clearUnselected: () => void;
  createSeparators: () => string[];
  filterUnselected: (options: SelectValue[]) => SelectValue[];
  isMultiple: () => boolean;
  isSingle: () => boolean;
  markCreated: (id: string) => void;
  markUnselected: (ids: string[]) => void;
  onChangeMultiple?: (newOptions: SelectValue[]) => void;
  onInsert?: (text: string, currentOptions: SelectValue[]) => SelectValue[];
  onSetInputDisplay?: (text: string) => void;
  options: () => SelectValue[];
  setSearchText: (value: string) => void;
  stepByStepBulkCreate?: () => boolean;
  toggleOpen: (newOpen: boolean) => void;
  trimOnCreate: () => boolean;
  value: () => SelectValue[] | SelectValue | null | undefined;
  wrappedOnChange: (
    chooseOption: SelectValue | null,
  ) => SelectValue[] | SelectValue | null;
}

export interface AutoCompleteCreation {
  /** The texts that would be created from `text`, minus the ones already listed. */
  getPendingCreateList: (text: string) => string[];
  /** Runs the create action behind the dropdown's custom action button. */
  handleActionCustom: () => void;
  handleBulkCreate: (texts: string[]) => void;
  handlePaste: (event: ClipboardEvent) => void;
  /** The text the create action would turn into options. */
  insertText: Ref<string>;
  /** Splits `text` on the separators, dropping anything already selected. */
  processBulkCreate: (text: string) => string[];
  resetCreationInputs: () => void;
  setInsertText: (value: string) => void;
}

/**
 * Splits text on every separator and trims the parts, keeping the non-empty
 * ones — the full list a bulk create would produce, before any filtering.
 *
 * @example
 * ```ts
 * getFullParsedList('a, b', [','], true); // ['a', 'b']
 * ```
 *
 * @see useAutoCompleteCreation 使用這個函式的 composable
 */
export function getFullParsedList(
  text: string,
  createSeparators: string[],
  trimOnCreate: boolean,
): string[] {
  if (!text) return [];

  let parts: string[] = [text];

  createSeparators.forEach((separator) => {
    const newParts: string[] = [];

    parts.forEach((part) => {
      newParts.push(...part.split(separator));
    });

    parts = newParts;
  });

  return parts
    .map((part) => (trimOnCreate ? part.trim() : part))
    .filter((part) => part.length > 0);
}

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

/**
 * addable 模式下建立新選項的 composable。
 *
 * 依 `createSeparators` 把輸入切成多筆，跳過已選與已存在的項目，其餘交給
 * `onInsert` 建立後一次選取；`stepByStepBulkCreate` 則一次只建立第一筆，
 * 其餘留在輸入框裡。
 *
 * @example
 * ```ts
 * const creation = useAutoCompleteCreation({ addable: () => true, ... });
 * ```
 *
 * @see MznAutoComplete 使用這個 composable 的元件
 */
export function useAutoCompleteCreation(
  options: UseAutoCompleteCreationOptions,
): AutoCompleteCreation {
  const {
    addable,
    caseSensitive,
    clearNewlyCreated,
    clearUnselected,
    createSeparators,
    filterUnselected,
    isMultiple,
    isSingle,
    markCreated,
    markUnselected,
    onChangeMultiple,
    onInsert,
    onSetInputDisplay,
    options: optionsProp,
    setSearchText,
    stepByStepBulkCreate,
    toggleOpen,
    trimOnCreate,
    value,
    wrappedOnChange,
  } = options;

  const insertText = ref('');
  const isCaseSensitive = (): boolean => caseSensitive?.() ?? false;

  function resetCreationInputs(): void {
    setSearchText('');
    insertText.value = '';
  }

  function processBulkCreate(text: string): string[] {
    if (!text || !addable() || !onInsert) return [];

    const processed = getFullParsedList(
      text,
      createSeparators(),
      trimOnCreate(),
    );
    const selectedNames = new Set<string>();
    const current = value();

    if (isMultiple() && isMultipleValue(current)) {
      current.forEach((v) =>
        selectedNames.add(normalizeOptionName(v.name, isCaseSensitive())),
      );
    } else if (isSingle() && isSingleValue(current)) {
      selectedNames.add(normalizeOptionName(current.name, isCaseSensitive()));
    }

    return processed.filter(
      (part) =>
        !selectedNames.has(normalizeOptionName(part, isCaseSensitive())),
    );
  }

  function getPendingCreateList(text: string): string[] {
    const processed = processBulkCreate(text);
    const optionNames = new Set(
      optionsProp().map((o) => normalizeOptionName(o.name, isCaseSensitive())),
    );

    return processed.filter(
      (part) => !optionNames.has(normalizeOptionName(part, isCaseSensitive())),
    );
  }

  function handleBulkCreate(texts: string[]): void {
    if (!addable() || texts.length === 0 || !onInsert) return;

    let currentOptions = filterUnselected(optionsProp());

    clearUnselected();

    const itemsToAdd: SelectValue[] = [];
    const newlyCreatedIds = new Set<string>();
    const newlySelectedIds = new Set<string>();

    texts.forEach((text) => {
      const existingOption = currentOptions.find((option) =>
        isSameOptionName(option.name, text, isCaseSensitive()),
      );

      if (existingOption) {
        if (!isOptionSelected(existingOption, value(), isMultiple())) {
          itemsToAdd.push(existingOption);
        }

        return;
      }

      try {
        const updatedOptions = onInsert(text, currentOptions);

        if (!Array.isArray(updatedOptions)) return;

        const newOption = updatedOptions.find(
          (opt) => !currentOptions.some((existing) => existing.id === opt.id),
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
    });

    if (!itemsToAdd.length) return;

    if (isSingle() && itemsToAdd[0]) {
      wrappedOnChange(itemsToAdd[0]);
      newlySelectedIds.add(itemsToAdd[0].id);
    } else if (isMultiple()) {
      const current = value();
      const currentValues = isMultipleValue(current) ? current : [];
      const newItemsToAdd = itemsToAdd.filter(
        (item) => !currentValues.some((existing) => existing.id === item.id),
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

  function handleActionCustom(): void {
    if (!addable() || !insertText.value) return;

    const hasSeparator = createSeparators().some((sep) =>
      insertText.value.includes(sep),
    );

    if (stepByStepBulkCreate?.() && hasSeparator && isMultiple()) {
      const pending = getPendingCreateList(insertText.value);
      const firstPending = pending[0];

      if (!firstPending) {
        resetCreationInputs();
        onSetInputDisplay?.('');

        return;
      }

      handleBulkCreate([firstPending]);
      toggleOpen(true);

      const remaining = pending.slice(1).join(', ');

      if (remaining) {
        setSearchText(remaining);
        insertText.value = remaining;
        onSetInputDisplay?.(remaining);
      } else {
        resetCreationInputs();
        onSetInputDisplay?.('');
      }

      return;
    }

    const textsToCreate = processBulkCreate(insertText.value);

    if (textsToCreate.length > 0) {
      handleBulkCreate(textsToCreate);
      resetCreationInputs();
    }
  }

  function handlePaste(event: ClipboardEvent): void {
    if (!addable() || !onInsert) return;

    const pastedText = event.clipboardData?.getData('text');

    if (!pastedText || !isMultiple()) return;

    const hasSeparator = createSeparators().some((sep) =>
      pastedText.includes(sep),
    );

    if (!hasSeparator) return;

    if (stepByStepBulkCreate?.()) {
      event.preventDefault();

      const pendingJoin = getPendingCreateList(pastedText).join(', ');

      setSearchText(pendingJoin);
      insertText.value = pendingJoin;
      onSetInputDisplay?.(pendingJoin);

      return;
    }

    event.preventDefault();

    const textsToCreate = processBulkCreate(pastedText);

    if (textsToCreate.length > 0) {
      handleBulkCreate(textsToCreate);
      resetCreationInputs();
    }
  }

  return {
    getPendingCreateList,
    handleActionCustom,
    handleBulkCreate,
    handlePaste,
    insertText,
    processBulkCreate,
    resetCreationInputs,
    setInsertText: (next: string) => {
      insertText.value = next;
    },
  };
}
