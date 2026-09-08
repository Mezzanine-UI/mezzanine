<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  formFieldClasses as classes,
  formHintIcons,
} from '@mezzanine-ui/core/form';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import type { FormHintTextProps } from './form-hint-text.types';

/**
 * 表單欄位的提示文字。
 *
 * 依 `severity` 決定顏色與預設圖示；`hintTextIcon` 可蓋掉預設圖示，
 * `showHintTextIcon` 設為 false 則兩者都不顯示。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFormHintText } from '@mezzanine-ui/vue/form';
 * <\/script>
 *
 * <template>
 *   <MznFormHintText hint-text="電子郵件格式不正確" severity="error" />
 * </template>
 * ```
 *
 * @see MznFormField 使用這個提示文字的欄位容器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormHintTextProps>(), {
  hintText: undefined,
  hintTextIcon: undefined,
  severity: 'info',
  showHintTextIcon: true,
});

const attrs = useAttrs();

const defaultIcon = computed(() =>
  props.severity ? formHintIcons[props.severity] : null,
);

const icon = computed(() => props.hintTextIcon ?? defaultIcon.value);

const hostClasses = computed((): string =>
  clsx(
    classes.hintText,
    props.severity ? classes.hintTextSeverity(props.severity) : undefined,
    attrs.class as string,
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const iconClass = classes.hintTextIcon;
</script>

<template>
  <span v-bind="forwardedAttrs" :class="hostClasses">
    <MznIcon
      v-if="showHintTextIcon && icon"
      :class="iconClass"
      :color="severity"
      :icon="icon"
    />{{ hintText }}</span
  >
</template>
