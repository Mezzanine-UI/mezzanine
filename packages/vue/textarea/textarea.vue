<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { StyleValue } from 'vue';
import { textareaClasses as classes } from '@mezzanine-ui/core/textarea';
import { ResizeHandleIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import type { ClassValue } from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznTextField from '../text-field/text-field.vue';
import type { TextareaProps } from './textarea.types';

/**
 * 多行文字輸入區域元件，支援禁用、唯讀、警告與錯誤等視覺狀態。
 *
 * 以 `MznTextField` 作為外框容器，`type` 控制視覺樣式（`default`、`warning`、`error`），
 * `disabled` 與 `readOnly` 僅在 `type="default"` 時有效。`resize` prop 對應原生 CSS
 * `resize` 屬性，設為非 `none` 時會顯示右下角的調整大小拖曳圖示。
 *
 * 未宣告為 prop 的屬性與監聽器全部落在內層原生 textarea 上（`class` 例外，落在外框），
 * 因此值要用原生的 `:value` + `@input` 綁定 — 本元件沒有 `modelValue` prop，
 * `v-model` 不會生效。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTextarea } from '@mezzanine-ui/vue/textarea';
 * <\/script>
 *
 * <template>
 *   <MznTextarea placeholder="請輸入內容..." rows="4" />
 *   <MznTextarea resize="vertical" rows="3" />
 *   <MznTextarea :value="text" type="error" @input="text = $event.target.value" />
 *   <MznTextarea disabled placeholder="此欄位已停用" />
 * </template>
 * ```
 *
 * @see MznTextField 輸入類元件的視覺外框
 */
/**
 * Every attribute that is not a declared prop belongs on the textarea, not on
 * the frame — React spreads its rest props onto the textarea element and hands
 * only `className` to `TextField`. `class` is therefore split back out below
 * and `style` is merged with `resize` by hand, which is why fallthrough has to
 * be turned off rather than left to Vue.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TextareaProps>(), {
  disabled: undefined,
  readOnly: undefined,
  resize: 'none',
  textareaClassName: undefined,
  type: 'default',
});

const attrs = useAttrs();
const textarea = ref<HTMLTextAreaElement | null>(null);

/**
 * React's `textareaRef` prop; `Ref`-suffixed props are an imperative surface in
 * Vue, reached with a template ref on the component itself.
 */
defineExpose({
  get textareaRef(): HTMLTextAreaElement | null {
    return textarea.value;
  },
});

/**
 * The frame is told it is disabled or readonly only on the default type, and
 * disabled wins — the same precedence React writes as a nested conditional.
 * Both stay `undefined` otherwise so nothing is passed at all.
 */
const fieldDisabled = computed((): true | undefined =>
  props.type === 'default' && props.disabled ? true : undefined,
);

const fieldReadonly = computed((): true | undefined =>
  props.type === 'default' && !props.disabled && props.readOnly
    ? true
    : undefined,
);

const hostClasses = computed((): string =>
  clsx(classes.host, attrs.class as ClassValue),
);

const textareaClasses = computed((): string =>
  clsx(classes.textarea, props.textareaClassName),
);

/**
 * `resize` first so a caller-supplied `style` can still override it, matching
 * React's `{ resize, ...style }`.
 */
const textareaStyle = computed(
  (): StyleValue => [{ resize: props.resize }, attrs.style as StyleValue],
);

const textareaAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;

  return rest;
});

const resizerClass = classes.resizer;
</script>

<template>
  <MznTextField
    :class="hostClasses"
    :disabled="fieldDisabled"
    :error="type === 'error'"
    :readonly="fieldReadonly"
    role="presentation"
    :warning="type === 'warning'"
  >
    <textarea
      v-bind="textareaAttrs"
      ref="textarea"
      :class="textareaClasses"
      :disabled="disabled"
      :readonly="readOnly"
      :style="textareaStyle"
    />

    <MznIcon
      v-if="resize !== 'none'"
      :class="resizerClass"
      :icon="ResizeHandleIcon"
      :size="16"
    />
  </MznTextField>
</template>
