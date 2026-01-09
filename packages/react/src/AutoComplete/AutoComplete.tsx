'use client';

import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import {
  ChangeEventHandler,
  Dispatch,
  FocusEventHandler,
  forwardRef,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
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
import {
  SelectInputSize,
} from '@mezzanine-ui/core/select';

import Dropdown from '../Dropdown';
import { createDropdownKeydownHandler } from '../Dropdown/dropdownKeydownHandler';
import { FormControlContext } from '../Form';
import {
  UseAutoCompleteMultipleValueControl,
  UseAutoCompleteSingleValueControl,
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
    | 'size'
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
   */
  onSearch?(input: string): void;
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
   * The size of input.
   */
  size?: SelectInputSize;
  /**
   * Whether to trim whitespace from created items.
   * @default true
   */
  trimOnCreate?: boolean;
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
  onChange?(newOptions: SelectValue[]): any;
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
  onChange?(newOptions: SelectValue): any;
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

const MENU_ID = 'mzn-select-autocomplete-menu-id';

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
    } = useAutoCompleteValueControl({
      defaultValue,
      disabledOptionsFilter,
      mode,
      onChange: onChangeProp,
      onClear: onClearProp,
      onClose: () => toggleOpen(false),
      onSearch,
      options: optionsProp,
      value: valueProp,
    } as
      | UseAutoCompleteMultipleValueControl
      | UseAutoCompleteSingleValueControl);

    /** export set search text action to props (allow user to customize search text) */
    useImperativeHandle(searchTextControlRef, () => ({ setSearchText }));

    /** insert feature */
    const [insertText, setInsertText] = useState<string>('');
    /** internal loading state for async flow */
    const [internalLoading, setInternalLoading] = useState(false);
    /** request sequence for async search to avoid race */
    const requestSeqRef = useRef(0);
    /** Track created items (new, unselected, all) */
    const {
      clearUnselected,
      filterUnselected,
      isNewlyCreated,
      markCreated,
      markUnselected,
    } = useCreationTracker();
    /** Track latest value to avoid stale closure in bulk create */
    const valueRef = useRef(value);

    useEffect(() => {
      valueRef.current = value;
    }, [value]);

    const resetSearchInputs = useCallback(() => {
      setSearchText('');
      setInsertText('');
    }, [setSearchText]);

    // Wrap onChange to track unselected created items
    const wrappedOnChange = useCallback(
      (chooseOption: SelectValue | null) => {
        const result = onChange(chooseOption);

        // In multiple mode, check if any created items were unselected
        if (isMultiple && Array.isArray(value) && Array.isArray(result)) {
          // Find items that were in value but not in result (unselected)
          const unselectedItems = value.filter(
            (v) => !result.some((r) => r.id === v.id),
          );

          // If any unselected item was created via onInsert, track it
          markUnselected(unselectedItems.map((item) => item.id));
        } else if (isSingle && value && !Array.isArray(value) && !result) {
          // In single mode, if value was cleared and it was a created item, track it
          markUnselected([value.id]);
        }

        return result;
      },
      [isMultiple, isSingle, markUnselected, onChange, value],
    );

    const nodeRef = useRef<HTMLDivElement>(null);
    const controlRef = useRef<HTMLElement>(null);
    const composedRef = useComposeRefs([ref, controlRef]);
    // In single mode, show searchText when focused, otherwise show selected value
    // In multiple mode, always return empty string to avoid displaying "0"
    const renderValue = useMemo(() => {
      if (isSingle && focused) {
        return () => searchText;
      }
      if (isMultiple) {
        return () => '';
      }
      return undefined;
    }, [focused, isMultiple, isSingle, searchText]);

    function getPlaceholder() {
      if (isSingle && focused && value && !isArray(value)) {
        return (value as SelectValue).name;
      }

      return placeholder;
    }

    // Process bulk create: split by separators, trim, filter duplicates
    const processBulkCreate = useCallback(
      (text: string): string[] => {
        if (!text || !addable || !onInsert) return [];

        // Split by separators
        let parts: string[] = [text];
        createSeparators.forEach((separator) => {
          const newParts: string[] = [];
          parts.forEach((part) => {
            newParts.push(...part.split(separator));
          });
          parts = newParts;
        });

        // Trim and filter empty strings
        const processed = parts
          .map((part) => (trimOnCreate ? part.trim() : part))
          .filter((part) => part.length > 0);

        // Filter out duplicates against **selected** values only (allow existing options)
        const selectedNames = new Set<string>();
        if (isMultiple && Array.isArray(value)) {
          value.forEach((v) => selectedNames.add(v.name.toLowerCase()));
        } else if (isSingle && value && !Array.isArray(value)) {
          selectedNames.add(value.name.toLowerCase());
        }

        return processed.filter(
          (part) => !selectedNames.has(part.toLowerCase())
        );
      },
      [addable, createSeparators, isMultiple, isSingle, onInsert, trimOnCreate, value],
    );

    // Handle bulk create
    const handleBulkCreate = useCallback(
      (texts: string[]) => {
        if (!addable || texts.length === 0 || !onInsert) return;

        // Start with current options, but remove previously unselected created options
        let currentOptions = filterUnselected(options);

        // Clear the unselected created IDs ref for this round
        clearUnselected();

        const itemsToAdd: SelectValue[] = [];
        const newlyCreatedIds: Set<string> = new Set();

        // Process each text
        texts.forEach((text) => {
          // First, check if the text matches an existing option in current options
          const existingOption = currentOptions.find(
            (option) => option.name === text,
          );

          if (existingOption) {
            // If option exists, check if it's already selected
            const isAlreadySelected = isMultiple && Array.isArray(value)
              ? value.some((v) => v.id === existingOption.id)
              : isSingle && value && !Array.isArray(value)
                ? value.id === existingOption.id
                : false;

            // Only add if not already selected
            if (!isAlreadySelected) {
              itemsToAdd.push(existingOption);
            }
          } else {
            // If option doesn't exist, create a new one via onInsert
            const updatedOptions = onInsert(text, currentOptions);

            // Find the newly created option (the one that wasn't in currentOptions)
            const newOption = updatedOptions.find(
              (opt) => !currentOptions.some((existing) => existing.id === opt.id),
            );

            if (newOption) {
              itemsToAdd.push(newOption);
              newlyCreatedIds.add(newOption.id);
              markCreated(newOption.id);
              // Update currentOptions for next iteration
              currentOptions = updatedOptions;
            }
          }
        });

        // Note: The updated options (currentOptions) should be handled by the parent
        // component through the onInsert callback return value

        if (itemsToAdd.length > 0) {
          // In single mode, select the first item
          if (isSingle && itemsToAdd[0]) {
            wrappedOnChange(itemsToAdd[0]);
            toggleOpen(false);
            onFocus(false);
            // In single mode, if we selected the item, it's not unselected
            newlyCreatedIds.delete(itemsToAdd[0].id);
          } else if (isMultiple) {
            // In multiple mode, add all items to the current selection
            // Use valueRef to ensure we use the latest value (avoid stale closure)
            const currentValues = Array.isArray(valueRef.current) ? valueRef.current : [];
            // Filter out duplicates (items that are already selected)
            const newItemsToAdd = itemsToAdd.filter(
              (item) =>
                !currentValues.some((existing) => existing.id === item.id),
            );
            // Merge current values with new items
            const mergedValues = [...currentValues, ...newItemsToAdd];
            // Directly call onChangeProp with the merged array to ensure all items are selected at once
            // This avoids the async state update issue when calling onChange multiple times
            if (onChangeProp && isMultiple) {
              (onChangeProp as (newOptions: SelectValue[]) => any)(mergedValues);
              // Remove selected items from newlyCreatedIds
              mergedValues.forEach((v) => newlyCreatedIds.delete(v.id));
            } else {
              // Fallback: call wrappedOnChange for each item (may have async issues but works)
              newItemsToAdd.forEach((item) => {
                wrappedOnChange(item);
                newlyCreatedIds.delete(item.id);
              });
            }
          }

          // Track newly created but unselected items for next round
          newlyCreatedIds.forEach((id) => {
            markUnselected([id]);
          });
        }
      },
      [
        addable,
        clearUnselected,
        filterUnselected,
        isMultiple,
        isSingle,
        markCreated,
        markUnselected,
        onChangeProp,
        onFocus,
        onInsert,
        options,
        toggleOpen,
        value,
        wrappedOnChange,
      ],
    );

    const handleActionCustom = useCallback(() => {
      if (!addable || !insertText) return;

      // Check if insertText contains separators (bulk create)
      const hasSeparator = createSeparators.some((sep) =>
        insertText.includes(sep),
      );

      if (hasSeparator && isMultiple) {
        // Process bulk create (split by separators)
        const textsToCreate = processBulkCreate(insertText);
        if (textsToCreate.length > 0) {
          handleBulkCreate(textsToCreate);
          resetSearchInputs();
          return;
        }
      }

      // Single item creation (for both single and multiple mode when no separator)
      const textsToCreate = processBulkCreate(insertText);
      if (textsToCreate.length > 0) {
        handleBulkCreate(textsToCreate);
        resetSearchInputs();
      }
    }, [
      addable,
      createSeparators,
      handleBulkCreate,
      insertText,
      isMultiple,
      processBulkCreate,
      resetSearchInputs,
    ]);

    /** Debounced search handler */
    const debouncedSearch = useMemo(() => {
      if (!onSearch) return undefined;

      return debounce((searchValue: string) => {
        if (!asyncData) {
          onSearch(searchValue);
          return;
        }

        const currentSeq = requestSeqRef.current + 1;
        requestSeqRef.current = currentSeq;

        if (!searchValue) {
          setInternalLoading(false);
          onSearch(searchValue);
          return;
        }

        setInternalLoading(true);
        const result = onSearch(searchValue) as any;
        if (result && typeof result.then === 'function') {
          result.finally(() => {
            if (requestSeqRef.current === currentSeq) {
              setInternalLoading(false);
            }
          });
        } else {
          setInternalLoading(false);
        }
      }, searchDebounceTime);
    }, [onSearch, asyncData, searchDebounceTime]);

    // Cleanup debounced function on unmount
    useEffect(() => {
      return () => {
        if (debouncedSearch) {
          debouncedSearch.cancel();
        }
      };
    }, [debouncedSearch]);

    /** Trigger input props */
    const onSearchInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const nextSearch = e.target.value;
      /** should sync both search input and value */
      setSearchText(nextSearch);
      setInsertText(nextSearch);

      // Auto-select matching option when addable is enabled
      if (addable && nextSearch.length > 0) {
        const matchingOption = options.find((option) => option.name === nextSearch);

        if (matchingOption) {
          if (isSingle) {
            // Single mode: auto-select only if no value is currently selected
            if (!value) {
              wrappedOnChange(matchingOption);
              toggleOpen(false);
              onFocus(false);
              resetSearchInputs();
              return;
            }
          } else {
            // Multiple mode: auto-select only if the option is not already selected
            const isAlreadySelected =
              isMultiple &&
              Array.isArray(value) &&
              value.some((v) => v.id === matchingOption.id);

            if (!isAlreadySelected) {
              wrappedOnChange(matchingOption);
              resetSearchInputs();
              return;
            }
          }
        }
      }

      // If search is empty, call immediately (no debounce)
      if (!nextSearch) {
        if (debouncedSearch) {
          debouncedSearch.cancel();
        }
        if (!asyncData) {
          onSearch?.(nextSearch);
          return;
        }

        const currentSeq = requestSeqRef.current + 1;
        requestSeqRef.current = currentSeq;
        setInternalLoading(false);
        onSearch?.(nextSearch);
        return;
      }

      // Use debounced search for non-empty values
      if (debouncedSearch) {
        debouncedSearch(nextSearch);
      }
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

    const context = useMemo(() => ({ onChange: wrappedOnChange, value }), [wrappedOnChange, value]);

    // Convert SelectValue[] to DropdownOption[]
    const dropdownOptions: DropdownOption[] = useMemo(() => {
      return options.map((option) => {
        const newlyCreated = isNewlyCreated(option.id);
        const result: DropdownOption = {
          id: option.id,
          name: option.name,
        };

        // Set checkSite based on mode
        // Multiple mode: show checkbox at prepend
        // Single mode: show checked icon at append when selected
        if (mode === 'multiple') {
          result.checkSite = 'prepend';
        } else {
          result.checkSite = 'append';
        }

        // Set appendContent to "New" for newly created items
        if (newlyCreated) {
          result.shortcutText = 'New';
        }

        return result;
      });
    }, [isNewlyCreated, mode, options]);

    // Get selected value for dropdown
    const dropdownValue = useMemo(() => {
      if (mode === 'multiple') {
        return Array.isArray(value) ? value.map((v) => v.id) : [];
      }
      return value && !Array.isArray(value) ? value.id : undefined;
    }, [mode, value]);

    // Determine dropdown status for loading / empty display
    const isLoading = asyncData ? internalLoading || loading : loading;

    // Disable input when loading
    const isInputDisabled = disabled || isLoading;

    // For rendering: when loading, force options to empty to show loading status in Dropdown
    const dropdownOptionsForRender = useMemo(() => {
      if (isLoading) return [];
      return dropdownOptions;
    }, [isLoading, dropdownOptions]);

    const dropdownStatus = useMemo<DropdownStatusType | undefined>(() => {
      if (isLoading) return 'loading';
      if (!isLoading && dropdownOptionsForRender.length === 0) return 'empty';
      return undefined;
    }, [isLoading, dropdownOptionsForRender.length]);

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
    const [_listboxHasVisualFocus, setListboxHasVisualFocus] = useState(false);

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
          `${MENU_ID}-option-${activeIndex}`,
        );

        activeOption?.scrollIntoView({ block: 'nearest' });
      });
    }, [activeIndex, open]);

    // Compute aria-activedescendant
    const ariaActivedescendant = useMemo(() => {
      if (activeIndex !== null && dropdownOptions[activeIndex]) {
        return `${MENU_ID}-option-${activeIndex}`;
      }
      return undefined;
    }, [activeIndex, dropdownOptions]);

    // Handle keyboard navigation
    const handleKeyDown = useMemo(
      () =>
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
            if (inputRef && 'current' in inputRef) {
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
        }),
      [
        activeIndex,
        dropdownOptions,
        handleDropdownSelect,
        inputRef,
        mode,
        onFocus,
        open,
        toggleOpen,
      ],
    );

    // Handle Enter key when activeIndex is null but dropdown is open
    const handleEnterKey = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && open) {
          // If addable and searchText exists, try to create first
          // This should take priority over selecting the first option
          if (addable && searchText) {
            const hasSeparator = createSeparators.some((sep) =>
              searchText.includes(sep),
            );

            // If has separator and in multiple mode, process bulk create
            if (hasSeparator && mode === 'multiple') {
              e.preventDefault();
              e.stopPropagation();
              // Process bulk create (split by separators)
              const textsToCreate = processBulkCreate(searchText);
              if (textsToCreate.length > 0) {
                handleBulkCreate(textsToCreate);
                setSearchText('');
                setInsertText('');
                return true;
              }
            }

            // If no separator or single mode, check if searchText exists without matching option
            if (!hasSeparator && searchTextExistWithoutOption) {
              e.preventDefault();
              e.stopPropagation();
              // Single item creation
              const textsToCreate = processBulkCreate(searchText);
              if (textsToCreate.length > 0) {
                handleBulkCreate(textsToCreate);
                setSearchText('');
                setInsertText('');
              }
              return true;
            }
          }

          // If there are options and activeIndex is null, select the first option
          // Only do this if we didn't create a new option above
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
        handleDropdownSelect,
        handleBulkCreate,
        mode,
        onFocus,
        open,
        processBulkCreate,
        searchText,
        searchTextExistWithoutOption,
        setSearchText,
        toggleOpen,
      ],
    );

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

    // Handle Backspace and Delete keys to remove selected values
    const handleInputKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        // Handle Enter key when activeIndex is null
        if (handleEnterKey(e)) {
          return;
        }

        // Only handle in multiple mode when input is empty
        if (
          mode === 'multiple' &&
          Array.isArray(value) &&
          value.length > 0 &&
          !searchText
        ) {
          if (e.key === 'Backspace') {
            // Delete the last selected value (backward)
            e.preventDefault();
            const lastValue = value[value.length - 1];
            if (lastValue) {
              wrappedOnChange(lastValue);
            }
            return;
          }

          if (e.key === 'Delete') {
            // Delete the first selected value (forward)
            e.preventDefault();
            const firstValue = value[0];
            if (firstValue) {
              wrappedOnChange(firstValue);
            }
            return;
          }
        }

        // Handle other keyboard navigation
        handleKeyDown(e);
        inputProps?.onKeyDown?.(e);
      },
      [handleEnterKey, handleKeyDown, inputProps, mode, searchText, value, wrappedOnChange],
    );

    // Handle paste event for bulk create
    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (!addable || !onInsert) {
          inputProps?.onPaste?.(e);
          return;
        }

        const pastedText = e.clipboardData.getData('text');
        if (!pastedText) {
          inputProps?.onPaste?.(e);
          return;
        }

        // Only process bulk create in multiple mode
        if (isMultiple) {
          // Check if pasted text contains separators
          const hasSeparator = createSeparators.some((sep) =>
            pastedText.includes(sep),
          );

          if (hasSeparator) {
            // Prevent default paste behavior
            e.preventDefault();
            // Process bulk create from pasted text
            const textsToCreate = processBulkCreate(pastedText);
            if (textsToCreate.length > 0) {
              handleBulkCreate(textsToCreate);
              resetSearchInputs();
              return;
            }
          }
        }

        // No separator or single mode, let normal paste behavior happen (will trigger onSearchInputChange)
        inputProps?.onPaste?.(e);
      },
      [
        addable,
        createSeparators,
        handleBulkCreate,
        inputProps,
        isMultiple,
        onInsert,
        processBulkCreate,
        resetSearchInputs,
      ],
    );

    const resolvedInputProps: SelectTriggerInputProps = {
      ...inputProps,
      'aria-activedescendant': ariaActivedescendant,
      'aria-controls': MENU_ID,
      'aria-expanded': open,
      'aria-owns': MENU_ID,
      id: id ?? inputProps?.id,
      name: name ?? inputProps?.name,
      onBlur: onSearchInputBlur,
      onChange: onSearchInputChange,
      onFocus: onSearchInputFocus,
      onKeyDown: handleInputKeyDown,
      onPaste: handlePaste,
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
              searchTextExistWithoutOption && addable && insertText
                ? `建立 "${insertText}"`
                : undefined
            }
            activeIndex={activeIndex}
            disabled={isInputDisabled}
            emptyText={emptyText}
            followText={searchText}
            inputPosition={inputPosition}
            isMatchInputValue
            listboxId={MENU_ID}
            loadingText={loadingText}
            maxHeight={menuMaxHeight}
            mode={mode}
            onActionCustom={
              searchTextExistWithoutOption && addable && insertText
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
            showDropdownActions={
              !!(searchTextExistWithoutOption && addable && insertText)
            }
            showActionShowTopBar={
              !!(searchTextExistWithoutOption && addable && insertText)
            }
            status={dropdownStatus}
            type="default"
            value={dropdownValue}
          >
            <SelectTrigger
              ref={composedRef}
              active={open}
              className={className}
              clearable
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
                onClick: (e: React.MouseEvent<HTMLInputElement>) => {
                  // When inputPosition is inside, let Dropdown handle the click event
                  // Otherwise, stop propagation to prevent conflicts
                  if (inputPosition !== 'inside') {
                    e.stopPropagation();
                  }
                  resolvedInputProps.onClick?.(e);
                },
              }}
              searchText={searchText}
              size={size as any}
              showTextInputAfterTags
              suffixAction={onClickSuffixActionIcon}
              value={
                mode === 'multiple' && Array.isArray(value) && value.length === 0
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


