<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import clsx from 'clsx';
import {
  findPreviousMaskSegment,
  getTemplateWithoutBrackets,
  isMaskSegmentFilled,
  parseFormatSegments,
} from './format-utils';
import type { FormattedInputProps } from './formatted-input.types';
import { useDateInputFormatter } from './use-date-input-formatter';

/**
 * 依格式遮罩顯示的日期／時間輸入框。
 *
 * 真正的 input 是隱形的，畫面上看到的是一層 `aria-hidden` 的字元疊層，
 * 讓已填與未填的字元可以分別上色；輸入只接受數字與 Backspace。
 * 空值且未聚焦時可用 `hoverValue` 顯示日曆的懸停預覽。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFormattedInput } from '@mezzanine-ui/vue/picker';
 * <\/script>
 *
 * <template>
 *   <MznFormattedInput format="YYYY-MM-DD" :value="value" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznPickerTrigger 包上 TextField 外框的版本
 * @see useDateInputFormatter 這個輸入框的輸入邏輯
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormattedInputProps>(), {
  errorMessages: undefined,
  hoverValue: undefined,
  placeholder: undefined,
  validate: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [formattedValue: string, rawDigits: string];
  pasteIsoValue: [isoValue: string];
}>();

const attrs = useAttrs();

const input = ref<HTMLInputElement | null>(null);

defineExpose({ input });

const {
  value,
  focused,
  isComplete,
  handleKeyDown,
  handleFocus,
  handleBlur,
  handlePaste,
} = useDateInputFormatter({
  errorMessages: () => props.errorMessages,
  format: () => props.format,
  inputRef: input,
  onChange: (formattedValue, rawDigits) =>
    emit('change', formattedValue, rawDigits),
  onPasteIsoValue: (isoValue) => emit('pasteIsoValue', isoValue),
  validate: (isoDate) => props.validate?.(isoDate) ?? true,
  value: () => props.value,
});

/** Built once, exactly as React builds it in a ref. */
const segments = parseFormatSegments(props.format);

const template = computed((): string =>
  getTemplateWithoutBrackets(props.format),
);

const displaySegments = computed(
  (): { filled: boolean; text: string }[] | null => {
    const isTemplate = value.value === template.value;
    const isHoverPreview = isTemplate && !!props.hoverValue;
    const currentValue = isHoverPreview ? props.hoverValue! : value.value || '';

    // Show native placeholder when no value and no hover preview
    if (isTemplate && !isHoverPreview && props.placeholder) {
      return null;
    }

    const result: { filled: boolean; text: string }[] = [];

    for (const segment of segments) {
      if (segment.type === 'mask') {
        for (let i = segment.start; i < segment.end; i++) {
          result.push({
            text: currentValue[i] || segment.text[i - segment.start],
            filled: isHoverPreview ? false : /\d/.test(currentValue[i]),
          });
        }
      } else {
        const prevMask = findPreviousMaskSegment(segments, segment.start);
        const isFilled = isHoverPreview
          ? false
          : prevMask
            ? isMaskSegmentFilled(currentValue, prevMask)
            : false;

        result.push({
          text: segment.text,
          filled: isFilled,
        });
      }
    }

    return result;
  },
);

const segmentClasses = (filled: boolean): string =>
  clsx(
    classes.formattedInputSegment,
    filled &&
      (isComplete.value
        ? classes.formattedInputSegmentFilled
        : classes.formattedInputSegmentFilling),
    Boolean(attrs.disabled) && classes.formattedInputSegmentDisabled,
  );

const placeholder = computed((): string | undefined => {
  if (value.value === template.value) {
    // Suppress native placeholder when hover preview is active
    if (props.hoverValue) return undefined;

    if (focused.value) return template.value;

    return props.placeholder;
  }

  return undefined;
});

const inputValue = computed((): string =>
  value.value === template.value ? '' : value.value,
);

const inputClasses = computed((): string =>
  clsx(classes.inputMono, classes.formattedInputHidden, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const hostClass = classes.formattedInput;
const displayClass = classes.formattedInputDisplay;
</script>

<template>
  <div :class="hostClass">
    <input
      ref="input"
      v-bind="forwardedAttrs"
      :class="inputClasses"
      :placeholder="placeholder"
      type="text"
      :value="inputValue"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeyDown"
      @paste="handlePaste"
    />
    <div v-if="displaySegments" aria-hidden="true" :class="displayClass">
      <span
        v-for="(segment, index) in displaySegments"
        :key="index"
        :class="segmentClasses(segment.filled)"
        >{{ segment.text }}</span
      >
    </div>
  </div>
</template>
