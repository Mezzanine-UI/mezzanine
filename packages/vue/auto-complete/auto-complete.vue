<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  useAttrs,
  useId,
  watch,
} from 'vue';
import { autocompleteClasses as classes } from '@mezzanine-ui/core/autocomplete';
import type {
  DropdownOption,
  DropdownStatus,
} from '@mezzanine-ui/core/dropdown/dropdown';
import { selectClasses as selectTriggerClasses } from '@mezzanine-ui/core/select';
import { isImeComposing } from '@mezzanine-ui/core/utils';
import clsx from 'clsx';
import { formControlKey } from '../_internal/form-control';
import { useAutoCompleteValueControl } from '../_internal/use-auto-complete-value-control';
import MznDropdown from '../dropdown/dropdown.vue';
import type { DropdownTriggerProps } from '../dropdown/dropdown.types';
import { selectControlKey } from '../select/select-control-context';
import MznSelectTrigger from '../select/select-trigger.vue';
import type { SelectControl, SelectValue } from '../select/select.types';
import type { SelectTriggerInputProps } from '../select/select-trigger.types';
import MznAutoCompleteInsideTrigger from './auto-complete-inside-trigger.vue';
import type { AutoCompleteProps } from './auto-complete.types';
import { isSameOptionName } from './is-same-option-name';
import {
  getFullParsedList,
  useAutoCompleteCreation,
} from './use-auto-complete-creation';
import { useAutoCompleteKeyboard } from './use-auto-complete-keyboard';
import { useAutoCompleteSearch } from './use-auto-complete-search';
import { useCreationTracker } from './use-creation-tracker';

/**
 * 自動完成輸入元件，在使用者輸入時即時顯示符合的下拉選項。
 *
 * 支援 `single`（單選）與 `multiple`（多選標籤）兩種模式；`inputPosition` 控制搜尋輸入框
 * 位於下拉選單外（`'outside'`，預設）或內（`'inside'`）。設定 `addable` 與 `onInsert`
 * 可讓使用者動態建立不在選項清單中的項目。`asyncData` 搭配 `search` 事件可實現非同步搜尋，
 * 輸入時觸發 debounce 查詢並顯示 loading 狀態。若僅需從固定選項中搜尋，請改用 MznSelect。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznAutoComplete } from '@mezzanine-ui/vue/auto-complete';
 * <\/script>
 *
 * <template>
 *   <MznAutoComplete :options="options" :value="selected" @change="selected = $event" />
 *   <MznAutoComplete mode="multiple" addable :options="options" :on-insert="insert" />
 * </template>
 * ```
 *
 * @see MznSelect 從固定選項清單中選取時使用
 * @see useAutoCompleteValueControl 管理搜尋文字與選取值的 composable
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  addable: false,
  asyncData: false,
  caseSensitive: false,
  clearSearchText: true,
  createActionText: undefined,
  createActionTextTemplate: '建立 "{text}"',
  createSeparators: () => [',', '+', '\n'],
  defaultValue: undefined,
  disabled: undefined,
  disabledOptionsFilter: false,
  dropdownZIndex: undefined,
  emptyText: '沒有符合的項目',
  error: undefined,
  forceShowClearable: undefined,
  globalPortal: true,
  hideSuffixWhenClearable: undefined,
  id: undefined,
  inputPosition: 'outside',
  inputProps: undefined,
  isForceClearable: undefined,
  loading: false,
  loadingPosition: 'bottom',
  loadingText: '載入中...',
  menuMaxHeight: undefined,
  mode: 'single',
  name: undefined,
  onInsert: undefined,
  open: undefined,
  overflowStrategy: undefined,
  placeholder: '',
  readOnly: undefined,
  required: undefined,
  searchDebounceTime: 300,
  searchText: undefined,
  selector: undefined,
  showTextInputAfterTags: undefined,
  size: undefined,
  stepByStepBulkCreate: false,
  suffixAction: undefined,
  trimOnCreate: true,
  type: undefined,
  value: undefined,
  warning: undefined,
});

const emit = defineEmits<{
  /** The change event handler of input element. */
  change: [newOptions: SelectValue[] | SelectValue | null];
  /** Fired when the clear button emptied the selection. */
  clear: [event: MouseEvent];
  /** Callback fired when the dropdown list leaves the bottom. */
  leaveBottom: [];
  /** Callback fired when the dropdown list reaches the bottom. */
  reachBottom: [];
  /**
   * Called when the dropdown closes and `addable` mode has items that were
   * created but never selected, with those already removed from the options.
   */
  removeCreated: [cleanedOptions: SelectValue[]];
  /** The search event handler. */
  search: [input: string];
  /** Fired on every input change (no debounce). */
  searchTextChange: [text: string];
  /** The click handler for the cross icon on tags. */
  tagClose: [target: SelectValue];
  /** Fired when the dropdown visibility changes. */
  visibilityChange: [open: boolean];
}>();

