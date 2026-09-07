<script setup lang="ts">
import { computed, h, useAttrs } from 'vue';
import type { VNodeChild } from 'vue';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznTextField from '../text-field/text-field.vue';
import type { SelectValue } from './select.types';
import type { SelectTriggerProps } from './select-trigger.types';
import MznSelectTriggerTags from './select-trigger-tags.vue';

/**
 * Select 的觸發器：一個唯讀輸入框加上右側的收合箭頭。
 *
 * 單選模式把選中的名稱寫進輸入框，多選模式改在輸入框上疊一排標籤；
 * 箭頭預設會把點擊轉發給觸發器本身，`suffixAction` 可接管。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSelectTrigger } from '@mezzanine-ui/vue/select';
 * <\/script>
 *
 * <template>
 *   <MznSelectTrigger :active="open" placeholder="請選擇" :value="value" />
 * </template>
 * ```
 *
 * @see MznSelect 使用這個觸發器的元件
 * @see MznSelectTriggerTags 多選模式的標籤列
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectTriggerProps>(), {
  active: undefined,
  clearable: false,
  disabled: undefined,
  error: undefined,
  forceHideSuffixActionIcon: undefined,
  forceShowClearable: undefined,
  fullWidth: undefined,
  hideSuffixWhenClearable: undefined,
  inputProps: undefined,
  isForceClearable: false,
  mode: 'single',
  overflowStrategy: 'counter',
  placeholder: undefined,
  readOnly: undefined,
  renderValue: undefined,
  required: undefined,
  searchText: undefined,
  showTextInputAfterTags: false,
  size: 'main',
  suffixAction: undefined,
  suffixActionIcon: undefined,
  type: 'default',
  value: undefined,
  warning: undefined,
});

const emit = defineEmits<{
  /** Fired when the clear button is clicked. */
  clear: [event: MouseEvent];
  /** The click handler for the cross icon on tags. */
  tagClose: [target: SelectValue];
}>();

const slots = defineSlots<{
  /** The field's prefix, rendered before the input. */
  prefix?: () => unknown;
}>();

const attrs = useAttrs();

const isMultiple = computed((): boolean => props.mode === 'multiple');

const multipleValue = computed((): SelectValue[] | undefined =>
  Array.isArray(props.value) ? props.value : undefined,
);

const singleValue = computed((): SelectValue | undefined =>
  Array.isArray(props.value) ? undefined : props.value,
);

/** Render value to string for single selection trigger input */
const renderedValue = computed((): string | undefined => {
  if (isMultiple.value) return undefined;

  if (typeof props.renderValue === 'function') {
    return props.renderValue(singleValue.value);
  }

  return singleValue.value?.name ?? '';
});

function handleSuffixActionClick(event: MouseEvent): void {
  event.stopPropagation();

  if (props.suffixAction) {
    props.suffixAction();

    return;
  }

  // Delegate to trigger click behavior without fabricating a synthetic event.
  (event.currentTarget as HTMLElement)
    .closest(`.${classes.trigger}`)
    ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

const suffixActionIconClasses = computed((): string =>
  clsx(classes.triggerSuffixActionIcon, {
    [classes.triggerSuffixActionIconActive]: props.active,
  }),
);

/** React defaults the suffix to a chevron that forwards its click. */
const suffixActionIcon = computed(
  (): VNodeChild =>
    props.suffixActionIcon ??
    h(MznIcon, {
      class: suffixActionIconClasses.value,
      icon: ChevronDownIcon,
      onClick: handleSuffixActionClick,
    }),
);

const interactiveProps = computed((): { disabled?: true; readonly?: true } => {
  if (props.disabled) return { disabled: true };

  if (props.readOnly) return { readonly: true };

  return {};
});

const hasMultipleSelections = computed(
  (): boolean => isMultiple.value && (multipleValue.value?.length ?? 0) > 0,
);

const shouldEnableClearable = computed(
  (): boolean =>
    props.isForceClearable || (props.clearable && hasMultipleSelections.value),
);

const triggerClasses = computed((): unknown[] => [
  clsx(
    classes.trigger,
    classes.triggerMode(props.mode),
    classes.triggerSelected(
      Array.isArray(props.value) ? props.value.length : props.value,
    ),
    {
      [classes.triggerReadOnly]: props.readOnly,
      [classes.triggerDisabled]: props.disabled,
    },
  ),
  attrs.class,
]);

/**
 * `role` is written before the fallthrough bind on purpose: React spreads the
 * props it was handed *after* its own `role="presentation"`, so the
 * `role="combobox"` the Dropdown injects into the trigger wins. Vue merges in
 * template order, so the same thing has to be written the same way round.
 *
 * `value` is bound for the same reason: React never pulls it out of the props
 * it forwards, so the selection lands on the trigger's root `div` as a
 * stringified `value` attribute. It is a leak rather than a feature — Angular
 * took a deviation for it — but Vue can reproduce it, and the diff is the spec.
 */
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const inputClasses = computed((): unknown[] => [
  classes.triggerInput,
  props.inputProps?.class,
]);

const inputAttrs = computed(() => {
  const { class: _class, ...rest } = props.inputProps ?? {};

  return rest;
});
</script>

<template>
  <MznTextField
    role="presentation"
    v-bind="{ ...forwardedAttrs, ...interactiveProps }"
    :active="active"
    :class="triggerClasses"
    :clearable="shouldEnableClearable"
    :error="error || type === 'error'"
    :force-show-clearable="shouldEnableClearable"
    :full-width="fullWidth"
    :hide-suffix-when-clearable="hideSuffixWhenClearable"
    :size="size"
    :value="value"
    :warning="warning"
    @clear="emit('clear', $event)"
  >
    <template v-if="slots.prefix" #prefix><slot name="prefix" /></template>
    <template v-if="!forceHideSuffixActionIcon" #suffix>
      <component :is="() => suffixActionIcon" />
    </template>
    <input
      v-bind="inputAttrs"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      autocomplete="off"
      :class="inputClasses"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="inputProps?.readonly ?? true"
      :required="required"
      type="text"
      :value="renderedValue"
    />

    <MznSelectTriggerTags
      v-if="isMultiple && multipleValue?.length"
      :disabled="disabled"
      :input-props="inputProps"
      :overflow-strategy="overflowStrategy"
      :read-only="readOnly"
      :required="required"
      :search-text="searchText"
      :show-text-input-after-tags="showTextInputAfterTags"
      :size="size"
      :value="multipleValue"
      @tag-close="emit('tagClose', $event)"
    />
  </MznTextField>
</template>
