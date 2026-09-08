<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import clsx from 'clsx';
import MznSkeleton from '../skeleton/skeleton.vue';
import MznToggle from '../toggle/toggle.vue';
import { useTableContext } from './table-context';
import type { TableToggleableCellProps } from './table-toggleable-cell.types';

/**
 * 開關欄的儲存格，把 `toggleable.toggledRowKeys` 換算成這一列的開關狀態。
 *
 * 狀態完全受控：切換時只呼叫 `onToggleChange`，由使用端決定要不要真的改。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableToggleableCell :record="record" />
 * </template>
 * ```
 *
 * @see MznTable 提供 `toggleable` 設定的元件
 */
const props = withDefaults(
  defineProps<TableToggleableCellProps<TableDataSource>>(),
  {
    fixed: false,
    fixedOffset: 0,
    record: undefined,
    showShadow: false,
    width: undefined,
  },
);

const table = useTableContext();

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
    (style as Record<string, string>)['--fixed-end-offset'] =
      `${props.fixedOffset}px`;
  }

  return style;
});

const cellClasses = computed((): string =>
  clsx(classes.cell, {
    [classes.cellFixed]: props.fixed,
    [classes.cellFixedEnd]: props.fixed,
    [classes.cellFixedShadow]: props.showShadow,
  }),
);

const rowKey = computed((): string =>
  props.record ? getRowKey(props.record) : '',
);

const isToggled = computed(
  (): boolean =>
    table.value.toggleable?.toggledRowKeys.includes(rowKey.value) ?? false,
);

const isDisabled = computed((): boolean =>
  props.record
    ? (table.value.toggleable?.isRowDisabled?.(props.record) ?? false)
    : false,
);

function handleToggleChange(): void {
  const { toggleable } = table.value;

  if (!toggleable || !props.record || isDisabled.value) return;

  toggleable.onToggleChange(props.record, !isToggled.value);
}
</script>

<template>
  <td :class="cellClasses" :style="cellStyle">
    <MznSkeleton v-if="table.loading" variant="body-highlight" width="100%" />
    <MznToggle
      v-else
      :checked="isToggled"
      :disabled="isDisabled"
      size="sub"
      @change="handleToggleChange"
    />
  </td>
</template>