const slots = defineSlots<{
  /** The trigger's prefix, forwarded to the select trigger. */
  prefix?: () => unknown;
}>();

const attrs = useAttrs();

const BLUR_RESET_OPTIONS_DELAY = 120;
const MENU_ID_PREFIX = 'mzn-select-autocomplete-menu-id';

const formControl = inject(formControlKey, undefined);

const disabled = computed(
  (): boolean => props.disabled ?? formControl?.value.disabled ?? false,
);
const error = computed(
  (): boolean => props.error ?? formControl?.value.severity === 'error',
);
const required = computed(
  (): boolean => props.required ?? formControl?.value.required ?? false,
);

const shouldClearSearchTextOnBlur = computed(
  (): boolean => props.clearSearchText,
);

const uncontrolledOpen = ref(false);
const isMultiple = computed((): boolean => props.mode === 'multiple');
const isSingle = computed((): boolean => !isMultiple.value);
const isOpenControlled = computed((): boolean => props.open !== undefined);
const open = computed((): boolean =>
  isOpenControlled.value ? Boolean(props.open) : uncontrolledOpen.value,
);

function toggleOpen(newOpen: boolean): void {
  if (!isOpenControlled.value) uncontrolledOpen.value = newOpen;

  emit('visibilityChange', newOpen);
}

const creationEnabled = computed(
  (): boolean => props.addable && typeof props.onInsert === 'function',
);

const { focused, onChange, onClear, onFocus, options, searchText, value } =
  useAutoCompleteValueControl({
    caseSensitive: () => props.caseSensitive,
    defaultValue: () => props.defaultValue,
    disabledOptionsFilter: () => props.disabledOptionsFilter,
    getOptionsFilterQuery: (text) => {
      if (!props.stepByStepBulkCreate || !creationEnabled.value)
        return undefined;

      const full = getFullParsedList(
        text,
        props.createSeparators,
        props.trimOnCreate,
      );

      return full.length > 1 ? (full[0] ?? undefined) : undefined;
    },
    mode: () => props.mode ?? 'single',
    onChange: (next) => emit('change', next),
    onClear: (event) => emit('clear', event),
    onClose: () => toggleOpen(false),
    onSearch: (input) => emit('search', input),
    options: () => props.options,
    value: () => props.value,
  });

const {
  clearNewlyCreated,
  clearUnselected,
  filterUnselected,
  isCreated,
  markCreated,
  markUnselected,
} = useCreationTracker();

watch(
  [() => props.addable, () => props.onInsert],
  ([addable, onInsert]) => {
    if (addable && !onInsert) {
      console.warn(
        '[AutoComplete] `addable` 已開啟但未提供 `onInsert`，已停用建立功能。',
      );
    }
  },
  { immediate: true },
);

const idSeed = useId();
const menuId = `${MENU_ID_PREFIX}-${idSeed}`;

const host = ref<HTMLElement | null>(null);
const inputElement = ref<HTMLInputElement | null>(null);
/** Whichever trigger is rendered; both expose their input element. */
const trigger = ref<{ input?: HTMLInputElement | null } | null>(null);

/**
 * The dropdown hands its anchor setter down in the slot payload, and the
 * trigger's input has to be reachable too. React composes the two refs; a
 * template can only carry one, so it calls both.
 */
function setTrigger(
  element: unknown,
  setAnchor?: DropdownTriggerProps['ref'],
): void {
  setAnchor?.(element as Element | null);
  trigger.value = element as { input?: HTMLInputElement | null } | null;
}

