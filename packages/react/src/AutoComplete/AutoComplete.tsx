'use client';

import {
  ChangeEventHandler,
  ClipboardEvent,
  Dispatch,
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEvent as ReactMouseEvent,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cx } from '../utils/cx';

import {
  AutoCompleteSelector,
  autocompleteClasses as classes,
} from '@mezzanine-ui/core/autocomplete';
import {
  DropdownInputPosition,
  DropdownLoadingPosition,
  DropdownOption,
  DropdownStatus as DropdownStatusType,
} from '@mezzanine-ui/core/dropdown/dropdown';
import { selectClasses as selectTriggerClasses } from '@mezzanine-ui/core/select';

import Dropdown from '../Dropdown';
import { FormControlContext } from '../Form';
import { useAutoCompleteValueControl } from '../Form/useAutoCompleteValueControl';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { PopperProps } from '../Popper';
import { SelectControlContext } from '../Select/SelectControlContext';
import SelectTrigger from '../Select/SelectTrigger';
import type {
  SelectTriggerInputProps,
  SelectTriggerProps,
} from '../Select/typings';
import { SelectValue } from '../Select/typings';
import { PickRenameMulti } from '../utils/general';
import AutoCompleteInsideTrigger from './AutoCompleteInside';
import {
  getFullParsedList,
  useAutoCompleteCreation,
} from './useAutoCompleteCreation';
import { useAutoCompleteKeyboard } from './useAutoCompleteKeyboard';
import { useAutoCompleteSearch } from './useAutoCompleteSearch';
import { useCreationTracker } from './useCreationTracker';

export interface AutoCompleteBaseProps
  extends Omit<
    SelectTriggerProps,
    | 'active'
    | 'clearable'
    | 'forceHideSuffixActionIcon'
    | 'fullWidth'
    | 'mode'
    | 'onClick'
    | 'onKeyDown'
    | 'onChange'
    | 'renderValue'
    | 'inputProps'
    | 'suffixActionIcon'
    | 'value'
  >,
  PickRenameMulti<
    Pick<PopperProps, 'options'>,
    { options: 'popperOptions' }
  > {
  /**
   * Set to true when options can be added dynamically
   * @default false
   */
  addable?: boolean;
  /**
   * Whether the data is fetched asynchronously.
   * If true, input change will trigger loading until onSearch promise resolves.
   * @default false
   */
  asyncData?: boolean;
  /**
   * Whether to clear search text when leaving the textfield/dropdown scope.
   * When `false`, typed text persists after blur. In `single` mode, a clearable
   * icon will appear if the user has typed text without selecting an option.
   * @default true
   */
  clearSearchText?: boolean;
  /**
   * Characters that can be used to separate multiple items when creating.
   * When these characters are entered, they will trigger item creation.
   * @default [',', '+', '\n']
   */
  createSeparators?: string[];
  /**
   * Should the filter rules be disabled (If you need to control options filter by yourself)
   * @default false
   */
  disabledOptionsFilter?: boolean;
  /**
   * The text of the dropdown empty status.
   */
  emptyText?: string;
  /**
   * The id attribute of the input element.
   *
   * @important When using with react-hook-form or native forms, this prop is recommended.
   */
  id?: string;
  /**
   * The position of the search input relative to the dropdown.
   * - `'outside'`: input is always visible above the dropdown (default trigger layout).
   * - `'inside'`: input is rendered inside the dropdown panel; the trigger shows only
   *   the selected value(s) and opens the dropdown on click.
   * @default 'outside'
   */
  inputPosition?: DropdownInputPosition;
  /**
   * The other native props for input element.
   */
  inputProps?: Omit<
    SelectTriggerInputProps,
    | 'onChange'
    | 'placeholder'
    | 'role'
    | 'value'
    | `aria-${'controls' | 'expanded' | 'owns'}`
  >;
  /**
   * Whether the dropdown is in loading state.
   * @default false
   */
  loading?: boolean;
  /**
   * The text of the dropdown loading status.
   */
  loadingText?: string;
  /**
   * The position to display the loading status.
   * Only takes effect when `loading` is true.
   * @default 'bottom'
   */
  loadingPosition?: DropdownLoadingPosition;
  /**
   * The max height of the dropdown list.
   */
  menuMaxHeight?: number | string;
  /**
   * The name attribute of the input element.
   *
   * @important When using with react-hook-form or native forms, this prop is recommended.
   *
   * @example With react-hook-form
   * ```tsx
   * const { register } = useForm();
   * <AutoComplete name="autocomplete" {...register('autocomplete')} />
   * ```
   */
  name?: string;
  /**
   * Callback fired when the user confirms a new item creation.
   * Receives the typed text and the current options array; must return the updated options array.
   * Use this to append the new item to your options state.
   * Required when `addable` is true; omitting it will disable the creation feature.
   */
  onInsert?(text: string, currentOptions: SelectValue[]): SelectValue[];
  /**
   * The search event handler
   * Can return a Promise for async data loading
   */
  onSearch?(input: string): void | Promise<void>;
  /**
   * Callback fired on every input change (no debounce).
   */
  onSearchTextChange?(text: string): void;
  /**
   * Callback fired when the dropdown visibility changes.
   */
  onVisibilityChange?: (open: boolean) => void;
  /**
   * Whether the dropdown is open (controlled).
   */
  open?: boolean;
  /**
   * The options that mapped autocomplete options
   */
  options: SelectValue[];
  /**
   * select input placeholder
   */
  placeholder?: string;
  /**
   * Whether the selection is required.
   * @default false
   */
  required?: boolean;
  /**
   * The debounce time of the search event handler.
   * @default 300
   */
  searchDebounceTime?: number;
  /**
   * Imperative handle to control search text externally (e.g. reset or sync).
   */
  searchTextControlRef?: RefObject<
    | {
      reset: () => void;
      setSearchText: Dispatch<SetStateAction<string>>;
    }
    | undefined
  >;
  /**
   * Whether to trim whitespace from created items.
   * @default true
   */
  trimOnCreate?: boolean;
  /**
   * When true, pasted bulk text is kept in the input and user creates one item at a time
   * (create button shows only the first pending item; after create, input updates to remaining).
   * When false, pasted bulk text creates all items at once (default).
   * @default false
   */
  stepByStepBulkCreate?: boolean;
  /**
   * Custom text for the create action button.
   * @default '建立 "{text}"'
   */
  createActionText?: (text: string) => string;
  /**
   * Default template for the create action button text.
   * Use this to customize the default text format when createActionText is not provided.
   * The template should contain {text} placeholder which will be replaced with the actual text.
   * @default '建立 "{text}"'
   */
  createActionTextTemplate?: string;
  /**
   * The z-index of the dropdown.
   */
  dropdownZIndex?: number | string;
  /**
   * Whether to enable portal for the dropdown.
   * @default true
   */
  globalPortal?: boolean;
  /**
   * Callback fired when the dropdown list reaches the bottom.
   * Only fires when `menuMaxHeight` is set and the list is scrollable.
   */
  onReachBottom?: () => void;
  /**
   * Callback fired when the dropdown list leaves the bottom.
   * Only fires when `menuMaxHeight` is set and the list is scrollable.
   */
  onLeaveBottom?: () => void;
  /**
   * Called when the dropdown closes (on blur or Escape) and `addable` mode has
   * items that were created but never selected.
   * Receives the cleaned options array with unselected created items already removed.
   * Use this to sync your options state and strip the dangling created entries.
   * Only called when `addable` is true and there are unselected created items.
   */
  onRemoveCreated?(cleanedOptions: SelectValue[]): void;
}

