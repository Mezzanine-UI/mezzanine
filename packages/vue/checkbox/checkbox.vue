<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs, useId, watch } from 'vue';
import { checkboxClasses as classes } from '@mezzanine-ui/core/checkbox';
import { CheckedIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { useCheckboxControlValue } from '../_internal/use-checkbox-control-value';
import MznIcon from '../icon/icon.vue';
import MznInput from '../input/input.vue';
import MznTypography from '../typography/typography.vue';
import type { TypographyColor } from '@mezzanine-ui/core/typography';
import { checkboxGroupKey } from './checkbox-group-context';
import type { CheckboxEditableInput, CheckboxProps } from './checkbox.types';

/**
 * 核取方塊，支援預設（default）與晶片（chip）兩種模式。
 *
 * 受控與非受控皆可；放在 MznCheckboxGroup 內時必須提供 `value`。
 * `indeterminate` 顯示中間狀態，`withEditInput` 會在勾選後於右側顯示一個輸入框，
 * 勾選當下自動聚焦到它。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCheckbox } from '@mezzanine-ui/vue/checkbox';
 * <\/script>
 *
 * <template>
 *   <MznCheckbox label="同意條款" name="agree" @change="onChange" />
 *   <MznCheckbox label="其他" with-edit-input value="other" />
 * </template>
 * ```
 *
 * @see MznCheckboxGroup 一組共用 name 的核取方塊
 * @see useCheckboxControlValue 勾選狀態的 composable
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  description: undefined,
  disabled: undefined,
  editableInput: undefined,
  id: undefined,
  indeterminate: false,
  inputProps: undefined,
  label: undefined,
  mode: 'default',
  name: undefined,
  severity: 'info',
  size: 'main',
  value: undefined,
  withEditInput: false,
});

const emit = defineEmits<{
  change: [event: Event];
}>();

const attrs = useAttrs();
const checkboxGroup = inject(checkboxGroupKey, undefined);

const disabled = computed(
  (): boolean | undefined => props.disabled ?? checkboxGroup?.value.disabled,
);

const generatedId = useId();
const finalInputId = computed((): string => props.id ?? generatedId);

const nameFromInputProps = computed(
  (): string | undefined => props.inputProps?.name,
);

const name = computed(
  (): string | undefined => props.name ?? checkboxGroup?.value.name,
);

const resolvedName = computed((): string => {
  if (name.value) return name.value;
  if (nameFromInputProps.value) return nameFromInputProps.value;

  return finalInputId.value;
});

if (checkboxGroup && props.value == null) {
  throw new Error(
    'Checkbox: `value` is required when the checkbox is used inside a CheckboxGroup.',
  );
}

const { checked, onChange } = useCheckboxControlValue({
  checkboxGroup: () => checkboxGroup?.value,
  checked: () => props.checked,
  defaultChecked: () => props.defaultChecked,
  onChange: (event) => emit('change', event),
  value: () => props.value,
});

// Warn when checkbox is standalone and missing a name (helpful for form libs)
onMounted(() => {
  if (
    !checkboxGroup &&
    !name.value &&
    !nameFromInputProps.value &&
    props.label
  ) {
    console.warn(
      'Checkbox: The `name` prop is recommended when integrating with react-hook-form. ' +
        `Checkbox with label "${props.label}" is missing the \`name\` prop.`,
    );
  }
});

const isChecked = computed(
  (): boolean => checked.value && !props.indeterminate,
);
const isIndeterminate = computed((): boolean => props.indeterminate);

const labelColor = computed(
  (): TypographyColor =>
    props.mode === 'chip' && disabled.value
      ? 'text-neutral-light'
      : 'text-neutral-solid',
);

const inputElement = ref<HTMLInputElement | null>(null);

/**
 * React hands the input out through an `inputRef` prop; Vue's equivalent is
 * the parent placing a `ref` on this component, so the element is exposed.
 */
defineExpose({ input: inputElement });
const editableInputElement = ref<InstanceType<typeof MznInput> | null>(null);

watch(
  [inputElement, isIndeterminate],
  ([element, indeterminate]) => {
    if (element) element.indeterminate = indeterminate;
  },
  { immediate: true },
);

// Generate default editable input config when withEditInput is true but editableInput is not provided
const defaultEditableInput = computed((): CheckboxEditableInput | undefined => {
  if (!props.withEditInput) return undefined;
  if (props.editableInput) return props.editableInput;

  // Default values when editableInput is not provided
  return {
    id: `${finalInputId.value}_input`,
    name: resolvedName.value
      ? `${resolvedName.value}_input`
      : `${finalInputId.value}_input`,
    placeholder: 'Please enter...',
  };
});

const shouldShowEditableInput = computed((): boolean =>
  Boolean(props.withEditInput && defaultEditableInput.value),
);

watch(isChecked, (nowChecked, wasChecked) => {
  if (nowChecked && !wasChecked && shouldShowEditableInput.value) {
    editableInputElement.value?.input?.focus();
  }
});

function handleChipHostClick(event: MouseEvent): void {
  if (disabled.value) return;

  if (event.target === event.currentTarget) {
    inputElement.value?.click();
  }
}

function handleChipHostKeyDown(event: KeyboardEvent): void {
  if (disabled.value) return;

  if (
    event.target === event.currentTarget &&
    (event.key === 'Enter' || event.key === ' ')
  ) {
    event.preventDefault();
    inputElement.value?.click();
  }
}

function handleEditableInputMouseDown(event: MouseEvent): void {
  if (event.defaultPrevented) return;

  if (!isChecked.value && !disabled.value && inputElement.value) {
    // Block the native focus-on-mousedown so the watcher above owns focus timing
    event.preventDefault();
    inputElement.value.click();
  }
}

const editableInputProps = computed(() => {
  const source = defaultEditableInput.value;

  if (!source) return undefined;

  const { inputProps: sourceInputProps, ...rest } = source;

  return {
    ...rest,
    ...(disabled.value && source.disabled !== true ? { disabled: true } : {}),
    inputProps: {
      ...sourceInputProps,
      onMousedown: handleEditableInputMouseDown,
    },
    variant: 'base' as const,
  };
});

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    attrs.class as string,
    {
      [classes.checked]: isChecked.value,
      [classes.indeterminate]: isIndeterminate.value,
      [classes.disabled]: disabled.value,
      [classes.mode(props.mode)]: props.mode !== 'default',
      ...(props.severity ? { [classes.severity(props.severity)]: true } : {}),
    },
    classes.size(props.size),
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const chipHostListeners = computed(() =>
  props.mode === 'chip'
    ? { click: handleChipHostClick, keydown: handleChipHostKeyDown }
    : {},
);

const descriptionClass = classes.description;
const editableInputContainerClass = classes.editableInputContainer;
const iconClass = classes.icon;
const chipIconClasses = `${classes.icon} ${classes.chipIcon}`;
const indeterminateLineClass = classes.indeterminateLine;
const inputClass = classes.input;
const inputContainerClass = classes.inputContainer;
const inputContentClass = classes.inputContent;
const labelClass = classes.label;
const labelContainerClass = classes.labelContainer;
const textContainerClass = classes.textContainer;
</script>

<template>
  <div :class="hostClasses" v-on="chipHostListeners">
    <label v-bind="forwardedAttrs" :class="labelContainerClass">
      <div :class="inputContainerClass">
        <div :class="inputContentClass">
          <input
            ref="inputElement"
            v-bind="inputProps"
            :aria-checked="isIndeterminate ? 'mixed' : checked"
            :aria-disabled="disabled"
            :checked="isChecked"
            :class="inputClass"
            :disabled="disabled"
            :id="finalInputId"
            :name="resolvedName"
            type="checkbox"
            :value="value"
            @change="onChange"
          />
          <MznIcon
            v-if="mode === 'chip' && isChecked"
            aria-hidden="true"
            :class="chipIconClasses"
            color="brand"
            :icon="CheckedIcon"
            :size="16"
          />
          <MznIcon
            v-if="mode !== 'chip' && isChecked"
            aria-hidden="true"
            :class="iconClass"
            color="fixed-light"
            :icon="CheckedIcon"
            :size="9"
          />
          <span
            v-if="mode !== 'chip' && isIndeterminate"
            aria-hidden="true"
            :class="indeterminateLineClass"
          />
        </div>
      </div>
      <span v-if="label || description" :class="textContainerClass">
        <MznTypography
          v-if="label"
          :class="labelClass"
          :color="labelColor"
          variant="label-primary"
        >
          {{ label }}
        </MznTypography>
        <MznTypography
          v-if="description && mode !== 'chip' && !shouldShowEditableInput"
          :class="descriptionClass"
          color="text-neutral"
          variant="caption"
        >
          {{ description }}
        </MznTypography>
      </span>
    </label>
    <label
      v-if="
        shouldShowEditableInput &&
        editableInputProps &&
        mode !== 'chip' &&
        !indeterminate
      "
      :class="editableInputContainerClass"
      :for="finalInputId"
    >
      <MznInput ref="editableInputElement" v-bind="editableInputProps" />
    </label>
  </div>
</template>
