<script setup lang="ts">
import { computed, nextTick, ref, useAttrs } from 'vue';
import type { CSSProperties } from 'vue';
import { inputClasses as classes } from '@mezzanine-ui/core/input';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import { EyeIcon, EyeInvisibleIcon, SearchIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { formatNumberWithCommas } from '../_internal/format-number-with-commas';
import { parseNumberWithCommas } from '../_internal/parse-number-with-commas';
import { useInputWithClearControlValue } from '../_internal/use-input-with-clear-control-value';
import MznIcon from '../icon/icon.vue';
import MznTextField from '../text-field/text-field.vue';
import MznInputActionButton from './action-button.vue';
import MznPasswordStrengthIndicator from './password-strength-indicator.vue';
import MznInputSelectButton from './select-button.vue';
import MznInputSpinnerButton from './spinner-button.vue';
import type { InputProps } from './input.types';

/**
 * 多功能輸入框，以 `variant` 決定型態。
 *
 * 八種：`base`、`affix`（前後綴）、`search`（預設可清除、前綴放大鏡）、`number`（原生數字）、
 * `measure`（千分位格式化，可加上下微調）、`action`（旁邊一顆動作按鈕）、
 * `select`（旁邊一顆下拉按鈕）、`password`（可切換顯示，並可加強度指示條）。
 * `measure` 顯示時自動加千分位，`change` 送出的仍是原始數值。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznInput } from '@mezzanine-ui/vue/input';
 * <\/script>
 *
 * <template>
 *   <MznInput clearable placeholder="請輸入文字" />
 *   <MznInput variant="search" placeholder="搜尋關鍵字" />
 *   <MznInput variant="measure" suffix="px" show-spinner :min="0" :max="100" />
 * </template>
 * ```
 *
 * @see MznTextField 外框容器
 * @see MznFormField 提供標籤與提示訊息的欄位容器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputProps>(), {
  actionButton: undefined,
  active: undefined,
  clearable: undefined,
  defaultValue: undefined,
  disabled: false,
  dropdownMaxHeight: 114,
  dropdownPlacement: 'bottom-start',
  dropdownWidth: 120,
  error: false,
  forceShowClearable: undefined,
  formatter: undefined,
  fullWidth: true,
  hideSuffixWhenClearable: undefined,
  id: undefined,
  inputProps: undefined,
  inputType: undefined,
  max: undefined,
  min: undefined,
  name: undefined,
  options: undefined,
  parser: undefined,
  passwordStrengthIndicator: undefined,
  placeholder: undefined,
  readonly: undefined,
  selectButton: undefined,
  selectedValue: undefined,
  showPasswordStrengthIndicator: undefined,
  showSpinner: undefined,
  size: 'main',
  step: 1,
  typing: undefined,
  value: undefined,
  variant: 'base',
  warning: undefined,
});

const emit = defineEmits<{
  change: [event: Event];
  clear: [event: MouseEvent];
  select: [value: string];
  spinDown: [];
  spinUp: [];
}>();

const slots = defineSlots<{
  /** The field's prefix, for `variant="affix"` and `variant="measure"`. */
  prefix?: () => unknown;
  /** The field's suffix, for `variant="affix"` and `variant="measure"`. */
  suffix?: () => unknown;
}>();

const attrs = useAttrs();

const input = ref<HTMLInputElement | null>(null);
const showPassword = ref(false);

/**
 * React hands the input out through an `inputRef` prop; Vue's equivalent is
 * the parent placing a `ref` on this component, so the element is exposed.
 */
defineExpose({ input });

const {
  onChange,
  onClear: onClearFromHook,
  value,
} = useInputWithClearControlValue({
  defaultValue: () => props.defaultValue,
  elementRef: input,
  onChange: (event) => emit('change', event),
  value: () => props.value,
});

// Handle formatter/parser logic
const formatter = computed((): ((value: string) => string) | undefined => {
  if (props.formatter) return props.formatter;

  if (props.variant === 'measure') {
    return (raw: string) => formatNumberWithCommas(raw);
  }

  return undefined;
});

const parser = computed((): ((value: string) => string) | undefined => {
  if (props.parser) return props.parser;

  if (props.variant === 'measure') {
    return (raw: string) => parseNumberWithCommas(raw)?.toString() ?? '';
  }

  return undefined;
});

