<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import {
  DotDragVerticalIcon,
  PinFilledIcon,
  PinIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznSkeleton from '../skeleton/skeleton.vue';
import { useTableContext } from './table-context';
import type { TableDragOrPinHandleCellProps } from './table-drag-or-pin-handle-cell.types';

/**
 * 拖曳把手或釘選按鈕的儲存格 —— 兩者共用同一個欄位，所以由 `mode` 決定渲染哪一種。
 *
 * 拖曳模式只是把 `drag-handle-props` 原封不動灑到把手上，實際的拖曳邏輯不在這裡；
 * 釘選模式則是一顆受控的按鈕，狀態來自 `pinnable.pinnedRowKeys`。表頭永遠是空的。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableDragOrPinHandleCell mode="pin" :record="record" />
 * </template>
 * ```
 *
 * @see MznTableRow 決定要不要渲染它的元件
 */
const props = withDefaults(
  defineProps<TableDragOrPinHandleCellProps<TableDataSource>>(),
  {
    dragHandleProps: undefined,
    fixed: false,
    fixedOffset: 0,
    isHeader: false,
    record: undefined,
    showShadow: false,
    width: undefined,
  },
);

const table = useTableContext();

const cellComponent = computed((): string => (props.isHeader ? 'th' : 'td'));

const cellStyle = computed((): CSSProperties => {
  const style: CSSProperties = {};

  // Apply explicit width for dragging state
  if (props.width !== undefined) {
    style.width = `${props.width}px`;
    style.minWidth = `${props.width}px`;
    style.maxWidth = `${props.width}px`;
    style.flexShrink = 0;
  }

  if (props.fixed) {
    (style as Record<string, string>)['--fixed-start-offset'] =
      `${props.fixedOffset}px`;
  }

  return style;
});

const cellClasses = computed((): string =>
  clsx(
    props.isHeader ? classes.headerCell : classes.cell,
    classes.dragOrPinHandleCell,
    {
      [classes.cellFixed]: props.fixed,
      [classes.cellFixedStart]: props.fixed,
      [classes.cellFixedShadow]: props.showShadow,
    },
  ),
);

const rowKey = computed((): string =>
  props.record ? getRowKey(props.record) : '',
);

const isPinned = computed(
  (): boolean =>
    table.value.pinnable?.pinnedRowKeys.includes(rowKey.value) ?? false,
);

/** React spreads `dragHandleProps` on the skeleton too, so the drag still starts. */
const skeletonHandleProps = computed(
  (): Record<string, unknown> =>
    props.mode === 'drag' ? (props.dragHandleProps ?? {}) : {},
);

function handlePinClick(): void {
  const { pinnable } = table.value;

  if (!pinnable || !props.record) return;

  pinnable.onPinChange(props.record, !isPinned.value);
}
</script>

<template>
  <component
    :is="cellComponent"
    :class="cellClasses"
    :scope="isHeader ? 'col' : undefined"
    :style="cellStyle"
  >
    <template v-if="!isHeader">
      <MznSkeleton
        v-if="table.loading"
        v-bind="skeletonHandleProps"
        variant="body-highlight"
        width="100%"
      />
      <span
        v-else-if="mode === 'drag'"
        :class="classes.dragOrPinHandle"
        v-bind="dragHandleProps"
      >
        <MznIcon color="neutral" :icon="DotDragVerticalIcon" />
      </span>
      <button
        v-else
        :aria-label="isPinned ? 'Unpin row' : 'Pin row'"
        :aria-pressed="isPinned"
        :class="clsx(classes.dragOrPinHandle, classes.pinHandleIcon)"
        type="button"
        @click="handlePinClick"
      >
        <MznIcon
          :color="isPinned ? 'brand' : 'neutral'"
          :icon="isPinned ? PinFilledIcon : PinIcon"
        />
      </button>
    </template>
  </component>
</template>
