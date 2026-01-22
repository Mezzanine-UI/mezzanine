'use client';

import {
  ChangeEventHandler,
  ClipboardEvent,
  Dispatch,
  FocusEventHandler,
  forwardRef,
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
  DropdownOption,
  DropdownStatus as DropdownStatusType,
} from '@mezzanine-ui/core/dropdown/dropdown';

import Dropdown from '../Dropdown';
import { FormControlContext } from '../Form';
import {
  useAutoCompleteValueControl,
} from '../Form/useAutoCompleteValueControl';
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
import { useAutoCompleteCreation } from './useAutoCompleteCreation';
import { useAutoCompleteKeyboard } from './useAutoCompleteKeyboard';
import { useAutoCompleteSearch } from './useAutoCompleteSearch';
import { useCreationTracker } from './useCreationTracker';

export interface AutoCompleteBaseProps
  extends Omit<
    SelectTriggerProps,
    | 'active'
    | 'clearable'
    | 'forceHideSuffixActionIcon'
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
   * Whether to keep search text visible after blur when no value is selected.
   * @default false
   */
  keepSearchTextOnBlur?: boolean;
  /**
   * The position of the input.
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
   * insert callback whenever insert icon is clicked
   * receives the text to insert and current options, returns the updated options array
   * should remove previously created but unselected options
   * The returned options will be used to update the component's options prop
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
    { setSearchText: Dispatch<SetStateAction<string>> } | undefined
  >;
  /**
   * Whether to trim whitespace from created items.
   * @default true
   */
  trimOnCreate?: boolean;
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

/**
 * Type guard to check if value is array (multiple mode)
 */