function handleChange(event: Event): void {
  restoreControlledValue();

  if (!parser.value) {
    onChange(event);

    return;
  }

  const target = event.target as HTMLInputElement;
  const parsed = parser.value(target.value);
  const originalValue = target.value;

  // Report the parsed value the way React rebuilds the event with it.
  target.value = parsed;
  onChange(event);
  target.value = originalValue;
}

/**
 * React re-renders a controlled input on every change and resets the element's
 * value even when the `value` prop did not move, so text typed into an input
 * whose value is pinned disappears again. Vue skips the patch when the bound
 * value is unchanged, leaving the typed text on screen, so it is put back here.
 */
function restoreControlledValue(): void {
  nextTick(() => {
    if (input.value && input.value.value !== displayValue.value) {
      input.value.value = displayValue.value;
    }
  });
}

// Format the display value
const displayValue = computed((): string =>
  formatter.value ? formatter.value(value.value) : value.value,
);

const isSearch = computed((): boolean => props.variant === 'search');
const isMeasure = computed((): boolean => props.variant === 'measure');
const isPassword = computed((): boolean => props.variant === 'password');

const hasSpinner = computed(
  (): boolean => isMeasure.value && Boolean(props.showSpinner),
);

const clearable = computed((): boolean => {
  if (isSearch.value) {
    // 預設為可清除
    return typeof props.clearable !== 'undefined' ? props.clearable : true;
  }

  if (
    props.variant === 'base' ||
    props.variant === 'affix' ||
    isPassword.value
  ) {
    return Boolean(props.clearable);
  }

  return false;
});

const defaultInputType = computed((): string => {
  if (props.variant === 'number') return 'number';
  if (isPassword.value) return showPassword.value ? 'text' : 'password';

  return 'text';
});

const defaultInputProps = computed((): Record<string, unknown> => {
  if (props.variant === 'number' || isMeasure.value) {
    return { max: props.max, min: props.min, step: props.step };
  }

  return {};
});

// 預設置右對齊
const inputStyle = computed((): CSSProperties | undefined =>
  isMeasure.value ? { textAlign: 'right' } : undefined,
);

function handleSpin(direction: 1 | -1): void {
  const currentValue = parseFloat(value.value || '0');
  const newValue = currentValue + direction * props.step;
  const withinBounds =
    direction === 1
      ? typeof props.max === 'undefined' || newValue <= props.max
      : typeof props.min === 'undefined' || newValue >= props.min;

  if (withinBounds) {
    // React hands the hook a synthetic event carrying only the new value;
    // the rendered value comes from state either way.
    onChange({ target: { value: String(newValue) } } as unknown as Event);
  }

  if (direction === 1) {
    emit('spinUp');
  } else {
    emit('spinDown');
  }
}

const actionButtonProps = computed(() => {
  if (props.variant !== 'action' || !props.actionButton) return undefined;

  const { position: _position, ...rest } = props.actionButton;

  return {
    ...rest,
    disabled:
      typeof rest.disabled === 'boolean'
        ? rest.disabled
        : props.disabled || props.readonly,
    size: props.size,
  };
});

const selectButtonProps = computed(() => {
  if (props.variant !== 'select' || !props.selectButton) return undefined;

  const { position: _position, ...rest } = props.selectButton;

  return {
    ...rest,
    disabled: rest.disabled || props.disabled,
    dropdownMaxHeight: props.dropdownMaxHeight,
    dropdownPlacement: props.dropdownPlacement,
    dropdownWidth: props.dropdownWidth,
    options: props.options,
    size: props.size,
  };
});

const prefixExternalButton = computed((): boolean => {
  if (props.variant === 'action') {
    return props.actionButton?.position === 'prefix';
  }

  if (props.variant === 'select') {
    return (
      props.selectButton?.position === 'both' ||
      props.selectButton?.position === 'prefix'
    );
  }

  return false;
});

const suffixExternalButton = computed((): boolean => {
  if (props.variant === 'action') {
    return props.actionButton?.position === 'suffix';
  }

  if (props.variant === 'select') {
    return (
      props.selectButton?.position === 'both' ||
      props.selectButton?.position === 'suffix'
    );
  }

  return false;
});

const showPasswordStrengthIndicator = computed(
  (): boolean =>
    isPassword.value && Boolean(props.showPasswordStrengthIndicator),
);

function togglePassword(): void {
  showPassword.value = !showPassword.value;
}

function handlePasswordToggleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    togglePassword();
  }
}

