<script setup lang="ts">
import { computed, inject, provide, ref } from 'vue';
import type {
  DropdownOption,
  DropdownStatus,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import clsx from 'clsx';
import isArray from 'lodash/isArray';
import { formControlKey } from '../_internal/form-control';
import { useSelectValueControl } from '../_internal/use-select-value-control';
import MznDropdown from '../dropdown/dropdown.vue';
import type { DropdownTriggerProps } from '../dropdown/dropdown.types';
import type { SelectControl, SelectProps, SelectValue } from './select.types';
import { selectControlKey } from './select-control-context';
import MznSelectTrigger from './select-trigger.vue';
import type {
  SelectTriggerInputProps,
  SelectTriggerProps,
} from './select-trigger.types';

/**
 * 下拉選擇元件，支援單選與多選兩種模式。
 *
 * 透過 `mode` 切換 `single`（單選，預設）或 `multiple`（多選，以標籤呈現已選項目）。
 * 傳入 `options` 陣列即可自動建立下拉選單；多選模式下若 options 含有 `children` 巢狀結構，
 * 會自動切換為樹狀選取（`type: 'tree'`）並為所有選項加上勾選框。
 * 支援 `clearable`、`readOnly`、`loading` 狀態，以及透過 `renderValue` 自訂顯示文字。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSelect } from '@mezzanine-ui/vue/select';
 * <\/script>
 *
 * <template>
 *   <MznSelect :options="options" placeholder="請選擇" @change="onChange" />
 *   <MznSelect mode="multiple" :options="options" placeholder="可多選" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznDropdown Select 底層使用的下拉清單容器元件
 * @see useSelectValueControl 用於在受控模式下管理選取值的 composable
 */
const props = withDefaults(defineProps<SelectProps>(), {
  clearable: false,
  defaultValue: undefined,
  disabled: undefined,
  dropdownZIndex: undefined,
  error: undefined,
  flip: false,
  forceHideSuffixActionIcon: undefined,
  forceShowClearable: undefined,
  fullWidth: undefined,
  globalPortal: true,
  hideSuffixWhenClearable: undefined,
  inputProps: undefined,
  isForceClearable: undefined,
  loading: false,
  loadingPosition: 'bottom',
  loadingText: undefined,
  menuMaxHeight: undefined,
  mode: 'single',
  options: undefined,
  overflowStrategy: undefined,
  placeholder: '',
  readOnly: false,
  renderValue: undefined,
  required: undefined,
  searchText: undefined,
  showTextInputAfterTags: undefined,
  size: undefined,
  suffixAction: undefined,
  suffixActionIcon: undefined,
  type: 'default',
  value: undefined,
  warning: undefined,
});

const emit = defineEmits<{
  /** Fired when the trigger loses focus, which also closes the menu. */
  blur: [];
  /** The change event handler of input element. */
  change: [newOptions: SelectValue[] | SelectValue | null];
  /** Fired when the clear button emptied the selection. */
  clear: [event: MouseEvent];
  /** Fired when the trigger takes focus, which also opens the menu. */
  focus: [];
  /** Callback fired when the dropdown list leaves the bottom. */
  leaveBottom: [];
  /** Callback fired when the dropdown list reaches the bottom. */
  reachBottom: [];
  /** Popup menu scroll listener. */
  scroll: [
    computed: { maxScrollTop: number; scrollTop: number },
    target: HTMLDivElement,
  ];
  /** The click handler for the cross icon on tags. */
  tagClose: [target: SelectValue];
}>();

const slots = defineSlots<{
  /** The trigger's prefix, forwarded to the text field. */
  prefix?: () => unknown;
}>();

const formControl = inject(formControlKey, undefined);

const disabled = computed(
  (): boolean => props.disabled ?? formControl?.value.disabled ?? false,
);
const error = computed(
  (): boolean => props.error ?? formControl?.value.severity === 'error',
);
const fullWidth = computed(
  (): boolean => props.fullWidth ?? formControl?.value.fullWidth ?? false,
);
const required = computed(
  (): boolean => props.required ?? formControl?.value.required ?? false,
);

const dropdownStatus = computed((): DropdownStatus | undefined =>
  props.loading ? 'loading' : undefined,
);

const open = ref(false);

function onOpen(): void {
  // Prevent opening when readOnly is true
  if (props.readOnly) return;

  emit('focus');
  open.value = true;
}

function onClose(): void {
  emit('blur');
  open.value = false;
}

const {
  onChange,
  onClear: onClearFromControl,
  value,
} = useSelectValueControl({
  defaultValue: () => props.defaultValue,
  mode: () => props.mode ?? 'single',
  onChange: (next) => emit('change', next),
  onClear: (event) => emit('clear', event),
  onClose,
  value: () => props.value,
});

// Helper function to recursively add checkbox to all options in tree structure
function addCheckboxToTreeOptions(opts: DropdownOption[]): DropdownOption[] {
  return opts.map((opt) => ({
    ...opt,
    showCheckbox: true,
    checkSite: 'prefix' as const,
    children: opt.children ? addCheckboxToTreeOptions(opt.children) : undefined,
  }));
}

function getLeafDescendantIds(option: DropdownOption): string[] {
  const ids = new Set<string>();

  const collect = (opt: DropdownOption): void => {
    if (!opt.children || opt.children.length === 0) {
      ids.add(String(opt.id));
    } else {
      opt.children.forEach(collect);
    }
  };

  collect(option);

  return Array.from(ids);
}

function findOptionById(
  id: string,
  opts: DropdownOption[],
): DropdownOption | null {
  for (const opt of opts) {
    if (String(opt.id) === id) return opt;

    if (opt.children) {
      const found = findOptionById(id, opt.children);

      if (found) return found;
    }
  }

  return null;
}

const hasTreeStructure = computed((): boolean =>
  Boolean(
    props.options?.some((opt) => opt.children && opt.children.length > 0),
  ),
);

// Use provided options directly
const options = computed((): DropdownOption[] => {
  if (!props.options) return [];

  // In tree mode (multiple mode with tree structure), ensure all options have checkbox
  if (props.mode === 'multiple' && hasTreeStructure.value) {
    return addCheckboxToTreeOptions(props.options);
  }

  return props.options;
});

// Determine dropdown type based on options structure and mode
// Tree mode is only available in multiple mode
const dropdownType = computed((): DropdownType => {
  if (props.options && props.mode === 'multiple') {
    return hasTreeStructure.value ? 'tree' : props.type;
  }

  return props.type;
});

const dropdownValue = computed((): string | string[] | undefined => {
  if (!value.value) return undefined;

  if (Array.isArray(value.value)) {
    return value.value.map((v) => String(v.id));
  }

  return String(value.value.id);
});

const resolvedPlaceholder = computed((): string => {
  if (typeof props.renderValue === 'function') {
    return props.renderValue(value.value);
  }

  if (value.value && !isArray(value.value)) {
    return (value.value as SelectValue).name;
  }

  return props.placeholder;
});

/**
 * keyboard events for a11y
 * (@todo keyboard event map into option selection when menu is opened)
 */
function onKeyDownTextField(event: KeyboardEvent): void {
  // Prevent keyboard events from opening when readOnly is true
  if (props.readOnly) return;

  /** for a11y to open menu via keyboard */
  switch (event.code) {
    case 'Enter':
      onClose();

      break;
    case 'ArrowUp':
    case 'ArrowRight':
    case 'ArrowLeft':
    case 'ArrowDown': {
      if (!open.value) onOpen();

      break;
    }
    case 'Tab': {
      if (open.value) onClose();

      break;
    }

    default:
      break;
  }
}

function handleDropdownSelect(option: DropdownOption): void {
  if (props.mode === 'multiple' && dropdownType.value === 'tree') {
    const currentValues = Array.isArray(value.value) ? value.value : [];
    const leafDescendantIds = getLeafDescendantIds(option);
    const leafDescendantValues: SelectValue[] = leafDescendantIds.map((id) => {
      const foundOption = findOptionById(id, options.value);

      return { id, name: foundOption?.name || id };
    });

    const selectedLeafIds = leafDescendantIds.filter((id) =>
      currentValues.some((v) => String(v.id) === id),
    );
    const allSelected = selectedLeafIds.length === leafDescendantIds.length;

    if (allSelected) {
      // Deselect all leaf descendants in a single update
      const leafIdSet = new Set(leafDescendantIds.map((id) => String(id)));

      onChange(currentValues.filter((v) => !leafIdSet.has(String(v.id))));
    } else {
      // Select all leaf descendants that are not yet selected in a single update
      const existingIdSet = new Set(currentValues.map((v) => String(v.id)));

      onChange([
        ...currentValues,
        ...leafDescendantValues.filter(
          (descValue) => !existingIdSet.has(String(descValue.id)),
        ),
      ]);
    }

    return;
  }

  // Normal selection logic for non-tree mode
  const selectValue: SelectValue = {
    id: String(option.id),
    name: String(option.name),
  };

  onChange(selectValue);

  if (props.mode !== 'multiple') onClose();
}

function handleVisibilityChange(isOpen: boolean): void {
  if (isOpen && props.readOnly) return;

  if (isOpen) onOpen();
  else onClose();
}

const resolvedInputProps = computed(
  (): SelectTriggerInputProps => ({ ...props.inputProps, role: 'combobox' }),
);

provide(
  selectControlKey,
  computed(
    (): SelectControl => ({
      onChange: (v) => onChange(v),
      value: value.value,
    }),
  ),
);

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.hostFullWidth]: fullWidth.value,
    [classes.hostMode(props.mode)]: props.mode,
  }),
);

