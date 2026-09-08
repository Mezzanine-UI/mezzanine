<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { multipleDatePickerClasses as classes } from '@mezzanine-ui/core/multiple-date-picker';
import type { TagSize } from '@mezzanine-ui/core/tag';
import clsx from 'clsx';
import MznOverflowCounterTag from '../overflow-tooltip/overflow-counter-tag.vue';
import { useSelectTriggerTags } from '../select/use-select-trigger-tags';
import type { SelectValue } from '../select/select.types';
import MznTagGroup from '../tag/tag-group.vue';
import MznTag from '../tag/tag.vue';
import MznTextField from '../text-field/text-field.vue';
import type {
  DateValue,
  MultipleDatePickerTriggerProps,
} from './multiple-date-picker-trigger.types';

/**
 * MznMultipleDatePicker 的觸發器：把選到的日期以標籤列在輸入框裡。
 *
 * `overflowStrategy="counter"` 時放不下的標籤會收進計數標籤，`wrap` 則全部換行
 * 顯示。沒有值時只留一個唯讀的輸入框顯示 placeholder。
 *
 * @see MznMultipleDatePicker 使用這個觸發器的元件
 */
const props = withDefaults(defineProps<MultipleDatePickerTriggerProps>(), {
  active: false,
  clearable: true,
  disabled: false,
  error: false,
  forceShowClearable: undefined,
  fullWidth: false,
  hideSuffixWhenClearable: undefined,
  overflowStrategy: 'counter',
  placeholder: undefined,
  readOnly: false,
  required: false,
  size: 'main',
  value: () => [],
  warning: undefined,
});

const emit = defineEmits<{
  clear: [event: MouseEvent];
  tagClose: [date: DateType];
}>();

defineSlots<{
  /** The trigger's prefix. */
  prefix?: () => unknown;
  /** The trigger's suffix, usually the calendar icon. */
  suffix?: () => unknown;
}>();

const tagsContainer = ref<HTMLElement | null>(null);
const tags = ref<HTMLElement | null>(null);

const tagSize = computed(
  (): TagSize => (props.size === 'main' ? 'main' : 'sub'),
);

const selectValues = computed((): SelectValue[] =>
  props.value.map((item) => ({ id: item.id, name: item.name })),
);

const { FakeTags, overflowSelections, visibleSelections } =
  useSelectTriggerTags({
    containerRef: tagsContainer,
    enabled: () => props.overflowStrategy === 'counter',
    size: () => tagSize.value,
    tagsRef: tags,
    value: () => selectValues.value,
  });

const displaySelections = computed((): SelectValue[] =>
  props.overflowStrategy === 'counter'
    ? visibleSelections.value
    : selectValues.value,
);

const findDateValue = (id: string): DateValue | undefined =>
  props.value.find((item) => item.id === id);

function handleTagClose(id: string, event: MouseEvent): void {
  event.stopPropagation();

  const dateValue = findDateValue(id);

  if (dateValue) emit('tagClose', dateValue.date);
}

function onOverflowTagDismiss(tagIndex: number): void {
  const target = overflowSelections.value[tagIndex];

  if (!target) return;

  const dateValue = findDateValue(target.id);

  if (dateValue) emit('tagClose', dateValue.date);
}

function onOverflowCounterClick(event: MouseEvent): void {
  event.stopPropagation();
}

const hasValue = computed((): boolean => props.value.length > 0);

/** TextField requires disabled and readonly to be mutually exclusive. */
const interactiveProps = computed(() => {
  if (props.disabled) return { disabled: true as const };

  if (props.readOnly) return { readonly: true as const };

  return {};
});

const hostClasses = computed((): string =>
  clsx(classes.trigger, {
    [classes.triggerSelected]: hasValue.value,
    [classes.triggerDisabled]: props.disabled,
    [classes.triggerReadOnly]: props.readOnly,
  }),
);

const tagsWrapperClasses = computed((): string =>
  clsx(classes.triggerTagsWrapper, {
    [classes.triggerTagsWrapperEllipsis]: props.overflowStrategy === 'counter',
  }),
);

const tagsClasses = computed((): string =>
  clsx(classes.triggerTags, {
    [classes.triggerTagsEllipsis]: props.overflowStrategy === 'counter',
  }),
);

const inputClass = classes.triggerInput;
const inputAbsoluteClasses = clsx(
  classes.triggerInput,
  classes.triggerInputAbsolute,
);
</script>

<template>
  <MznTextField
    role="presentation"
    v-bind="interactiveProps"
    :active="active"
    :class="hostClasses"
    :clearable="!readOnly && clearable && hasValue"
    :error="error"
    :force-show-clearable="!readOnly && clearable && hasValue"
    :full-width="fullWidth"
    :size="size"
    @clear="emit('clear', $event)"
  >
    <!--
      Only forwarded when the consumer actually gave one: an always-present
      slot makes the text field believe it has a prefix, which changes its gap
      and renders an empty prefix element.
    -->
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template #suffix><slot name="suffix" /></template>
    <div ref="tagsContainer" :class="tagsWrapperClasses">
      <template v-if="hasValue">
        <div ref="tags" :class="tagsClasses">
          <MznTagGroup>
            <MznTag
              v-for="selection in displaySelections"
              :key="selection.id"
              :disabled="readOnly ? undefined : disabled"
              :label="selection.name"
              :read-only="readOnly ? true : undefined"
              :size="tagSize"
              :type="readOnly ? 'static' : 'dismissable'"
              @close="handleTagClose(selection.id, $event)"
            />
            <MznOverflowCounterTag
              v-if="overflowStrategy === 'counter' && overflowSelections.length"
              key="overflow-counter"
              :disabled="disabled"
              :read-only="readOnly"
              :tag-size="tagSize"
              :tags="overflowSelections.map((selection) => selection.name)"
              @click="onOverflowCounterClick"
              @tag-dismiss="onOverflowTagDismiss"
            />
          </MznTagGroup>
          <FakeTags v-if="overflowStrategy === 'counter'" />
        </div>
        <!-- Hidden input for accessibility -->
        <input
          :aria-disabled="disabled"
          :aria-multiline="false"
          :aria-readonly="readOnly"
          :aria-required="required"
          :class="inputAbsoluteClasses"
          :disabled="disabled"
          readonly
          :tabindex="-1"
          type="text"
          value=""
        />
      </template>
      <input
        v-else
        :aria-disabled="disabled"
        :aria-multiline="false"
        :aria-readonly="readOnly"
        :aria-required="required"
        :class="inputClass"
        :disabled="disabled"
        :placeholder="placeholder"
        readonly
        :tabindex="-1"
        type="text"
        value=""
      />
    </div>
  </MznTextField>
</template>
