<script setup lang="ts">
import { computed, onMounted, useAttrs, useId } from 'vue';
import { checkboxGroupClasses as classes } from '@mezzanine-ui/core/checkbox';
import clsx from 'clsx';
import type { VNodeArrayChildren } from 'vue';
import { flattenChildren } from '../_internal/flatten-children';
import { useControlValueState } from '../_internal/use-control-value-state';
import { assignCheckboxGroupValuesToEvent } from './assign-checkbox-group-values';
import MznCheckbox from './checkbox.vue';
import MznCheckboxGroupProvider from './checkbox-group-provider';
import type {
  CheckboxGroupChangeEvent,
  CheckboxGroupProps,
} from './checkbox-group.types';

/**
 * 一組共用 `name` 的核取方塊。
 *
 * 選項可用 `options` 陣列或預設 slot 提供，兩者只能擇一。`level.active` 會多出一顆
 * 全選核取方塊，勾選狀態依已選數量自動變成全選或中間態。
 * `change` 事件的最新值放在 `event.target.values`。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCheckboxGroup } from '@mezzanine-ui/vue/checkbox';
 * <\/script>
 *
 * <template>
 *   <MznCheckboxGroup
 *     name="fruits"
 *     :options="[{ label: '蘋果', value: 'apple' }]"
 *     @change="onChange"
 *   />
 * </template>
 * ```
 *
 * @see MznCheckbox 單一核取方塊
 * @see MznCheckAll 包住整組的全選核取方塊
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  defaultValue: undefined,
  disabled: undefined,
  layout: 'horizontal',
  level: undefined,
  mode: undefined,
  name: undefined,
  options: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [event: CheckboxGroupChangeEvent];
}>();

const slots = defineSlots<{
  /** The group's checkboxes. Mutually exclusive with `options`. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const generatedName = useId();
const resolvedName = computed((): string => props.name ?? generatedName);

const normalizedOptions = computed(() => props.options ?? []);

const equalityFn = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((val, idx) => val === sortedB[idx]);
};

const { setValue, value } = useControlValueState<string[]>({
  defaultValue: props.defaultValue ?? [],
  equalityFn,
  value: () => props.value,
});

function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const currentValue = value.value || [];
  const newValue = target.checked
    ? [...currentValue, target.value]
    : currentValue.filter((v) => v !== target.value);

  setValue(newValue);
  emit(
    'change',
    assignCheckboxGroupValuesToEvent(event, newValue, resolvedName.value),
  );
}

const hasChildrenInput = computed((): boolean => Boolean(slots.default));
const hasOptionsInput = computed((): boolean => Array.isArray(props.options));

// Validate input props and warn about missing props
onMounted(() => {
  if (hasChildrenInput.value && hasOptionsInput.value) {
    console.error(
      'CheckboxGroup: Please provide either `children` or `options`, but not both.',
    );
  } else if (!hasChildrenInput.value && !hasOptionsInput.value) {
    console.error(
      'CheckboxGroup: Please provide one of `children` or `options`.',
    );
  }

  // Warn if name is not provided (important for form libraries)
  if (!props.name) {
    console.warn(
      'CheckboxGroup: The `name` prop is recommended, especially when integrating with react-hook-form. ' +
        'All checkboxes in the group should share the same `name` attribute.',
    );
  }

  if (hasChildrenInput.value) {
    flattenChildren((slots.default?.() ?? []) as VNodeArrayChildren).forEach(
      (child, index) => {
        if (child.type !== MznCheckbox) {
          console.warn(
            'CheckboxGroup: When using slot input, only Checkbox components are supported. ' +
              `Found unsupported component: ${typeof child.type === 'string' ? child.type : 'Unknown'}`,
          );

          return;
        }

        if (!(child.props as { value?: string } | null)?.value) {
          console.warn(
            'CheckboxGroup: Each Checkbox child should have a `value` prop. ' +
              `Checkbox at index ${index} is missing the \`value\` prop.`,
          );
        }
      },
    );
  }

  if (isLevelActive.value && !hasOptionsInput.value) {
    console.warn(
      'CheckboxGroup: `level.active=true` currently supports only the `options` input approach.',
    );
  }
});

const isLevelActive = computed((): boolean => props.level?.active ?? false);
const isChipMode = computed((): boolean => props.mode === 'chip');
const isHorizontalLayout = computed(
  (): boolean => props.layout === 'horizontal',
);
const shouldRenderLevelInsideContent = computed(
  (): boolean => isLevelActive.value && isChipMode.value,
);
const ariaOrientation = computed((): 'horizontal' | 'vertical' =>
  isLevelActive.value ? 'vertical' : props.layout,
);
const canRenderLevelControl = computed(
  (): boolean => isLevelActive.value && normalizedOptions.value.length > 0,
);

const levelState = computed(
  (): { levelChecked: boolean; levelIndeterminate: boolean } => {
    if (!canRenderLevelControl.value) {
      return { levelChecked: false, levelIndeterminate: false };
    }

    const enabledValues = normalizedOptions.value
      .filter((option) => !option.disabled)
      .map((option) => option.value);
    const selectedEnabledValues = (value.value || []).filter((v) =>
      enabledValues.includes(v),
    );

    if (selectedEnabledValues.length === 0) {
      return { levelChecked: false, levelIndeterminate: false };
    }

    if (selectedEnabledValues.length === enabledValues.length) {
      return { levelChecked: true, levelIndeterminate: false };
    }

    return { levelChecked: false, levelIndeterminate: true };
  },
);

function handleLevelControlChange(event: Event): void {
  if (!canRenderLevelControl.value) return;

  // Use custom onChange if provided
  if (props.level?.onChange) {
    props.level.onChange(event);

    return;
  }

  // Default behavior: select/deselect all
  const isChecked = (event.target as HTMLInputElement).checked;
  const currentValue = value.value || [];
  const enabledValues = normalizedOptions.value
    .filter((option) => !option.disabled)
    .map((option) => option.value);
  const disabledValues = normalizedOptions.value
    .filter((option) => option.disabled)
    .map((option) => option.value);
  const selectedDisabledValues = currentValue.filter((v) =>
    disabledValues.includes(v),
  );
  const newValue = isChecked
    ? [...enabledValues, ...selectedDisabledValues]
    : selectedDisabledValues;

  setValue(newValue);
  emit(
    'change',
    assignCheckboxGroupValuesToEvent(event, newValue, resolvedName.value),
  );
}

const optionCheckboxes = computed(() =>
  normalizedOptions.value.map((option) => {
    const {
      label,
      value: optionValue,
      disabled: optionDisabled,
      id: optionId,
      inputProps: optionInputProps,
      ...optionRest
    } = option;

    return {
      ...optionRest,
      disabled: optionDisabled ?? props.disabled,
      id:
        optionId ??
        (resolvedName.value
          ? `${resolvedName.value}-${optionValue}`
          : `checkbox-${optionValue}`),
      inputProps: optionInputProps,
      label: typeof label === 'string' ? label : String(label),
      mode: props.mode,
      value: optionValue,
    };
  }),
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    { [classes.nested]: isLevelActive.value },
    attrs.class as string,
  ),
);

const contentWrapperClasses = computed((): string =>
  clsx(
    classes.contentWrapper,
    classes.layout(props.layout),
    props.mode && classes.mode(props.mode),
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const levelControlSeparatorClass = classes.levelControlSeparator;
</script>

<template>
  <div
    v-bind="forwardedAttrs"
    :aria-orientation="ariaOrientation"
    :class="hostClasses"
    role="group"
  >
    <MznCheckbox
      v-if="canRenderLevelControl && !shouldRenderLevelInsideContent"
      :checked="levelState.levelChecked"
      :disabled="disabled || level?.disabled"
      :id="`${resolvedName}-level-control`"
      :indeterminate="levelState.levelIndeterminate"
      :label="level?.label ?? ''"
      :mode="level?.mode ?? 'default'"
      :name="`${resolvedName}-level-control`"
      @change="handleLevelControlChange"
    />
    <div :class="contentWrapperClasses">
      <template v-if="canRenderLevelControl && shouldRenderLevelInsideContent">
        <MznCheckbox
          :checked="levelState.levelChecked"
          :disabled="disabled || level?.disabled"
          :id="`${resolvedName}-level-control`"
          :indeterminate="levelState.levelIndeterminate"
          :label="level?.label ?? ''"
          :mode="level?.mode ?? 'default'"
          :name="`${resolvedName}-level-control`"
          @change="handleLevelControlChange"
        />
        <i v-if="isHorizontalLayout" :class="levelControlSeparatorClass" />
      </template>
      <MznCheckboxGroupProvider
        :disabled="disabled"
        :name="resolvedName"
        :on-change="handleChange"
        :value="value || []"
      >
        <slot v-if="hasChildrenInput" />
        <MznCheckbox
          v-for="option in optionCheckboxes"
          v-else
          :key="option.value"
          v-bind="option"
        />
      </MznCheckboxGroupProvider>
    </div>
  </div>
</template>