function isMultipleValue(value: SelectValue[] | SelectValue | null | undefined): value is SelectValue[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if value is single (single mode)
 */
function isSingleValue(value: SelectValue[] | SelectValue | null | undefined): value is SelectValue {
  return value !== null && value !== undefined && !Array.isArray(value);
}

/**
 * Check if an option is already selected
 */
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
 * The AutoComplete component for react. <br />
 * Note that if you need search for ONLY given options, not included your typings,
 * should considering using the `Select` component with `onSearch` prop.
 */
const AutoComplete = forwardRef<HTMLDivElement, AutoCompleteProps>(
  function AutoComplete(props, ref) {
    const {
      disabled: disabledFromFormControl,
      fullWidth: fullWidthFromFormControl,
      required: requiredFromFormControl,
      severity,
    } = useContext(FormControlContext) || {};
    const {
      addable = false,
      asyncData = false,
      className,
      createSeparators = [',', '+', '\n'],
      defaultValue,
      disabled = disabledFromFormControl || false,
      disabledOptionsFilter = false,
      emptyText,
      error = severity === 'error' || false,
      fullWidth = fullWidthFromFormControl || false,
      id,
      keepSearchTextOnBlur = false,
      inputPosition = 'outside',
      inputProps,
      inputRef,
      loading = false,
      loadingText,
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
      placeholder = '',
      prefix,
      required = requiredFromFormControl || false,
      searchDebounceTime = 300,
      searchTextControlRef,
      size,
      trimOnCreate = true,
      value: valueProp,
      createActionText,
      createActionTextTemplate = '建立 "{text}"',
      dropdownZIndex,
    } = props;

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isMultiple = mode === 'multiple';
    const isSingle = !isMultiple;
    const isOpenControlled = openProp !== undefined;
    const open = isOpenControlled ? openProp : uncontrolledOpen;

    const toggleOpen = useCallback((newOpen: boolean | ((prev: boolean) => boolean)) => {
      const nextValue = typeof newOpen === 'function' ? newOpen(open) : newOpen;

      if (!isOpenControlled) {
        setUncontrolledOpen(nextValue);
      }

      onVisibilityChange?.(nextValue);
    }, [isOpenControlled, open, onVisibilityChange]);
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
          defaultValue: isMultipleValue(defaultValue) ? defaultValue : undefined,
          disabledOptionsFilter,
          mode: 'multiple',
          onChange: onChangeProp as ((newOptions: SelectValue[]) => void) | undefined,
          onClear: onClearProp,
          onClose: () => toggleOpen(false),
          onSearch,
          options: optionsProp,
          value: isMultipleValue(valueProp) ? valueProp : undefined,
        }
        : {
          defaultValue: isSingleValue(defaultValue) ? defaultValue : undefined,
          disabledOptionsFilter,
          mode: 'single',
          onChange: onChangeProp as ((newOption: SelectValue | null) => void) | undefined,
          onClear: onClearProp,
          onClose: () => toggleOpen(false),
          onSearch,
          options: optionsProp,
          value: isSingleValue(valueProp) || valueProp === null ? valueProp : undefined,
        },
    );

    /** export set search text action to props (allow user to customize search text) */
    useImperativeHandle(searchTextControlRef, () => ({ setSearchText }));

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

    const {
      handleActionCustom,
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
      onFocus,
      onInsert,
      options,
      setSearchText,
      toggleOpen,
      trimOnCreate,
      value,
      wrappedOnChange: (chooseOption) => wrappedOnChange(chooseOption),
    });

    const {
      cancelSearch,
      isLoading,
      runSearch,
    } = useAutoCompleteSearch({
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
      [clearNewlyCreated, isMultiple, isSingle, markUnselected, onChange, value],
    );

    const nodeRef = useRef<HTMLDivElement>(null);
    const controlRef = useRef<HTMLElement>(null);
    const composedRef = useComposeRefs([ref, controlRef]);
    // In single mode, show searchText when focused, otherwise show selected value
    // In multiple mode, always return empty string to avoid displaying "0"
    const renderValue = useMemo(() => {
      if (
        isSingle
        && (focused || (keepSearchTextOnBlur && !value && searchText))
      ) {
        return () => searchText;
      }
      if (isMultiple) {
        return () => '';
      }
      return undefined;
    }, [focused, isMultiple, isSingle, keepSearchTextOnBlur, searchText, value]);

    function getPlaceholder() {
      if (isSingle && focused && isSingleValue(value)) {
        return value.name;
      }

      return placeholder;
    }

    /** Trigger input props */
    const onSearchInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const nextSearch = e.target.value;
      /** should sync both search input and value */
      setSearchText(nextSearch);
      setInsertText(nextSearch);
      onSearchTextChange?.(nextSearch);

      if (autoSelectMatchingOption(nextSearch)) return;

      if (!nextSearch) {
        cancelSearch();
        runSearch(nextSearch, { immediate: true });
        return;
      }

      runSearch(nextSearch);
    };

    const onSearchInputFocus: FocusEventHandler<HTMLInputElement> = (e) => {
      // When inputPosition is inside, let Dropdown handle the focus event
      // Otherwise, stop propagation to prevent conflicts
      if (inputPosition !== 'inside') {
        e.stopPropagation();
      }

      // Only open if not already open to avoid flickering
      // When inputPosition is inside, Dropdown will handle opening via inlineTriggerElement
      if (inputPosition !== 'inside' && !open) {
        toggleOpen(true);
      }
      onFocus(true);

      inputProps?.onFocus?.(e);
    };

    const onSearchInputBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      // When inputPosition is inside, we need special handling
      if (inputPosition === 'inside') {
        // When open is controlled, prevent default blur behavior to avoid conflicts
        // The controlled open state should be the source of truth
        if (isOpenControlled) {
          // Don't let Dropdown's onBlur close the dropdown when controlled
          // Only call onFocus(false) to update internal state
          onFocus(false);
          inputProps?.onBlur?.(e);
          return;
        }

        // For uncontrolled mode, let Dropdown handle it normally
        // Dropdown's inlineTriggerElement will handle the blur and close logic
        inputProps?.onBlur?.(e);
        return;
      }

      onFocus(false);
      inputProps?.onBlur?.(e);
    };

    const onClickSuffixActionIcon = () => {
      toggleOpen((prev) => !prev);
    };

    const searchTextExistWithoutOption: boolean =
      !!searchText &&
      options.find((option) => option.name === searchText) === undefined;

    const shouldShowCreateAction = !!(searchTextExistWithoutOption && creationEnabled && insertText);

    const context = useMemo(() => ({ onChange: wrappedOnChange, value }), [wrappedOnChange, value]);

    // Convert SelectValue[] to DropdownOption[]
    const dropdownOptions: DropdownOption[] = useMemo(() => {
      return options.map((option) => {
        const created = isCreated(option.id);
        const result: DropdownOption = {
          id: option.id,
          name: option.name,
        };

        // Set checkSite based on mode
        // Multiple mode: show checkbox at prepend
        // Single mode: show checked icon at append when selected
        if (mode === 'multiple') {
          result.checkSite = 'prefix';
        } else {
          result.checkSite = 'suffix';
        }

        // Set shortcutText to "New" for created items (persists even after selection)
        if (created) {
          result.shortcutText = 'New';
        }

        return result;
      });
    }, [isCreated, mode, options]);

    // Get selected value for dropdown
    const dropdownValue = useMemo(() => {
      if (mode === 'multiple') {
        return isMultipleValue(value) ? value.map((v) => v.id) : [];
      }
      return isSingleValue(value) ? value.id : undefined;
    }, [mode, value]);

    // Disable input when loading
    const isInputDisabled = disabled || isLoading;

    // For rendering: when loading, force options to empty to show loading status in Dropdown
    const dropdownOptionsForRender = useMemo(() => {
      if (isLoading) return [];
      return dropdownOptions;
    }, [isLoading, dropdownOptions]);

    const dropdownStatus: DropdownStatusType | undefined = isLoading
      ? 'loading'
      : dropdownOptionsForRender.length === 0
        ? 'empty'
        : undefined;

    // Handle dropdown option selection
    const handleDropdownSelect = useCallback(
      (option: DropdownOption) => {
        const selectedValue = options.find((opt) => opt.id === option.id);
        if (selectedValue) {
          wrappedOnChange(selectedValue);
          // Close dropdown after selection in single mode
          if (mode === 'single') {
            toggleOpen(false);
            onFocus(false);
          }
        }
      },
      [mode, onFocus, options, toggleOpen, wrappedOnChange],
    );

    // Active index for dropdown keyboard navigation
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const setListboxHasVisualFocus = useCallback(() => { }, []);

    // Reset activeIndex when options change
    useEffect(() => {
      if (!dropdownOptions.length) {
        setActiveIndex(null);
        return;
      }

      setActiveIndex((prev) => {
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
      handleBulkCreate,
      handleDropdownSelect,
      inputPropsOnKeyDown: inputProps?.onKeyDown,
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
    });

    // Handle visibility change from Dropdown to prevent flickering
    const handleVisibilityChange = useCallback(
      (newOpen: boolean) => {
        // Only update if state actually changed to prevent flickering
        if (newOpen !== open) {
          toggleOpen(newOpen);
        }
      },
      [open, toggleOpen],
    );

    const handlePasteWithFallback = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        handlePaste(e);
        inputProps?.onPaste?.(e);
      },
      [handlePaste, inputProps],
    );

    const autoSelectMatchingOption = useCallback(
      (keyword: string) => {
        if (!creationEnabled || !keyword.length) return false;

        const matchingOption = options.find((option) => option.name === keyword);

        if (!matchingOption) return false;

        if (isSingle) {
          if (!value) {
            wrappedOnChange(matchingOption);
            toggleOpen(false);
            onFocus(false);
            resetCreationInputs();
            return true;
          }
          return false;
        }

        const alreadySelected = isOptionSelected(matchingOption, value, isMultiple);

        if (!alreadySelected) {
          wrappedOnChange(matchingOption);
          resetCreationInputs();
          return true;
        }

        return false;
      },
      [
        creationEnabled,
        isMultiple,
        isSingle,
        onFocus,
        options,
        resetCreationInputs,
        toggleOpen,
        value,
        wrappedOnChange,
      ],
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
      onKeyDown: handleInputKeyDown,
      onPaste: handlePasteWithFallback,
      readOnly: false,
      role: 'combobox',
    };

    return (
      <SelectControlContext.Provider value={context}>
        <div
          ref={nodeRef}
          className={cx(
            classes.host,
            {
              [classes.hostFullWidth]: fullWidth,
              [classes.hostInsideClosed]: inputPosition === 'inside' && !open,
            },
          )}
        >
          <Dropdown
            actionText={
              shouldShowCreateAction
                ? (createActionText
                  ? createActionText(insertText)
                  : createActionTextTemplate.replace('{text}', insertText))
                : undefined
            }
            activeIndex={activeIndex}
            disabled={isInputDisabled}
            emptyText={emptyText}
            followText={searchText}
            inputPosition={inputPosition}
            isMatchInputValue
            listboxId={menuId}
            loadingText={loadingText}
            maxHeight={menuMaxHeight}
            mode={mode}
            onActionCustom={
              shouldShowCreateAction
                ? handleActionCustom
                : undefined
            }
            onItemHover={setActiveIndex}
            onSelect={handleDropdownSelect}
            onVisibilityChange={handleVisibilityChange}
            open={open}
            options={dropdownOptionsForRender}
            placement="bottom"
            sameWidth
            showDropdownActions={shouldShowCreateAction}
            showActionShowTopBar={shouldShowCreateAction}
            status={dropdownStatus}
            type="default"
            value={dropdownValue}
            zIndex={dropdownZIndex}
          >
            <SelectTrigger
              ref={composedRef}
              active={open}
              className={className}
              clearable
              isForceClearable
              disabled={isInputDisabled}
              fullWidth={fullWidth}
              inputRef={inputRef}
              mode={mode}
              onTagClose={wrappedOnChange}
              onClear={onClear}
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
                  if (inputPosition !== 'inside') {
                    e.stopPropagation();
                  }
                  resolvedInputProps.onClick?.(e);
                },
              }}
              searchText={searchText}
              size={size}
              showTextInputAfterTags
              suffixAction={onClickSuffixActionIcon}
              value={
                mode === 'multiple' && isMultipleValue(value) && value.length === 0
                  ? undefined
                  : value ?? undefined
              }
              {...(mode === 'single' && renderValue ? { renderValue } : {})}
            />
          </Dropdown>
        </div>
      </SelectControlContext.Provider>
    );
  },
);

export default AutoComplete;