/**
 * Everything from the payload except the ref, which `setTrigger` owns.
 *
 * Only the outside trigger takes it: React hands the same payload to the
 * inside trigger, but that one is a plain function component which destructures
 * the props it knows and drops the rest — so the dropdown's `role="combobox"`
 * and its aria attributes never reach the DOM there.
 */
function triggerBindings(
  triggerProps: DropdownTriggerProps,
): Record<string, unknown> {
  const { ref: _ref, ...rest } = triggerProps;

  return { ...rest, class: attrs.class };
}

function onSetInputDisplay(text: string): void {
  if (inputElement.value) inputElement.value.value = text;
}

/**
 * Wraps the control's `onChange` so a created option that ends up unselected
 * can be tracked and later removed from the caller's options.
 */
function wrappedOnChange(
  chooseOption: SelectValue | null,
): SelectValue[] | SelectValue | null {
  const current = value.value;
  const result = onChange(chooseOption);

  if (chooseOption) clearNewlyCreated([chooseOption.id]);

  if (isMultiple.value && Array.isArray(current) && Array.isArray(result)) {
    // Find items that were in value but not in result (unselected)
    markUnselected(
      current
        .filter((v) => !result.some((r) => r.id === v.id))
        .map((item) => item.id),
    );
  } else if (isSingle.value && current && !Array.isArray(current) && !result) {
    markUnselected([current.id]);
  }

  return result;
}

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
  addable: () => creationEnabled.value,
  caseSensitive: () => props.caseSensitive,
  clearNewlyCreated,
  clearUnselected,
  createSeparators: () => props.createSeparators,
  filterUnselected,
  isMultiple: () => isMultiple.value,
  isSingle: () => isSingle.value,
  markCreated,
  markUnselected,
  onChangeMultiple: isMultiple.value
    ? (newOptions) => emit('change', newOptions)
    : undefined,
  onInsert: (text, currentOptions) =>
    props.onInsert?.(text, currentOptions) ?? currentOptions,
  onSetInputDisplay,
  options: () => props.options,
  setSearchText: (next) => {
    searchText.value = next;
  },
  stepByStepBulkCreate: () => props.stepByStepBulkCreate,
  toggleOpen,
  trimOnCreate: () => props.trimOnCreate,
  value: () => value.value,
  wrappedOnChange,
});

let suppressNextClose = false;

function handleActionCustom(): void {
  suppressNextClose = true;
  handleActionCustomBase();
  window.setTimeout(() => {
    suppressNextClose = false;
  }, 0);
}

const { cancelSearch, isLoading, runSearch } = useAutoCompleteSearch({
  asyncData: () => props.asyncData,
  loading: () => props.loading,
  onSearch: (input) => emit('search', input),
  searchDebounceTime: () => props.searchDebounceTime,
});

let resetOptionsTimeout: number | null = null;
let skipNextMultipleCloseReset = false;

function clearPendingOptionsReset(): void {
  if (resetOptionsTimeout !== null) {
    window.clearTimeout(resetOptionsTimeout);
    resetOptionsTimeout = null;
  }
}

function resetSearchInputs(): void {
  resetCreationInputs();

  if (inputElement.value) inputElement.value.value = '';
}

function resetSearchInputsAndOptions(): void {
  resetSearchInputs();
  clearPendingOptionsReset();
  cancelSearch();
  resetOptionsTimeout = window.setTimeout(() => {
    runSearch('', { immediate: true });
    resetOptionsTimeout = null;
  }, BLUR_RESET_OPTIONS_DELAY);
}

function cleanupUnselectedCreated(): void {
  if (!creationEnabled.value) return;

  const cleanedOptions = filterUnselected(props.options);

  if (cleanedOptions.length === props.options.length) return;

  clearUnselected();
  emit('removeCreated', cleanedOptions);
}

onBeforeUnmount(() => clearPendingOptionsReset());

/**
 * The multiple-mode trigger keeps a hidden input whose value drives the text
 * field's "has content" styling; the tags live beside it. React writes a
 * zero-width space there when something is selected but nothing is typed.
 */
