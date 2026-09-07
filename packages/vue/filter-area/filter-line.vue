<script setup lang="ts">
import { filterAreaClasses as classes } from '@mezzanine-ui/core/filter-area';
import type { FilterLineProps } from './filter-line.types';

/**
 * 篩選器中的單行條件列，包含一或多個 MznFilter 欄位。
 *
 * 以 Grid 排版把 MznFilter 子元件橫向排開；要放在 MznFilterArea 底下使用。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFilter, MznFilterLine } from '@mezzanine-ui/vue/filter-area';
 * <\/script>
 *
 * <template>
 *   <MznFilterLine>
 *     <MznFilter :span="2">...</MznFilter>
 *   </MznFilterLine>
 * </template>
 * ```
 *
 * @see MznFilterArea 管理多條 MznFilterLine 的容器
 * @see MznFilter 包住單一篩選欄位
 */
defineProps<FilterLineProps>();

defineSlots<{
  /** The filters this line holds. */
  default?: () => unknown;
}>();
</script>

<template>
  <div :class="classes.line"><slot /></div>
</template>