function handleClear(event: MouseEvent): void {
  emit('clear', event);
  onClearFromHook(event);
}

const interactiveProps = computed(() => {
  if (props.disabled) return { disabled: true as const };
  if (props.readonly) return { readonly: true as const };
  if (props.typing) return { typing: true as const };

  return {};
});

const containerClasses = computed((): string =>
  clsx(classes.container, attrs.class as string),
);

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.number]: props.variant === 'number',
    [classes.passwordInput]: isPassword.value,
    [classes.withPrefixExternalAction]: prefixExternalButton.value,
    [classes.withSuffixExternalAction]: suffixExternalButton.value,
    [classes.searchInput]: isSearch.value,
    [classes.measureWithSpinner]: isMeasure.value && hasSpinner.value,
    [classes.measureWithoutSpinner]: isMeasure.value && !hasSpinner.value,
  }),
);

const fieldClasses = computed((): string =>
  clsx(
    classes.field,
    {
      [classes.number]: props.variant === 'number',
      [textFieldClasses.monoInput]: isMeasure.value,
      [textFieldClasses.tinyGap]: isMeasure.value && hasSpinner.value,
    },
    classes.size(props.size),
  ),
);

const indicatorClasses = computed((): string =>
  clsx(classes.indicatorContainer),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const hasPrefixSlot = computed((): boolean =>
  Boolean(slots.prefix && (props.variant === 'affix' || isMeasure.value)),
);

const hasSuffixSlot = computed((): boolean =>
  Boolean(slots.suffix && (props.variant === 'affix' || isMeasure.value)),
);

const spinnersClass = classes.spinners;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="containerClasses">
    <div :class="hostClasses">
      <MznInputActionButton
        v-if="prefixExternalButton && actionButtonProps"
        v-bind="actionButtonProps"
      />
      <MznInputSelectButton
        v-if="prefixExternalButton && selectButtonProps"
        v-bind="selectButtonProps"
        @select="emit('select', $event)"
      />
      <MznTextField
        v-bind="interactiveProps"
        :active="active"
        :class="fieldClasses"
        :clearable="clearable"
        :error="error"
        :force-show-clearable="forceShowClearable"
        :full-width="fullWidth"
        :hide-suffix-when-clearable="hideSuffixWhenClearable"
        role="presentation"
        :size="size"
        :warning="warning"
        @clear="handleClear"
      >
        <template v-if="isSearch || hasPrefixSlot" #prefix>
          <MznIcon v-if="isSearch" :icon="SearchIcon" />
          <slot v-else name="prefix" />
        </template>
        <template
          v-if="hasSuffixSlot || (isMeasure && hasSpinner) || isPassword"
          #suffix
        >
          <slot v-if="hasSuffixSlot" name="suffix" />
          <div v-if="isMeasure && hasSpinner" :class="spinnersClass">
            <MznInputSpinnerButton
              :disabled="disabled"
              :size="size"
              type="up"
              @click="handleSpin(1)"
            />
            <MznInputSpinnerButton
              :disabled="disabled"
              :size="size"
              type="down"
              @click="handleSpin(-1)"
            />
          </div>
          <MznIcon
            v-if="isPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            :icon="showPassword ? EyeIcon : EyeInvisibleIcon"
            role="button"
            :tabindex="0"
            @click="togglePassword"
            @keydown="handlePasswordToggleKeyDown"
          />
        </template>
        <input
          ref="input"
          v-bind="{ ...defaultInputProps, ...inputProps }"
          :aria-disabled="disabled"
          :aria-multiline="false"
          :aria-readonly="readonly"
          :disabled="disabled"
          :id="id"
          :name="name"
          :placeholder="placeholder"
          :readonly="readonly"
          :style="[inputStyle, inputProps?.style]"
          :type="inputType ?? defaultInputType"
          :value="displayValue"
          @input="handleChange"
        />
      </MznTextField>
      <MznInputActionButton
        v-if="suffixExternalButton && actionButtonProps"
        v-bind="actionButtonProps"
      />
      <MznInputSelectButton
        v-if="suffixExternalButton && selectButtonProps"
        v-bind="selectButtonProps"
        @select="emit('select', $event)"
      />
    </div>
    <MznPasswordStrengthIndicator
      v-if="showPasswordStrengthIndicator"
      v-bind="passwordStrengthIndicator"
      :class="indicatorClasses"
    />
  </div>
</template>
