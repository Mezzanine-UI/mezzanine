<script setup lang="ts">
import { cloneVNode, computed, isVNode } from 'vue';
import type { VNode, VNodeChild } from 'vue';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import clsx from 'clsx';
import { useTableContext } from './table-context';
import { useTableDataContext } from './table-data-context';
import MznTable from './table.vue';
import type { TableExpandedRowProps } from './table-expanded-row.types';

/**
 * 展開後的內容列，橫跨整個表格寬度。
 *
 * 內容由 `expandable.expandedRowRender(record)` 提供；如果回傳的是另一個 MznTable，
 * 會自動補上 `nested` 與 `show-header: false`，讓子表沿用父表的量測結果。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableExpandedRow :record="record" />
 * </template>
 * ```
 *
 * @see MznTableExpandCell 觸發展開的儲存格
 */
const props = withDefaults(
  defineProps<TableExpandedRowProps<TableDataSource>>(),
  { style: undefined },
);

const table = useTableContext();
const data = useTableDataContext();

// Calculate total column span
const totalColSpan = computed((): number => {
  const { draggable, expansion, selection } = table.value;
  let colSpan = data.value.columns.length;

  // Add 1 for expand column itself
  if (expansion) colSpan += 1;
  if (draggable?.enabled) colSpan += 1;
  if (selection) colSpan += 1;

  return colSpan;
});

const rowKey = computed((): string => getRowKey(props.record));

const isExpanded = computed((): boolean =>
  Boolean(table.value.expansion?.isRowExpanded(rowKey.value)),
);

const expandedRowRender = computed(
  () => table.value.expansion?.config?.expandedRowRender,
);

const rowClasses = computed((): string =>
  clsx(classes.expandedRow, {
    [classes.expandedRowAdding]:
      table.value.transitionState?.addingKeys.has(rowKey.value) ?? false,
    [classes.expandedRowDeleting]:
      table.value.transitionState?.deletingKeys.has(rowKey.value) ?? false,
    [classes.expandedRowFadingOut]:
      table.value.transitionState?.fadingOutKeys.has(rowKey.value) ?? false,
  }),
);

/**
 * React clones the rendered child and, when it is a Table, injects the two
 * props that make it behave as a nested one.
 */
const content = computed((): VNodeChild => {
  const rendered = expandedRowRender.value?.(props.record);

  if (isVNode(rendered) && (rendered as VNode).type === MznTable) {
    return cloneVNode(rendered as VNode, {
      nested: true,
      showHeader: false,
    });
  }

  return rendered;
});
</script>

<template>
  <tr
    v-if="expandedRowRender && isExpanded"
    :class="rowClasses"
    :data-row-key="`${rowKey}-expanded`"
    :style="style"
  >
    <td
      :class="classes.expandedRowCell"
      :colspan="totalColSpan"
      :style="{
        paddingLeft: `${table.expansion?.expansionLeftPadding ?? 0}px`,
      }"
    >
      <div :class="classes.expandedContent">
        <component :is="() => content" />
      </div>
    </td>
  </tr>
</template>