/**
 * React only forwards `renderValue` to the trigger in single mode, where the
 * trigger's own signature narrows the value to a single one.
 */
const triggerRenderValue = computed((): SelectTriggerProps['renderValue'] =>
  props.mode === 'single' && props.renderValue
    ? (value?: SelectValue | null) => props.renderValue!(value ?? null)
    : undefined,
);
</script>

<template>
  <div :class="hostClasses">
    <MznDropdown
      :disabled="readOnly || disabled"
      :flip="flip"
      :global-portal="globalPortal"
      :loading-position="loadingPosition"
      :loading-text="loadingText"
      :max-height="menuMaxHeight"
      :mode="mode"
      :open="readOnly ? false : open"
      :options="options"
      same-width
      :status="dropdownStatus"
      :type="dropdownType"
      :value="dropdownValue"
      :z-index="dropdownZIndex"
      @leave-bottom="emit('leaveBottom')"
      @reach-bottom="emit('reachBottom')"
      @scroll="
        (computedScroll, target) => emit('scroll', computedScroll, target)
      "
      @select="handleDropdownSelect"
      @visibility-change="handleVisibilityChange"
    >
      <template #default="triggerProps: DropdownTriggerProps">
        <MznSelectTrigger
          v-bind="triggerProps"
          :active="!readOnly && open"
          :clearable="clearable"
          :disabled="disabled"
          :error="error"
          :full-width="fullWidth"
          :input-props="resolvedInputProps"
          :mode="mode"
          :placeholder="resolvedPlaceholder"
          :overflow-strategy="overflowStrategy"
          :read-only="readOnly"
          :render-value="triggerRenderValue"
          :required="required"
          :size="size"
          :suffix-action-icon="suffixActionIcon"
          :value="value === null ? undefined : value"
          @clear="onClearFromControl"
          @keydown="onKeyDownTextField"
          @tag-close="onChange"
        >
          <template v-if="slots.prefix" #prefix
            ><slot name="prefix"
          /></template>
        </MznSelectTrigger>
      </template>
    </MznDropdown>
  </div>
</template>
