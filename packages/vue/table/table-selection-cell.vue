<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import clsx from 'clsx';
import MznCheckbox from '../checkbox/checkbox.vue';
import MznRadio from '../radio/radio.vue';
import MznSkeleton from '../skeleton/skeleton.vue';
import { useTableContext } from './table-context';
import type { TableSelectionCellProps } from './table-selection-cell.types';

/**
 * 表格的選取欄儲存格，表頭是全選、資料列是單列選取。
 *
 * `mode` 為 radio 時渲染單選鈕、表頭不給全選；`hidden` 會讓儲存格保留位置但不放控制項。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableSelectionCell :selected="isSelected" @change="toggle" />
 * </template>
 * ```
 *
 * @see MznTable 使用它的元件
 */
const props = withDefaults(defineProps<TableSelectionCellProps>(), {
  disabled: false,
  fixed: false,
  fixedOffset: 0,
  hidden: false,
  indeterminate: false,
  isHeader: false,
  mode: 'checkbox',
  showShadow: false,
  width: undefined,
});

const emit = defineEmits<{
  /** Fired when the row's selection is toggled. */
  change: [];
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
  clsx(
    props.isHeader ? classes.headerCell : classes.cell,
    classes.selectionCell,
    {
      [classes.cellFixed]: props.fixed,
      [classes.cellFixedStart]: props.fixed,
      [classes.cellFixedShadow]: props.showShadow,
    },
  ),
);
</script>

<template>
  <component
    :is="cellComponent"
    :class="cellClasses"
    :scope="isHeader ? 'col' : undefined"
    :style="cellStyle"
  >
    <div :class="classes.selectionCheckbox">
      <template v-if="!hidden">
        <MznSkeleton
          v-if="table.loading"
          variant="body-highlight"
          width="100%"
        />
        <MznRadio
          v-else-if="mode === 'radio'"
          :checked="selected"
          :disabled="disabled"
          @change="emit('change')"
        />
        <MznCheckbox
          v-else
          :checked="selected"
          :disabled="disabled"
          :indeterminate="indeterminate"
          @change="emit('change')"
        />
      </template>
    </div>
  </component>
</template>
