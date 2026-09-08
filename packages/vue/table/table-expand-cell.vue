<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznSkeleton from '../skeleton/skeleton.vue';
import { useTableContext } from './table-context';
import type { TableExpandCellProps } from './table-expand-cell.types';

/**
 * 展開欄的儲存格：資料列放一顆會旋轉的箭頭按鈕，表頭永遠是空的。
 *
 * `can-expand` 為 false 時整顆按鈕都不渲染，點擊也不會冒泡出去。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableExpandCell :expanded="isExpanded" @click="toggle" />
 * </template>
 * ```
 *
 * @see MznTableExpandedRow 展開後的內容列
 */
const props = withDefaults(defineProps<TableExpandCellProps>(), {
  canExpand: true,
  fixed: false,
  fixedOffset: 0,
  isHeader: false,
  showShadow: false,
  width: undefined,
});

const emit = defineEmits<{
  /** Fired when the expand button is pressed. */
  click: [];
}>();

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
  clsx(props.isHeader ? classes.headerCell : classes.cell, classes.expandCell, {
    [classes.cellFixed]: props.fixed,
    [classes.cellFixedStart]: props.fixed,
    [classes.cellFixedShadow]: props.showShadow,
  }),
);

const buttonClasses = computed((): string =>
  clsx(classes.expandIcon, {
    [classes.expandIconExpanded]: props.expanded,
  }),
);

function handleClick(event: MouseEvent): void {
  event.stopPropagation();

  if (props.canExpand) {
    emit('click');
  }
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
      <MznSkeleton v-if="table.loading" variant="body-highlight" width="100%" />
      <button
        v-else-if="canExpand"
        :class="buttonClasses"
        type="button"
        @click="handleClick"
      >
        <MznIcon :icon="ChevronRightIcon" color="inherit" />
      </button>
    </template>
  </component>
</template>
