<script setup lang="ts">
import type { ContentHeaderResponsiveProps } from './content-header-responsive.types';

/**
 * 把一段 ContentHeader 的子項標記成只在某個斷點顯示。
 *
 * 自己不渲染任何元素 —— ContentHeader 會把斷點的 class 加到裡面的子項上，
 * 再照原本的規則分派到篩選器、動作或工具區。
 *
 * @experimental 這個元件還在測試，API 可能會經常變動。
 *
 * @example
 * ```vue
 * <MznContentHeaderResponsive breakpoint="above1080px">
 *   <MznButton variant="destructive-secondary">批次刪除</MznButton>
 * </MznContentHeaderResponsive>
 * ```
 *
 * @see MznContentHeader 讀取這個標記的容器
 */
defineProps<ContentHeaderResponsiveProps>();

defineSlots<{
  /** The children that only show at the breakpoint. */
  default?: () => unknown;
}>();
</script>

<template>
  <slot />
</template>