watch(
  [() => props.inputPosition, isMultiple, searchText, value],
  () => {
    if (!isMultiple.value || props.inputPosition === 'inside') return;

    const hiddenTriggerInput = host.value?.querySelector<HTMLInputElement>(
      `.${selectTriggerClasses.triggerInput}`,
    );

    if (!hiddenTriggerInput) return;

    const hasSelectedValue =
      Array.isArray(value.value) && value.value.length > 0;
    const bridgeValue = searchText.value || (hasSelectedValue ? '​' : '');

    if (hiddenTriggerInput.value === bridgeValue) return;

    hiddenTriggerInput.value = bridgeValue;
    hiddenTriggerInput.dispatchEvent(new Event('change', { bubbles: true }));
  },
  { flush: 'post' },
);

// In single mode, show searchText when focused, otherwise show selected value
// In multiple mode, always return empty string to avoid displaying "0"
const renderValue = computed(
  (): ((value?: SelectValue | null) => string) | undefined => {
    if (
      isSingle.value &&
      (focused.value ||
        (!shouldClearSearchTextOnBlur.value &&
          !value.value &&
          searchText.value))
    ) {
      return () => searchText.value;
    }

    if (isMultiple.value) return () => '';

    return undefined;
  },
);

const insideInputValue = computed((): string => {
  // Inside trigger is a plain Input, so we must decide what to display.
  // - multiple: always show current search text
  // - single: show search text when focused (or when clear-on-blur is disabled)
  if (isMultiple.value) return searchText.value;

  if (
    focused.value ||
    (!shouldClearSearchTextOnBlur.value && !value.value && searchText.value)
  ) {
    return searchText.value;
  }

  if (value.value && !Array.isArray(value.value)) return value.value.name;

  return '';
});

const resolvedPlaceholder = computed((): string => {
  if (
    isSingle.value &&
    focused.value &&
    value.value &&
    !Array.isArray(value.value)
  ) {
    return value.value.name;
  }

  return props.placeholder;
});

/** Trigger input props */
function onSearchInputChange(event: Event): void {
  clearPendingOptionsReset();

  const nextSearch = (event.target as HTMLInputElement).value;

  /** should sync both search input and value */
  searchText.value = nextSearch;
  setInsertText(nextSearch);
  emit('searchTextChange', nextSearch);

  if (!nextSearch) {
    cancelSearch();
    runSearch(nextSearch, { immediate: true });

    return;
  }

  runSearch(nextSearch);
}

function onSearchInputFocus(event: FocusEvent): void {
  skipNextMultipleCloseReset = false;
  clearPendingOptionsReset();

  // When inputPosition is inside, let Dropdown handle the focus event
  // Otherwise, stop propagation to prevent conflicts
  if (props.inputPosition !== 'inside') event.stopPropagation();

  // Only open if not already open to avoid flickering
  if (!open.value) toggleOpen(true);

  onFocus(true);
  props.inputProps?.onFocus?.(event);
}

function onSearchInputBlur(event: FocusEvent): void {
  // In multiple mode while the dropdown is open, defer clearing to the
  // visibility change: an intermediate blur from a dropdown interaction is not
  // the user leaving.
  const shouldDeferMultipleBlurReset = isMultiple.value && open.value;

  if (props.inputPosition === 'inside') {
    // When open is controlled, the controlled state is the source of truth, so
    // only the internal focus flag is updated here.
    if (isOpenControlled.value) onFocus(false);
  } else {
    onFocus(false);
  }

  if (shouldClearSearchTextOnBlur.value && !shouldDeferMultipleBlurReset) {
    resetSearchInputsAndOptions();
    cleanupUnselectedCreated();
  }

  props.inputProps?.onBlur?.(event);
}

function handleClear(event: MouseEvent): void {
  if (isSingle.value && value.value && !Array.isArray(value.value)) {
    markUnselected([value.value.id]);
  }

  onClear(event);
  resetSearchInputs();
}

function onClickSuffixActionIcon(): void {
  toggleOpen(!open.value);
}

const hasStepByStepBulkSeparator = computed(
  (): boolean =>
    props.stepByStepBulkCreate &&
    props.createSeparators.some((sep) => insertText.value.includes(sep)),
);

const firstPendingText = computed((): string | undefined =>
  hasStepByStepBulkSeparator.value
    ? getPendingCreateList(insertText.value)[0]
    : undefined,
);

const searchTextExistWithoutOption = computed((): boolean => {
  const pending = firstPendingText.value;

  if (pending) {
    return (
      options.value.find((option) =>
        isSameOptionName(option.name, pending, props.caseSensitive),
      ) === undefined
    );
  }

  return !!(
    searchText.value &&
    options.value.find((option) =>
      isSameOptionName(option.name, searchText.value, props.caseSensitive),
    ) === undefined
  );
});