export type AutoCompleteMultipleProps = AutoCompleteBaseProps & {
  /**
   * The default selection
   */
  defaultValue?: SelectValue[];
  /**
   * Controls the layout of trigger.
   */
  mode: 'multiple';
  /**
   * The change event handler of input element.
   */
  onChange?(newOptions: SelectValue[]): void;
  /**
   * Tag overflow strategy:
   * - counter: collapse extra tags into a counter tag showing the remaining count.
   * - wrap: wrap to new lines to display all tags.
   * @default 'counter'
   *
   */
  overflowStrategy?: 'counter' | 'wrap';
  /**
   * The selector of input.
   * @default 'input'
   */
  selector?: AutoCompleteSelector;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[];
};

export type AutoCompleteSingleProps = AutoCompleteBaseProps & {
  /**
   * The default selection
   */
  defaultValue?: SelectValue;
  /**
   * Controls the layout of trigger.
   */
  mode?: 'single';
  /**
   * The change event handler of input element.
   */
  onChange?(newOptions: SelectValue): void;
  /**
   * The selector of input.
   * @default 'input'
   */
  selector?: AutoCompleteSelector;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue | null;
};

export type AutoCompleteProps =
  | AutoCompleteMultipleProps
  | AutoCompleteSingleProps;

const MENU_ID_PREFIX = 'mzn-select-autocomplete-menu-id';
const BLUR_RESET_OPTIONS_DELAY = 120;

/**
 * Type guard to check if value is array (multiple mode)
 */
