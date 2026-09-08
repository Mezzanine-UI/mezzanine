<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznSkeleton from '../skeleton/skeleton.vue';
import { useTableContext } from './table-context';
import type { TableCollectableCellProps } from './table-collectable-cell.types';

/**
 * 收藏欄的儲存格，把 `collectable.collectedRowKeys` 換算成這一列的星號狀態。
 *
 * 狀態完全受控：點擊時只呼叫 `onCollectChange`，由使用端決定要不要真的改。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableCollectableCell :record="record" />
 * </template>
 * ```
 *
 * @see MznTable 提供 `collectable` 設定的元件
 */
const props = withDefaults(
  defineProps<TableCollectableCellProps<TableDataSource>>(),
  {
    fixed: false,
    fixedOffset: 0,
    isHeader: false,
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

const isCollected = computed(
  (): boolean =>
    table.value.collectable?.collectedRowKeys.includes(rowKey.value) ?? false,
);

const isDisabled = computed((): boolean =>
  props.record
    ? (table.value.collectable?.isRowDisabled?.(props.record) ?? false)
    : false,
);

const buttonClasses = computed((): string =>
  clsx(classes.collectHandleIcon, {
    [`${classes.collectHandleIcon}--disabled`]: isDisabled.value,
  }),
);

function handleCollectClick(): void {
  const { collectable } = table.value;

  if (!collectable || !props.record || isDisabled.value) return;

  collectable.onCollectChange(props.record, !isCollected.value);
}
</script>

<template>
  <td :class="cellClasses" :style="cellStyle">
    <MznSkeleton v-if="table.loading" variant="body-highlight" width="100%" />
    <button
      v-else
      :aria-disabled="isDisabled"
      :aria-label="isCollected ? 'Remove from collection' : 'Add to collection'"
      :aria-pressed="isCollected"
      :class="buttonClasses"
      :disabled="isDisabled"
      type="button"
      @click="handleCollectClick"
    >
      <MznIcon
        :color="isCollected ? 'brand' : 'neutral'"
        :icon="isCollected ? StarFilledIcon : StarOutlineIcon"
      />
    </button>
  </td>
</template>