const shouldShowCreateAction = computed(
  (): boolean =>
    !!(
      searchTextExistWithoutOption.value &&
      creationEnabled.value &&
      (firstPendingText.value ?? insertText.value)
    ),
);

const createActionDisplayText = computed((): string =>
  firstPendingText.value !== undefined && firstPendingText.value !== ''
    ? firstPendingText.value
    : insertText.value,
);

provide(
  selectControlKey,
  computed(
    (): SelectControl => ({
      onChange: (v) => wrappedOnChange(v),
      value: value.value,
    }),
  ),
);

// Convert SelectValue[] to DropdownOption[] (created options first)
const dropdownOptions = computed((): DropdownOption[] => {
  const sortedOptions = [...options.value].sort(
    (a, b) => (isCreated(b.id) ? 1 : 0) - (isCreated(a.id) ? 1 : 0),
  );

  return sortedOptions.map((option) => {
    const result: DropdownOption = { id: option.id, name: option.name };

    // - inside + multiple: keep multiple behavior, but render the single-like
    //   checked icon at the suffix to match the product visual.
    // - outside + multiple: render a checkbox at the prefix.
    // - single: render the checked icon at the suffix.
    result.checkSite =
      props.mode === 'multiple' && props.inputPosition !== 'inside'
        ? 'prefix'
        : 'suffix';

    // Set shortcutText to "New" for created items (persists even after selection)
    if (isCreated(option.id)) result.shortcutText = 'New';

    return result;
  });
});

const dropdownValue = computed((): string[] | string | undefined => {
  if (props.mode === 'multiple') {
    return Array.isArray(value.value) ? value.value.map((v) => v.id) : [];
  }

  return value.value && !Array.isArray(value.value)
    ? value.value.id
    : undefined;
});

// Disable input when loading
const isInputDisabled = computed(
  (): boolean => disabled.value || (!props.asyncData && isLoading.value),
);

const dropdownStatus = computed((): DropdownStatus | undefined => {
  if (isLoading.value) return 'loading';

  return dropdownOptions.value.length === 0 ? 'empty' : undefined;
});

const shouldForceClearable = computed((): boolean =>
  isMultiple.value
    ? (Array.isArray(value.value) && value.value.length > 0) ||
      searchText.value.trim().length > 0
    : (Boolean(value.value) && !Array.isArray(value.value)) ||
      (!shouldClearSearchTextOnBlur.value &&
        searchText.value.trim().length > 0),
);

// Handle dropdown option selection
function handleDropdownSelect(option: DropdownOption): void {
  const selectedValue = options.value.find((opt) => opt.id === option.id);

  if (!selectedValue) return;

  if (props.mode === 'single') {
    // Update searchText first to prevent showing old value
    searchText.value = selectedValue.name;
    setInsertText(selectedValue.name);
    wrappedOnChange(selectedValue);
    toggleOpen(false);
    onFocus(false);

    return;
  }

  skipNextMultipleCloseReset = true;
  wrappedOnChange(selectedValue);
  // In multiple mode, keep the current filter text after selecting an item.
}

// Active index for dropdown keyboard navigation
const activeIndex = ref<number | null>(null);
// Keyboard-only active index: only set by arrow key navigation, not mouse hover.
const keyboardActiveIndex = ref<number | null>(null);

function setListboxHasVisualFocus(): void {}

// Reset activeIndex and keyboardActiveIndex when options change
watch(
  () => dropdownOptions.value.length,
  (length) => {
    if (!length) {
      activeIndex.value = null;
      keyboardActiveIndex.value = null;

      return;
    }

    if (activeIndex.value !== null) {
      activeIndex.value = Math.min(activeIndex.value, length - 1);
    }

    if (keyboardActiveIndex.value !== null) {
      keyboardActiveIndex.value = Math.min(
        keyboardActiveIndex.value,
        length - 1,
      );
    }
  },
);

// Scroll to active option when activeIndex changes
watch([activeIndex, open], ([index, isOpen]) => {
  if (!isOpen || index === null) return;

  requestAnimationFrame(() => {
    document
      .getElementById(`${menuId}-option-${index}`)
      ?.scrollIntoView({ block: 'nearest' });
  });
});

