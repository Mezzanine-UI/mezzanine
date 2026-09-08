<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { getRowKey, tableClasses as classes } from '@mezzanine-ui/core/table';
import { toCssLength } from '../_internal/css-length';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import MznEmpty from '../empty/empty.vue';
import type { EmptyProps } from '../empty/empty.types';
import MznFade from '../transition/fade.vue';
import MznTableExpandedRow from './table-expanded-row.vue';
import MznTableRow from './table-row.vue';
import type { TableDraggableProvided } from './table-drag-and-drop.types';
import { useTableContext } from './table-context';
import { useTableDataContext } from './table-data-context';
import { useTableDraggableRow } from './use-table-drag-and-drop';
import { useTableVirtualization } from './use-table-virtualization';

/**
 * 表格的 tbody：依序決定要渲染骨架列、空狀態，還是資料列。
 *
 * 載入中的骨架列刻意不帶 record —— 捏一個假的 record 會塞給使用端一個它沒有同意過的
 * 形狀，所以 MznTableRow 與底下的儲存格都接受 `record` 為空，並在缺席時略過每一個
 * 使用端回呼。展開列與拖曳包裝同樣跳過，兩者都以 record 為前提。
 *
 * @see MznTable 渲染它的元件
 */
const table = useTableContext();
const data = useTableDataContext();

/** Feature: Virtualized Scroll */
const virtualization = useTableVirtualization({
  dataSource: () => table.value.dataSource,
  enabled: () => Boolean(table.value.virtualScrollEnabled),
  isContainerReady: () => Boolean(table.value.isContainerReady),
  isRowExpanded: (key) => table.value.expansion?.isRowExpanded(key) ?? false,
  scrollContainerRef:
    table.value.scrollContainerRef ?? shallowRef<HTMLDivElement | null>(null),
});

/** Feature: Drag n Drop */
const dragAndDrop = useTableDraggableRow();

/**
 * React wraps a row in a `Draggable` only when dragging is on and the body is
 * not virtualized — the two measure the same rows in incompatible ways.
 */
const draggableProvidedFor = (
  record: (typeof data.value.dataSource)[number],
  index: number,
): TableDraggableProvided | undefined => {
  if (!table.value.draggable?.enabled || virtualization.value) return undefined;

  return dragAndDrop?.value.draggableFor(getRowKey(record), index);
};

/** Feature: Empty State */
const isEmpty = computed((): boolean => !table.value.dataSource.length);

/** Calculate total columns */
const totalColSpan = computed((): number => {
  const { draggable, expansion, selection } = table.value;
  let colSpan = data.value.columns.length;

  if (draggable?.enabled) colSpan += 1;
  if (selection) colSpan += 1;
  if (expansion) colSpan += 1;

  return colSpan;
});

const skeletonRows = computed((): number[] =>
  Array.from(
    { length: Math.max(table.value.loadingRowsCount ?? 10, 1) },
    (_, index) => index,
  ),
);

const emptyState = computed(() => {
  const { emptyProps, size } = table.value;
  const { height, size: emptySize = size, ...rest } = emptyProps ?? {};

  return {
    height,
    // React spreads the rest straight onto Empty; `title` is required there
    // too, and a table without it simply renders Empty's own default.
    props: rest as EmptyProps,
    size: emptySize,
  };
});

const isRowExpanded = (
  record: (typeof data.value.dataSource)[number],
): boolean => table.value.expansion?.isRowExpanded(getRowKey(record)) ?? false;

/** Determine items to render (virtualized or all). */
const itemsToRender = computed(() =>
  virtualization.value
    ? virtualization.value.virtualItems.map((item) => ({
        index: item.index,
        measureRef: virtualization.value?.measureElement,
        record: table.value.dataSource[item.index],
      }))
    : table.value.dataSource.map((record, index) => ({
        index,
        measureRef: undefined,
        record,
      })),
);
</script>

<template>
  <tbody :class="classes.body">
    <template v-if="table.loading">
      <MznTableRow
        v-for="index in skeletonRows"
        :key="`skeleton-${index}`"
        :row-index="index"
      />
    </template>
    <tr v-else-if="isEmpty" :class="classes.emptyRow">
      <td
        :class="classes.empty"
        :colspan="totalColSpan"
        :style="
          emptyState.height
            ? { height: toCssLength(emptyState.height) }
            : undefined
        "
      >
        <MznEmpty v-bind="emptyState.props" :size="emptyState.size" />
      </td>
    </tr>
    <template v-else>
      <!-- Virtualization needs padding rows for scroll height -->
      <tr v-if="(virtualization?.paddingTop ?? 0) > 0" aria-hidden="true">
        <td
          :colspan="totalColSpan"
          :style="{ height: `${virtualization?.paddingTop}px`, padding: 0 }"
        />
      </tr>
      <template v-for="item in itemsToRender" :key="getRowKey(item.record)">
        <MznTableRow
          :draggable-provided="draggableProvidedFor(item.record, item.index)"
          :measure-ref="item.measureRef"
          :record="item.record"
          :row-index="item.index"
        />
        <MznFade
          v-if="table.expansion"
          :duration="{
            enter: MOTION_DURATION.moderate,
            exit: MOTION_DURATION.moderate,
          }"
          :easing="{ enter: MOTION_EASING.entrance, exit: MOTION_EASING.exit }"
          :in="isRowExpanded(item.record)"
        >
          <MznTableExpandedRow :record="item.record" />
        </MznFade>
      </template>
      <tr v-if="(virtualization?.paddingBottom ?? 0) > 0" aria-hidden="true">
        <td
          :colspan="totalColSpan"
          :style="{ height: `${virtualization?.paddingBottom}px`, padding: 0 }"
        />
      </tr>
    </template>
  </tbody>
</template>