function isMultipleValue(
  value: SelectValue[] | SelectValue | null | undefined,
): value is SelectValue[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if value is single (single mode)
 */
function isSingleValue(
  value: SelectValue[] | SelectValue | null | undefined,
): value is SelectValue {
  return value !== null && value !== undefined && !Array.isArray(value);
}

/**
 * 自動完成輸入元件，在使用者輸入時即時顯示符合的下拉選項。
 *
 * 支援 `single`（單選）與 `multiple`（多選標籤）兩種模式；`inputPosition` 控制搜尋輸入框
 * 位於下拉選單外（`'outside'`，預設）或內（`'inside'`）。設定 `addable` 與 `onInsert`
 * 可讓使用者動態建立不在選項清單中的項目。`asyncData` 搭配 `onSearch` 可實現非同步搜尋，
 * 輸入時觸發 debounce 查詢並顯示 loading 狀態。若僅需從固定選項中搜尋，請改用 `Select` 元件。
 *
 * @example
 * ```tsx
 * import AutoComplete from '@mezzanine-ui/react/AutoComplete';
 *
 * // 單選基本用法
 * <AutoComplete
 *   mode="single"
 *   options={[{ id: '1', name: 'Apple' }, { id: '2', name: 'Banana' }]}
 *   value={selected}
 *   onChange={setSelected}
 *   placeholder="請搜尋..."
 * />
 *
 * // 多選模式
 * <AutoComplete
 *   mode="multiple"
 *   options={options}
 *   value={selectedList}
 *   onChange={setSelectedList}
 * />
 *
 * // 搜尋框置於下拉選單內（inside 模式）
 * <AutoComplete
 *   mode="multiple"
 *   inputPosition="inside"
 *   options={options}
 *   value={selectedList}
 *   onChange={setSelectedList}
 * />
 *
 * // 非同步搜尋
 * <AutoComplete
 *   mode="single"
 *   asyncData
 *   options={asyncOptions}
 *   onSearch={async (text) => { const res = await fetchOptions(text); setAsyncOptions(res); }}
 *   value={selected}
 *   onChange={setSelected}
 * />
 *
 * // 可新增選項
 * <AutoComplete
 *   mode="multiple"
 *   addable
 *   options={options}
 *   onInsert={(text, current) => [...current, { id: text, name: text }]}
 *   value={selectedList}
 *   onChange={setSelectedList}
 * />
 * ```
 *
 * @see {@link Select} 從固定選項清單中選取時使用
 * @see {@link Input} 純文字輸入欄位
 * @see {@link useAutoCompleteValueControl} 管理 AutoComplete 內部值狀態的 hook
 */
const AutoComplete = forwardRef<HTMLDivElement, AutoCompleteProps>(
  function AutoComplete(props, ref) {
    const {
      disabled: disabledFromFormControl,
      required: requiredFromFormControl,
      severity,
    } = useContext(FormControlContext) || {};
    const {
      addable = false,
      asyncData = false,
      className,
      clearSearchText = true,
      createSeparators = [',', '+', '\n'],
      defaultValue,
      disabled = disabledFromFormControl || false,
      disabledOptionsFilter = false,
      emptyText = '沒有符合的項目',
      error = severity === 'error' || false,
      id,
      inputPosition = 'outside',
      inputProps,
      inputRef,
      loading = false,
      loadingText = '載入中...',
      loadingPosition = 'bottom',
      menuMaxHeight,
      mode = 'single',
      name,
      onClear: onClearProp,
      onChange: onChangeProp,
      onInsert,
      onSearch,
      onSearchTextChange,
      onVisibilityChange,
      open: openProp,
      options: optionsProp,
      overflowStrategy,
      placeholder = '',
      prefix,
      required = requiredFromFormControl || false,
      searchDebounceTime = 300,
      searchTextControlRef,
      size,
      stepByStepBulkCreate = false,
      trimOnCreate = true,
      value: valueProp,
      createActionText,
      createActionTextTemplate = '建立 "{text}"',
      dropdownZIndex,
      globalPortal = true,
      onReachBottom,
      onLeaveBottom,
      onRemoveCreated,
    } = props;
    const shouldClearSearchTextOnBlur = clearSearchText;

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isMultiple = mode === 'multiple';
    const isSingle = !isMultiple;
    const isOpenControlled = openProp !== undefined;
    const open = isOpenControlled ? openProp : uncontrolledOpen;

    const toggleOpen = useCallback(
      (newOpen: boolean | ((prev: boolean) => boolean)) => {
        const nextValue =
          typeof newOpen === 'function' ? newOpen(open) : newOpen;

        if (!isOpenControlled) {
          setUncontrolledOpen(nextValue);
        }

        onVisibilityChange?.(nextValue);
      },
      [isOpenControlled, open, onVisibilityChange],
    );
    const {
      focused,
      onFocus,
      onChange,
      onClear,
      options,
      searchText,
      setSearchText,
      value,
    } = useAutoCompleteValueControl(
      isMultiple
        ? {
          defaultValue: isMultipleValue(defaultValue)
            ? defaultValue
            : undefined,
          disabledOptionsFilter,
          getOptionsFilterQuery:
            stepByStepBulkCreate && addable && onInsert
              ? (st) => {
                const full = getFullParsedList(
                  st,
                  createSeparators,
                  trimOnCreate,
                );
                return full.length > 1 ? (full[0] ?? undefined) : undefined;
              }
              : undefined,
          mode: 'multiple',
          onChange: onChangeProp as
            | ((newOptions: SelectValue[]) => void)
            | undefined,
          onClear: onClearProp,
          onClose: () => toggleOpen(false),
          onSearch,
          options: optionsProp,
          value: isMultipleValue(valueProp) ? valueProp : undefined,
        }
        : {
          defaultValue: isSingleValue(defaultValue)
            ? defaultValue
            : undefined,
          disabledOptionsFilter,
          mode: 'single',
          onChange: onChangeProp as
            | ((newOption: SelectValue | null) => void)
            | undefined,
          onClear: onClearProp,
          onClose: () => toggleOpen(false),
          onSearch,
          options: optionsProp,
          value:
            isSingleValue(valueProp) || valueProp === null
              ? valueProp
              : undefined,
        },
    );

    /** export set search text action to props (allow user to customize search text) */
    useImperativeHandle(searchTextControlRef, () => ({
      reset: resetSearchInputsAndOptions,
      setSearchText,
    }));

    /** Track created items (new, unselected, all) */
    const {
      clearUnselected,
      filterUnselected,
      isCreated,
      markCreated,
      clearNewlyCreated,
      markUnselected,
    } = useCreationTracker();

    const creationEnabled = addable && typeof onInsert === 'function';
    useEffect(() => {
      if (addable && !onInsert) {
        console.warn(
          '[AutoComplete] `addable` 已開啟但未提供 `onInsert`，已停用建立功能。',
        );
      }
    }, [addable, onInsert]);

    const idSeed = useId();
    const menuId = useMemo(() => `${MENU_ID_PREFIX}-${idSeed}`, [idSeed]);

    const inputElementRef = useRef<HTMLInputElement>(null);
    const onSetInputDisplay = useCallback((text: string) => {
      if (inputElementRef.current) {
        inputElementRef.current.value = text;
      }
    }, []);

    const {
      getPendingCreateList,
      handleActionCustom: handleActionCustomBase,
      handleBulkCreate,
      handlePaste,
      insertText,
      processBulkCreate,
      resetCreationInputs,
      setInsertText,
    } = useAutoCompleteCreation({
      addable: creationEnabled,
      clearUnselected,
      createSeparators,
      filterUnselected,
      isMultiple,
      isSingle,
      markCreated,
      clearNewlyCreated,
      markUnselected,
      onChangeMultiple: isMultiple
        ? (onChangeProp as ((newOptions: SelectValue[]) => void) | undefined)
        : undefined,
      onInsert,
      onSetInputDisplay,
      options: optionsProp,
      setSearchText,
      stepByStepBulkCreate,
      toggleOpen,
      trimOnCreate,
      value,
      wrappedOnChange: (chooseOption) => wrappedOnChange(chooseOption),
    });

    const handleActionCustom = useCallback(() => {
      suppressNextCloseRef.current = true;
      handleActionCustomBase();
      window.setTimeout(() => {
        suppressNextCloseRef.current = false;
      }, 0);
    }, [handleActionCustomBase]);

    const { cancelSearch, isLoading, runSearch } = useAutoCompleteSearch({
      asyncData,
      loading,
      onSearch,
      searchDebounceTime,
    });

    // Wrap onChange to track unselected created items
    const wrappedOnChange = useCallback(
      (chooseOption: SelectValue | null) => {
        const result = onChange(chooseOption);
        if (chooseOption) {
          clearNewlyCreated([chooseOption.id]);
        }

        // In multiple mode, check if any created items were unselected
        if (isMultiple && isMultipleValue(value) && isMultipleValue(result)) {
          // Find items that were in value but not in result (unselected)
          const unselectedItems = value.filter(
            (v) => !result.some((r) => r.id === v.id),
          );

          // If any unselected item was created via onInsert, track it
          markUnselected(unselectedItems.map((item) => item.id));
        } else if (isSingle && isSingleValue(value) && !result) {
          // In single mode, if value was cleared and it was a created item, track it
          markUnselected([value.id]);
        }

        return result;
      },
      [
        clearNewlyCreated,
        isMultiple,
        isSingle,
        markUnselected,
        onChange,
        value,
      ],
    );

    const nodeRef = useRef<HTMLDivElement>(null);
    const controlRef = useRef<HTMLElement>(null);
    const resetOptionsTimeoutRef = useRef<number | null>(null);
    const skipNextMultipleCloseResetRef = useRef(false);
    const suppressNextCloseRef = useRef(false);
    const composedRef = useComposeRefs([ref, controlRef]);
    const composedInputRef = useComposeRefs([inputRef, inputElementRef]);
    const clearPendingOptionsReset = useCallback(() => {
      if (resetOptionsTimeoutRef.current !== null) {
        window.clearTimeout(resetOptionsTimeoutRef.current);
        resetOptionsTimeoutRef.current = null;
      }
    }, []);
    const clearSearchInputDisplay = useCallback(() => {
      if (inputElementRef.current) {
        inputElementRef.current.value = '';
      }
    }, []);
    const resetSearchInputs = useCallback(() => {
      resetCreationInputs();
      clearSearchInputDisplay();
    }, [clearSearchInputDisplay, resetCreationInputs]);

    const resetSearchInputsAndOptions = useCallback(() => {
      resetSearchInputs();
      clearPendingOptionsReset();
      cancelSearch();
      resetOptionsTimeoutRef.current = window.setTimeout(() => {
        runSearch('', { immediate: true });
        resetOptionsTimeoutRef.current = null;
      }, BLUR_RESET_OPTIONS_DELAY);
    }, [cancelSearch, clearPendingOptionsReset, resetSearchInputs, runSearch]);

    const cleanupUnselectedCreated = useCallback(() => {
      if (!creationEnabled || typeof onRemoveCreated !== 'function') return;

      const cleanedOptions = filterUnselected(optionsProp);
      if (cleanedOptions.length === optionsProp.length) return;

      clearUnselected();
      onRemoveCreated(cleanedOptions);
    }, [
      clearUnselected,
      creationEnabled,
      filterUnselected,
      onRemoveCreated,
      optionsProp,
    ]);

    useEffect(
      () => () => {
        clearPendingOptionsReset();
      },
      [clearPendingOptionsReset],
    );

    useEffect(() => {
      // Multiple mode bridge only applies to SelectTrigger (tags) rendering.
      // In `inputPosition="inside"` we render a plain Input trigger, so the hidden
      // SelectTrigger input bridge is not needed.
      if (!isMultiple || inputPosition === 'inside') return;

      const hiddenTriggerInput =
        nodeRef.current?.querySelector<HTMLInputElement>(
          `.${selectTriggerClasses.triggerInput}`,
        );

      if (!hiddenTriggerInput) return;

      const hasSelectedValue = isMultipleValue(value) && value.length > 0;
      const bridgeValue = searchText || (hasSelectedValue ? '\u200B' : '');

      if (hiddenTriggerInput.value === bridgeValue) return;

      hiddenTriggerInput.value = bridgeValue;
      hiddenTriggerInput.dispatchEvent(new Event('change', { bubbles: true }));
    }, [inputPosition, isMultiple, searchText, value]);

    // In single mode, show searchText when focused, otherwise show selected value
    // In multiple mode, always return empty string to avoid displaying "0"
    const renderValue = useMemo(() => {
      if (
        isSingle &&
        (focused || (!shouldClearSearchTextOnBlur && !value && searchText))
      ) {
        return () => searchText;
      }
      if (isMultiple) {
        return () => '';
      }
      return undefined;
    }, [
      focused,
      isMultiple,
      isSingle,
      searchText,
      shouldClearSearchTextOnBlur,
      value,
    ]);

    const insideInputValue = useMemo(() => {
      // Inside trigger is a plain Input, so we must decide what to display.
      // - multiple: always show current search text
      // - single: show search text when focused (or when clear-on-blur is disabled)
      if (isMultiple) return searchText;

      if (
        isSingle &&
        (focused || (!shouldClearSearchTextOnBlur && !value && searchText))
      ) {
        return searchText;
      }

      if (isSingleValue(value)) return value.name;
      return '';
    }, [
      focused,
      isMultiple,
      isSingle,
      searchText,
      shouldClearSearchTextOnBlur,
      value,
    ]);

    function getPlaceholder() {
      if (isSingle && focused && isSingleValue(value)) {
        return value.name;
      }

      return placeholder;
    }

    /** Trigger input props */
    const onSearchInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      clearPendingOptionsReset();
      const nextSearch = e.target.value;
      /** should sync both search input and value */
      setSearchText(nextSearch);
      setInsertText(nextSearch);
      onSearchTextChange?.(nextSearch);

      if (!nextSearch) {
        cancelSearch();
        runSearch(nextSearch, { immediate: true });
        return;
      }

      runSearch(nextSearch);
    };

    const onSearchInputFocus: FocusEventHandler<HTMLInputElement> = (e) => {
      skipNextMultipleCloseResetRef.current = false;
      clearPendingOptionsReset();
      // When inputPosition is inside, let Dropdown handle the focus event
      // Otherwise, stop propagation to prevent conflicts
      if (inputPosition !== 'inside') {
        e.stopPropagation();
      }

      // Only open if not already open to avoid flickering
      // Ensure inside/uncontrolled can open from the native input focus.
      if (!open) {
        toggleOpen(true);
      }
      onFocus(true);

      inputProps?.onFocus?.(e);
    };

    const onSearchInputBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      // In multiple mode while dropdown is open, defer clearing to visibility change.
      // This prevents clearing on intermediate blur triggered by dropdown interactions.
      const shouldDeferMultipleBlurReset = isMultiple && open;

      // When inputPosition is inside, we need special handling
      if (inputPosition === 'inside') {
        // When open is controlled, prevent default blur behavior to avoid conflicts
        // The controlled open state should be the source of truth
        if (isOpenControlled) {
          // Don't let Dropdown's onBlur close the dropdown when controlled
          // Only call onFocus(false) to update internal state
          onFocus(false);
          // Clear search text and insert text when blur clear behavior is enabled
          if (shouldClearSearchTextOnBlur && !shouldDeferMultipleBlurReset) {
            resetSearchInputsAndOptions();
            cleanupUnselectedCreated();
          }
          inputProps?.onBlur?.(e);
          return;
        }

        // For uncontrolled mode, let Dropdown handle it normally
        // Dropdown's inlineTriggerElement will handle the blur and close logic
        // Clear search text and insert text when blur clear behavior is enabled
        if (shouldClearSearchTextOnBlur && !shouldDeferMultipleBlurReset) {
          resetSearchInputsAndOptions();
          cleanupUnselectedCreated();
        }
        inputProps?.onBlur?.(e);
        return;
      }

      onFocus(false);
      // Clear search text and insert text when blur clear behavior is enabled
      if (shouldClearSearchTextOnBlur && !shouldDeferMultipleBlurReset) {
        resetSearchInputsAndOptions();
        cleanupUnselectedCreated();
      }
      inputProps?.onBlur?.(e);
    };

    const handleClear = useCallback(
      (e: ReactMouseEvent<Element>) => {
        if (isSingle && isSingleValue(value)) {
          markUnselected([value.id]);
        }
        onClear(e);
        resetSearchInputs();
      },
      [isSingle, markUnselected, onClear, resetSearchInputs, value],
    );

    const onClickSuffixActionIcon = () => {
      toggleOpen((prev) => !prev);
    };

    const hasStepByStepBulkSeparator =
      stepByStepBulkCreate &&
      createSeparators.some((sep) => insertText.includes(sep));
    const firstPendingText = hasStepByStepBulkSeparator
      ? getPendingCreateList(insertText)[0]
      : undefined;

    const searchTextExistWithoutOption: boolean = !!(firstPendingText
      ? firstPendingText &&
      options.find((option) => option.name === firstPendingText) === undefined
      : searchText &&
      options.find((option) => option.name === searchText) === undefined);

    const shouldShowCreateAction = !!(
      searchTextExistWithoutOption &&
      creationEnabled &&
      (firstPendingText ?? insertText)
    );

    const createActionDisplayText =
      firstPendingText !== undefined && firstPendingText !== ''
        ? firstPendingText
        : insertText;

    const context = useMemo(
      () => ({ onChange: wrappedOnChange, value }),
      [wrappedOnChange, value],
    );

    // Convert SelectValue[] to DropdownOption[] (created options first)
    const dropdownOptions: DropdownOption[] = useMemo(() => {
      const sortedOptions = [...options].sort(
        (a, b) => (isCreated(b.id) ? 1 : 0) - (isCreated(a.id) ? 1 : 0),
      );
      return sortedOptions.map((option) => {
        const created = isCreated(option.id);
        const result: DropdownOption = {
          id: option.id,
          name: option.name,
        };

        // Set checkSite based on mode and input position.
        // - inside + multiple: keep multiple behavior, but render single-like checked icon
        //   at suffix to match product visual expectation.
        // - outside + multiple: render checkbox at prefix.
        // - single: render checked icon at suffix.
        if (mode === 'multiple') {
          result.checkSite = inputPosition === 'inside' ? 'suffix' : 'prefix';
        } else {
          result.checkSite = 'suffix';
        }

        // Set shortcutText to "New" for created items (persists even after selection)
        if (created) {
          result.shortcutText = 'New';
        }

        return result;
      });
    }, [inputPosition, isCreated, mode, options]);

    // Get selected value for dropdown
    const dropdownValue = useMemo(() => {
      if (mode === 'multiple') {
        return isMultipleValue(value) ? value.map((v) => v.id) : [];
      }
      return isSingleValue(value) ? value.id : undefined;
    }, [mode, value]);

    // Disable input when loading
    const isInputDisabled = disabled || (!asyncData && isLoading);

    const dropdownStatus: DropdownStatusType | undefined = isLoading
      ? 'loading'
      : dropdownOptions.length === 0
        ? 'empty'
        : undefined;
    const shouldForceClearable = isMultiple
      ? (isMultipleValue(value) && value.length > 0) ||
      searchText.trim().length > 0
      : isSingleValue(value) ||
      (!shouldClearSearchTextOnBlur && searchText.trim().length > 0);

    // Handle dropdown option selection
    const handleDropdownSelect = useCallback(
      (option: DropdownOption) => {
        const selectedValue = options.find((opt) => opt.id === option.id);
        if (selectedValue) {
          // Close dropdown after selection in single mode
          if (mode === 'single') {
            // Update searchText first to prevent showing old value
            setSearchText(selectedValue.name);
            setInsertText(selectedValue.name);
            // Then update value and focus state
            wrappedOnChange(selectedValue);
            toggleOpen(false);
            onFocus(false);
          } else {
            skipNextMultipleCloseResetRef.current = true;
            wrappedOnChange(selectedValue);
            // In multiple mode, keep current filter text after selecting an item.
            // Search text is cleared only when blur/close actually leaves the scope.
          }
        }
      },
      [
        mode,
        onFocus,
        options,
        setSearchText,
        setInsertText,
        toggleOpen,
        wrappedOnChange,
      ],
    );

    // Active index for dropdown keyboard navigation
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    // Keyboard-only active index: only set by arrow key navigation, not mouse hover.
    // Drives the focus ring (--keyboard-active CSS class) separately from hover highlight.
    const [keyboardActiveIndex, setKeyboardActiveIndex] = useState<
      number | null
    >(null);
    const setListboxHasVisualFocus = useCallback((_focus: boolean) => { }, []);

    // Reset activeIndex and keyboardActiveIndex when options change
    useEffect(() => {
      if (!dropdownOptions.length) {
        setActiveIndex(null);
        setKeyboardActiveIndex(null);
        return;
      }

      setActiveIndex((prev) => {
        if (prev === null) return null;
        return Math.min(prev, dropdownOptions.length - 1);
      });
      setKeyboardActiveIndex((prev) => {
        if (prev === null) return null;
        return Math.min(prev, dropdownOptions.length - 1);
      });
    }, [dropdownOptions.length]);

    // Scroll to active option when activeIndex changes
    useEffect(() => {
      if (!open || activeIndex === null) return;

      requestAnimationFrame(() => {
        const activeOption = document.getElementById(
          `${menuId}-option-${activeIndex}`,
        );

        activeOption?.scrollIntoView({ block: 'nearest' });
      });
    }, [activeIndex, menuId, open]);

    // Compute aria-activedescendant
    const ariaActivedescendant = useMemo(() => {
      if (activeIndex !== null && dropdownOptions[activeIndex]) {
        return `${menuId}-option-${activeIndex}`;
      }
      return undefined;
    }, [activeIndex, dropdownOptions, menuId]);

    const { handleInputKeyDown } = useAutoCompleteKeyboard({
      activeIndex,
      addable: creationEnabled,
      createSeparators,
      dropdownOptions,
      handleActionCustom,
      handleBulkCreate,
      handleDropdownSelect,
      inputPropsOnKeyDown: inputProps?.onKeyDown,
      inputRef: inputElementRef,
      isMultiple,
      mode,
      onFocus,
      open,
      processBulkCreate,
      searchText,
      searchTextExistWithoutOption,
      setActiveIndex,
      setKeyboardActiveIndex,
      setInsertText,
      setListboxHasVisualFocus,
      setSearchText,
      stepByStepBulkCreate,
      toggleOpen,
      value,
      wrappedOnChange,
    });

    const onSearchInputKeyDown: KeyboardEventHandler<HTMLInputElement> =
      useCallback(
        (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            toggleOpen(false);
            setActiveIndex(null);
            setKeyboardActiveIndex(null);
            setListboxHasVisualFocus(false);
            onFocus(false);
            if (isMultiple && shouldClearSearchTextOnBlur) {
              resetSearchInputsAndOptions();
              cleanupUnselectedCreated();
            }
            inputElementRef.current?.blur();
            inputProps?.onKeyDown?.(e);
            return;
          }

          handleInputKeyDown(e);
        },
        [
          cleanupUnselectedCreated,
          handleInputKeyDown,
          inputProps,
          isMultiple,
          onFocus,
          resetSearchInputsAndOptions,
          setActiveIndex,
          setKeyboardActiveIndex,
          setListboxHasVisualFocus,
          shouldClearSearchTextOnBlur,
          toggleOpen,
        ],
      );

    // Handle visibility change from Dropdown to prevent flickering
    const handleVisibilityChange = useCallback(
      (newOpen: boolean) => {
        // Suppress spurious closes triggered immediately after create action
        if (!newOpen && suppressNextCloseRef.current) {
          suppressNextCloseRef.current = false;
          return;
        }

        // Only update if state actually changed to prevent flickering
        if (newOpen !== open) {
          toggleOpen(newOpen);
        }

        // In multiple mode, blur/close can be driven by Dropdown visibility updates.
        // Keep input text cleanup consistent even when native input blur is not triggered.
        if (!newOpen) {
          setKeyboardActiveIndex(null);
        }

        if (!newOpen && isMultiple && shouldClearSearchTextOnBlur) {
          if (skipNextMultipleCloseResetRef.current) {
            const menuElement = document.getElementById(menuId);
            const activeElement = document.activeElement;
            const activeWithinHost = !!(
              activeElement &&
              (nodeRef.current?.contains(activeElement) ||
                (menuElement && menuElement.contains(activeElement)))
            );

            skipNextMultipleCloseResetRef.current = false;
            if (activeWithinHost) {
              return;
            }
          }

          resetSearchInputsAndOptions();
          cleanupUnselectedCreated();
        }
      },
      [
        cleanupUnselectedCreated,
        isMultiple,
        menuId,
        open,
        resetSearchInputsAndOptions,
        setKeyboardActiveIndex,
        shouldClearSearchTextOnBlur,
        toggleOpen,
      ],
    );

    const handlePasteWithFallback = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        handlePaste(e);
        inputProps?.onPaste?.(e);
      },
      [handlePaste, inputProps],
    );

    const resolvedInputProps: SelectTriggerInputProps = {
      ...inputProps,
      'aria-activedescendant': ariaActivedescendant,
      'aria-controls': menuId,
      'aria-expanded': open,
      'aria-owns': menuId,
      id: id ?? inputProps?.id,
      name: name ?? inputProps?.name,
      onBlur: onSearchInputBlur,
      onChange: onSearchInputChange,
      onFocus: onSearchInputFocus,
      onKeyDown: onSearchInputKeyDown,
      onPaste: handlePasteWithFallback,
      readOnly: false,
      role: 'combobox',
    };

    return (
      <SelectControlContext.Provider value={context}>
        <div
          ref={nodeRef}
          className={cx(classes.host, {
            [classes.hostInsideClosed]: inputPosition === 'inside' && !open,
            [classes.hostMode(mode)]: mode,
          })}
        >
          <Dropdown
            actionText={
              shouldShowCreateAction
                ? createActionText
                  ? createActionText(createActionDisplayText)
                  : createActionTextTemplate.replace(
                    '{text}',
                    createActionDisplayText,
                  )
                : undefined
            }
            activeIndex={activeIndex}
            keyboardActiveIndex={keyboardActiveIndex}
            disabled={isInputDisabled}
            emptyText={emptyText}
            followText={searchText}
            inputPosition={inputPosition}
            isMatchInputValue
            listboxId={menuId}
            loadingText={loadingText}
            loadingPosition={loadingPosition}
            maxHeight={menuMaxHeight}
            mode={mode}
            onActionCustom={
              shouldShowCreateAction ? handleActionCustom : undefined
            }
            onItemHover={setActiveIndex}
            onSelect={handleDropdownSelect}
            onVisibilityChange={handleVisibilityChange}
            open={open}
            options={asyncData && isLoading ? [] : dropdownOptions}
            placement="bottom"
            sameWidth
            showDropdownActions={shouldShowCreateAction}
            showActionShowTopBar={shouldShowCreateAction}
            status={dropdownStatus}
            toggleCheckedOnClick={
              inputPosition === 'inside' && mode === 'multiple' ? false : undefined
            }
            type="default"
            value={dropdownValue}
            zIndex={dropdownZIndex}
            globalPortal={globalPortal}
            onReachBottom={onReachBottom}
            onLeaveBottom={onLeaveBottom}
          >
            {inputPosition === 'inside' ? (
              <AutoCompleteInsideTrigger
                active={open}
                className={className}
                clearable={shouldForceClearable}
                disabled={isInputDisabled}
                error={error}
                inputRef={composedInputRef}
                onClear={handleClear}
                placeholder={getPlaceholder()}
                resolvedInputProps={{
                  ...resolvedInputProps,
                  onClick: (e: ReactMouseEvent<HTMLInputElement>) => {
                    resolvedInputProps.onClick?.(e);
                  },
                }}
                size={size}
                value={insideInputValue}
              />
            ) : (
              <SelectTrigger
                ref={composedRef}
                active={open}
                className={className}
                clearable
                disabled={isInputDisabled}
                fullWidth
                isForceClearable={shouldForceClearable}
                inputRef={composedInputRef}
                mode={mode}
                onTagClose={wrappedOnChange}
                onClear={handleClear}
                overflowStrategy={
                  isMultiple ? (overflowStrategy ?? 'wrap') : overflowStrategy
                }
                placeholder={getPlaceholder()}
                prefix={prefix}
                readOnly={false}
                required={required}
                type={error ? 'error' : 'default'}
                inputProps={{
                  ...resolvedInputProps,
                  onClick: (e: ReactMouseEvent<HTMLInputElement>) => {
                    // When inputPosition is inside, let Dropdown handle the click event
                    // Otherwise, stop propagation to prevent conflicts
                    // This branch is only rendered when `inputPosition !== 'inside'`.
                    e.stopPropagation();
                    resolvedInputProps.onClick?.(e);
                  },
                }}
                searchText={searchText}
                size={size}
                showTextInputAfterTags
                suffixAction={onClickSuffixActionIcon}
                value={
                  mode === 'multiple' &&
                    isMultipleValue(value) &&
                    value.length === 0
                    ? undefined
                    : (value ?? undefined)
                }
                {...(mode === 'single' && renderValue ? { renderValue } : {})}
              />
            )}
          </Dropdown>
        </div>
      </SelectControlContext.Provider>
    );
  },
);

export default AutoComplete;
