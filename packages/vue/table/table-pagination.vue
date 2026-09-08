<script setup lang="ts">
import MznPagination from '../pagination/pagination.vue';
import type { TablePaginationProps } from './table-pagination.types';

/**
 * 表格底部的分頁，就是 MznPagination 的一層轉接。
 *
 * React 的 `TablePaginationProps` 直接等於 `PaginationProps`；Vue 這邊多做的只有把設定
 * 物件裡的 `onChange` / `onChangePageSize` 兩個欄位接回 MznPagination 的 emit。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTablePagination :current="page" :total="100" :on-change="setPage" />
 * </template>
 * ```
 *
 * @see MznTable 渲染它的元件
 */
const props = defineProps<TablePaginationProps>();
</script>

<template>
  <MznPagination
    v-bind="props"
    @change="onChange?.($event)"
    @change-page-size="onChangePageSize?.($event)"
  />
</template>
