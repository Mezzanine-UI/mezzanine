<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import {
  getCellAlignClass,
  tableClasses as classes,
  type TableActionItem,
  type TableActionItemButton,
  type TableActionItemDropdown,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import { useTableContext } from './table-context';
import type { TableActionsCellProps } from './table-actions-cell.types';

/**
 * 每一列最右側的操作欄，內容由 `actions.render(record, index)` 決定。
 *
 * 項目分成按鈕與下拉兩種；下拉固定加上 `shift`，因為操作欄就在最右邊，選單常常會
 * 貼著視窗邊緣打開，只有 `flip` 會被裁掉。載入中或沒有 record 時渲染空的儲存格。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableActionsCell :actions="actions" :column-index="5" :record="record" :row-index="0" />
 * </template>
 * ```
 *
 * @see MznTableRow 渲染它的元件
 */
const props = withDefaults(
  defineProps<TableActionsCellProps<TableDataSource>>(),
  {
    fixed: undefined,
    fixedOffset: 0,
    record: undefined,
    showShadow: false,
    width: undefined,
  },
);

const table = useTableContext();

// Skeleton row: the loading branch below renders an empty cell, so there is
// nothing to build and no record to hand to the consumer's render().
const actionItems = computed((): TableActionItem<TableDataSource>[] =>
  props.record ? props.actions.render(props.record, props.rowIndex) : [],
);

const cellStyle = computed((): CSSProperties => {
  const style: CSSProperties = {};

  if (props.width !== undefined) {
    style.width = `${props.width}px`;
    style.minWidth = `${props.width}px`;
    style.maxWidth = `${props.width}px`;
    style.flexShrink = 0;
  }

  if (props.fixed === 'start') {
    (style as Record<string, string>)['--fixed-start-offset'] =
      `${props.fixedOffset}px`;
  } else if (props.fixed === 'end') {
    (style as Record<string, string>)['--fixed-end-offset'] =
      `${props.fixedOffset}px`;
  }

  return style;
});

const alignClass = computed((): string =>
  getCellAlignClass(props.actions.align ?? 'end'),
);

const isCellHighlighted = computed((): boolean => {
  const { highlight } = table.value;

  if (!highlight) return false;

  const { columnIndex: hoveredColumn, mode, rowIndex: hoveredRow } = highlight;

  if (hoveredRow === null || hoveredColumn === null) return false;

  switch (mode) {
    case 'cell':
      return (
        hoveredRow === props.rowIndex && hoveredColumn === props.columnIndex
      );
    case 'column':
      return hoveredColumn === props.columnIndex;
    case 'cross':
      return hoveredColumn === props.columnIndex;
    case 'row':
    default:
      return false;
  }
});

const cellClasses = computed((): string =>
  clsx(classes.cell, {
    [classes.cellFixed]: !!props.fixed,
    [classes.cellFixedEnd]: props.fixed === 'end',
    [classes.cellFixedShadow]: props.showShadow,
    [classes.cellFixedStart]: props.fixed === 'start',
    [classes.cellHighlight]: isCellHighlighted.value,
  }),
);

const isEmptyCell = computed(
  (): boolean => Boolean(table.value.loading) || !props.record,
);

const asDropdown = (item: TableActionItem<TableDataSource>) =>
  item as TableActionItemDropdown<TableDataSource>;

const asButton = (item: TableActionItem<TableDataSource>) =>
  item as TableActionItemButton<TableDataSource>;

const itemKey = (
  item: TableActionItem<TableDataSource>,
  actionIndex: number,
): string =>
  `${item.name || 'name'}-${item.icon?.name || 'icon'}-${props.rowIndex}-${actionIndex}`;

function handleMouseEnter(): void {
  table.value.highlight?.setHoveredCell(props.rowIndex, props.columnIndex);
}

function handleSelect(
  item: TableActionItem<TableDataSource>,
  option: DropdownOption,
): void {
  if (!props.record) return;

  asDropdown(item).onSelect(option, props.record, props.rowIndex);
}

function handleClick(item: TableActionItem<TableDataSource>): void {
  if (!props.record) return;

  asButton(item).onClick(props.record, props.rowIndex);
}
</script>

<template>
  <td :class="cellClasses" :style="cellStyle" @mouseenter="handleMouseEnter">
    <div v-if="!isEmptyCell" :class="clsx(classes.cellContent, alignClass)">
      <div :class="classes.actionsCell">
        <template
          v-for="(item, actionIndex) in actionItems"
          :key="itemKey(item, actionIndex)"
        >
          <MznDropdown
            v-if="item.type === 'dropdown'"
            :max-height="asDropdown(item).maxHeight"
            :options="asDropdown(item).options"
            :placement="asDropdown(item).placement ?? 'bottom-end'"
            shift
            type="default"
            @select="handleSelect(item, $event)"
          >
            <template #default="triggerProps">
              <MznButton
                v-bind="triggerProps"
                :aria-label="asDropdown(item).name"
                :icon="asDropdown(item).icon ?? DotHorizontalIcon"
                icon-type="icon-only"
                size="sub"
                type="button"
                :variant="asDropdown(item).variant ?? 'base-text-link'"
              >
                {{ asDropdown(item).name }}
              </MznButton>
            </template>
          </MznDropdown>
          <MznButton
            v-else
            :aria-label="
              asButton(item).iconType === 'icon-only'
                ? asButton(item).name
                : undefined
            "
            :disabled="record ? (item.disabled?.(record) ?? false) : false"
            :icon="asButton(item).icon"
            :icon-type="asButton(item).iconType"
            size="sub"
            type="button"
            :variant="asButton(item).variant ?? actions.variant"
            @click="handleClick(item)"
          >
            {{ asButton(item).name }}
          </MznButton>
        </template>
      </div>
    </div>
  </td>
</template>