const ariaActivedescendant = computed((): string | undefined =>
  activeIndex.value !== null && dropdownOptions.value[activeIndex.value]
    ? `${menuId}-option-${activeIndex.value}`
    : undefined,
);

const { handleInputKeyDown } = useAutoCompleteKeyboard({
  activeIndex,
  addable: () => creationEnabled.value,
  createSeparators: () => props.createSeparators,
  dropdownOptions: () => dropdownOptions.value,
  handleActionCustom,
  handleBulkCreate,
  handleDropdownSelect,
  inputPropsOnKeyDown: (event) => props.inputProps?.onKeydown?.(event),
  inputRef: inputElement,
  keyboardActiveIndex,
  mode: () => props.mode ?? 'single',
  onFocus,
  open: () => open.value,
  processBulkCreate,
  searchText: () => searchText.value,
  searchTextExistWithoutOption: () => searchTextExistWithoutOption.value,
  setInsertText,
  setListboxHasVisualFocus,
  setSearchText: (next) => {
    searchText.value = next;
  },
  stepByStepBulkCreate: () => props.stepByStepBulkCreate,
  toggleOpen,
  value: () => value.value,
  wrappedOnChange,
});

function onSearchInputKeyDown(event: KeyboardEvent): void {
  if (isImeComposing(event)) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    toggleOpen(false);
    activeIndex.value = null;
    keyboardActiveIndex.value = null;
    setListboxHasVisualFocus();
    onFocus(false);

    if (isMultiple.value && shouldClearSearchTextOnBlur.value) {
      resetSearchInputsAndOptions();
      cleanupUnselectedCreated();
    }

    inputElement.value?.blur();
    props.inputProps?.onKeydown?.(event);

    return;
  }

  handleInputKeyDown(event);
}

// Handle visibility change from Dropdown to prevent flickering
function handleVisibilityChange(newOpen: boolean): void {
  // Suppress spurious closes triggered immediately after the create action
  if (!newOpen && suppressNextClose) {
    suppressNextClose = false;

    return;
  }

  if (newOpen !== open.value) toggleOpen(newOpen);

  if (!newOpen) keyboardActiveIndex.value = null;

  if (!newOpen && isMultiple.value && shouldClearSearchTextOnBlur.value) {
    if (skipNextMultipleCloseReset) {
      const menuElement = document.getElementById(menuId);
      const activeElement = document.activeElement;
      const activeWithinHost = !!(
        activeElement &&
        (host.value?.contains(activeElement) ||
          menuElement?.contains(activeElement))
      );

      skipNextMultipleCloseReset = false;

      if (activeWithinHost) return;
    }

    resetSearchInputsAndOptions();
    cleanupUnselectedCreated();
  }
}

function handlePasteWithFallback(event: ClipboardEvent): void {
  handlePaste(event);
  props.inputProps?.onPaste?.(event);
}

const resolvedInputProps = computed(
  (): SelectTriggerInputProps => ({
    ...props.inputProps,
    'aria-activedescendant': ariaActivedescendant.value,
    'aria-controls': menuId,
    'aria-expanded': open.value,
    'aria-owns': menuId,
    id: props.id ?? props.inputProps?.id,
    name: props.name ?? props.inputProps?.name,
    onBlur: onSearchInputBlur,
    onChange: onSearchInputChange,
    onFocus: onSearchInputFocus,
    onKeydown: onSearchInputKeyDown,
    onPaste: handlePasteWithFallback,
    readonly: false,
    role: 'combobox',
  }),
);

const insideInputProps = computed(
  (): SelectTriggerInputProps => ({
    ...resolvedInputProps.value,
    onClick: (event: MouseEvent) =>
      (
        props.inputProps?.onClick as ((event: MouseEvent) => void) | undefined
      )?.(event),
  }),
);

const outsideInputProps = computed((): SelectTriggerInputProps => {
  const { onChange, ...rest } = resolvedInputProps.value;

  return {
    ...rest,
    onClick: (event: MouseEvent) => {
      // Only rendered when `inputPosition !== 'inside'`, where the click must
      // not reach the Dropdown as well.
      event.stopPropagation();
      (
        props.inputProps?.onClick as ((event: MouseEvent) => void) | undefined
      )?.(event);
    },
    // These land on the native input, where React's `onChange` is the DOM
    // `input` event. The inside trigger keeps `onChange`: there it reaches
    // MznInput's own emit, which already fires on input.
    onInput: onChange,
  };
});

