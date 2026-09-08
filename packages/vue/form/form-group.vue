<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { formGroupClasses as classes } from '@mezzanine-ui/core/form';
import clsx from 'clsx';
import type { FormGroupProps } from './form-group.types';

/**
 * 表單欄位群組：一個標題加上一組欄位。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFormGroup } from '@mezzanine-ui/vue/form';
 * <\/script>
 *
 * <template>
 *   <MznFormGroup title="基本資料">
 *     <MznFormField label="姓名"><MznInput /></MznFormField>
 *   </MznFormGroup>
 * </template>
 * ```
 *
 * @see MznFormField 群組裡的欄位容器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormGroupProps>(), {
  fieldsContainerClassName: undefined,
});

defineSlots<{
  /** The group's fields. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const hostClasses = computed((): string =>
  clsx(classes.host, attrs.class as string),
);

const fieldsContainerClasses = computed((): string =>
  clsx(classes.fieldsContainer, props.fieldsContainerClassName),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const titleClass = classes.title;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="titleClass">{{ title }}</div>
    <div :class="fieldsContainerClasses"><slot /></div>
  </div>
</template>