/** Keeps `inputElement` pointing at whichever trigger is rendered. */
watch(
  trigger,
  (current) => {
    inputElement.value = (current?.input as HTMLInputElement | null) ?? null;
  },
  { flush: 'post' },
);

const actionText = computed((): string | undefined => {
  if (!shouldShowCreateAction.value) return undefined;

  return props.createActionText
    ? props.createActionText(createActionDisplayText.value)
    : props.createActionTextTemplate.replace(
        '{text}',
        createActionDisplayText.value,
      );
});

/**
 * React exposes the same two actions through `searchTextControlRef`; Vue's
 * equivalent is the parent placing a `ref` on this component.
 */
defineExpose({
  reset: () => resetSearchInputsAndOptions(),
  setSearchText: (next: string) => {
    searchText.value = next;
  },
});

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.hostInsideClosed]: props.inputPosition === 'inside' && !open.value,
    [classes.hostMode(props.mode)]: props.mode,
  }),
);
</script>

<template>
  <div ref="host" :class="hostClasses">
    <MznDropdown
      :action-text="actionText"
      :active-index="activeIndex"
      :disabled="isInputDisabled"
      :empty-text="emptyText"
      :follow-text="searchText"
      :global-portal="globalPortal"
      :input-position="inputPosition"
      is-match-input-value
      :keyboard-active-index="keyboardActiveIndex"
      :listbox-id="menuId"
      :loading-position="loadingPosition"
      :loading-text="loadingText"
      :max-height="menuMaxHeight"
      :mode="mode"
      :open="open"
      :options="asyncData && isLoading ? [] : dropdownOptions"
      placement="bottom"
      same-width
      :show-action-show-top-bar="shouldShowCreateAction"
      :show-dropdown-actions="shouldShowCreateAction"
      :status="dropdownStatus"
      :toggle-checked-on-click="
        inputPosition === 'inside' && mode === 'multiple' ? false : undefined
      "
      type="default"
      :value="dropdownValue"
      :z-index="dropdownZIndex"
      @action-custom="shouldShowCreateAction ? handleActionCustom() : undefined"
      @item-hover="activeIndex = $event"
      @leave-bottom="emit('leaveBottom')"
      @reach-bottom="emit('reachBottom')"
      @select="handleDropdownSelect"
      @visibility-change="handleVisibilityChange"
    >
      <template #default="triggerProps: DropdownTriggerProps">
        <MznAutoCompleteInsideTrigger
          v-if="inputPosition === 'inside'"
          :ref="(element) => setTrigger(element)"
          :active="open"
          :class="attrs.class"
          :clearable="shouldForceClearable"
          :disabled="isInputDisabled"
          :error="error"
          :placeholder="resolvedPlaceholder"
          :resolved-input-props="insideInputProps"
          :size="size"
          :value="insideInputValue"
          @clear="handleClear"
        />
        <MznSelectTrigger
          v-else
          :ref="(element) => setTrigger(element, triggerProps.ref)"
          v-bind="triggerBindings(triggerProps)"
          :active="open"
          clearable
          :disabled="isInputDisabled"
          full-width
          :input-props="outsideInputProps"
          :is-force-clearable="shouldForceClearable"
          :mode="mode"
          :overflow-strategy="
            isMultiple ? (overflowStrategy ?? 'wrap') : overflowStrategy
          "
          :placeholder="resolvedPlaceholder"
          :read-only="false"
          :render-value="mode === 'single' ? renderValue : undefined"
          :required="required"
          :search-text="searchText"
          show-text-input-after-tags
          :size="size"
          :suffix-action="onClickSuffixActionIcon"
          :type="error ? 'error' : 'default'"
          :value="
            mode === 'multiple' && Array.isArray(value) && value.length === 0
              ? undefined
              : (value ?? undefined)
          "
          @clear="handleClear"
          @tag-close="wrappedOnChange"
        >
          <template v-if="slots.prefix" #prefix
            ><slot name="prefix"
          /></template>
        </MznSelectTrigger>
      </template>
    </MznDropdown>
  </div>
</template>
