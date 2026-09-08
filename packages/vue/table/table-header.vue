<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import {
  DRAG_OR_PIN_HANDLE_KEY,
  EXPANSION_KEY,
  getCellAlignClass,
  SELECTION_KEY,
  tableClasses as classes,
  type FixedType,
} from '@mezzanine-ui/core/table';
import {
  CaretDownIcon,
  CaretUpIcon,
  QuestionOutlineIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznTooltip from '../tooltip/tooltip.vue';
import MznTableColumnTitleMenu from './table-column-title-menu.vue';
import MznTableDragOrPinHandleCell from './table-drag-or-pin-handle-cell.vue';
import MznTableExpandCell from './table-expand-cell.vue';
import MznTableResizeHandle from './table-resize-handle.vue';
import MznTableSelectionCell from './table-selection-cell.vue';
import { useTableContext } from './table-context';
import { useTableDataContext } from './table-data-context';
import { useTableSuperContext } from './table-super-context';
import type { TableColumn } from './table.types';

/**
 * 表格的 thead：把手／展開／選取三個欄位在前，其餘依 `columns` 排列。
 *
 * 每個欄位可帶說明 tooltip、排序按鈕與下拉選單；`resizable` 開啟時除了最後一欄之外
 * 都會加上拖曳把手。固定欄的位移與陰影都來自 `useTableFixedOffsets`。
 *
 * @see MznTable 渲染它的元件
 */
const table = useTableContext();
const data = useTableDataContext();
const superContext = useTableSuperContext();

const parseFixed = (fixed: FixedType | undefined): 'end' | 'start' | null => {
  if (fixed === true || fixed === 'start') return 'start';
  if (fixed === 'end') return 'end';

  return null;
};

const scrollLeft = computed((): number => superContext.value.scrollLeft ?? 0);
const containerWidth = computed(
  (): number => superContext.value.containerWidth ?? 0,
);

const shadowFor = (key: string, isFixed: boolean): boolean =>
  isFixed &&
  (table.value.fixedOffsets?.shouldShowShadow(
    key,
    scrollLeft.value,
    containerWidth.value,
  ) ??
    false);

const hasDragOrPinHandle = computed(
  (): boolean =>
    Boolean(table.value.draggable?.enabled) ||
    Boolean(table.value.pinnable?.enabled),
);

const dragOrPinHandle = computed(() => {
  const { draggable, fixedOffsets, pinnable } = table.value;
  const isFixed = Boolean(draggable?.fixed) || Boolean(pinnable?.fixed);

  return {
    fixed: isFixed,
    fixedOffset: fixedOffsets?.getDragOrPinHandleOffset()?.offset ?? 0,
    mode: draggable?.enabled ? ('drag' as const) : ('pin' as const),
    showShadow: shadowFor(DRAG_OR_PIN_HANDLE_KEY, isFixed),
  };
});

const expandHeader = computed(() => {
  const { expansion, fixedOffsets } = table.value;
  const isFixed = Boolean(expansion?.config?.fixed);

  return {
    fixed: isFixed,
    fixedOffset: fixedOffsets?.getExpansionOffset()?.offset ?? 0,
    showShadow: shadowFor(EXPANSION_KEY, isFixed),
  };
});

const selectionHeader = computed(() => {
  const { fixedOffsets, selection } = table.value;
  const isFixed = Boolean(selection?.config?.fixed);

  return {
    fixed: isFixed,
    fixedOffset: fixedOffsets?.getSelectionOffset()?.offset ?? 0,
    // In radio mode, hide the header selection (no select all)
    hidden: selection?.mode === 'radio' || selection?.config?.hideSelectAll,
    showShadow: shadowFor(SELECTION_KEY, isFixed),
  };
});

const headerCellStyle = (column: TableColumn): CSSProperties => {
  const fixedPos = parseFixed(column.fixed);
  const offset =
    table.value.fixedOffsets?.getColumnOffset(column.key)?.offset ?? 0;
  const style: CSSProperties = {};

  if (fixedPos === 'start') {
    (style as Record<string, string>)['--fixed-start-offset'] = `${offset}px`;
  } else if (fixedPos === 'end') {
    (style as Record<string, string>)['--fixed-end-offset'] = `${offset}px`;
  }

  return style;
};

const headerCellClasses = (column: TableColumn): string => {
  const fixedPos = parseFixed(column.fixed);

  return clsx(
    classes.headerCell,
    {
      [classes.cellFixed]: !!fixedPos,
      [classes.cellFixedEnd]: fixedPos === 'end',
      [classes.cellFixedShadow]: shadowFor(column.key, !!fixedPos),
      [classes.cellFixedStart]: fixedPos === 'start',
      [classes.headerCellFixed]: !!fixedPos,
    },
    column.className,
    column.headerClassName,
  );
};

const ariaSort = (
  column: TableColumn,
): 'ascending' | 'descending' | undefined => {
  if (column.sortOrder === 'ascend') return 'ascending';
  if (column.sortOrder === 'descend') return 'descending';

  return undefined;
};

const sortIconClasses = (column: TableColumn, direction: string): string =>
  clsx(classes.sortIcon, {
    [classes.sortIconActive]: column.sortOrder === direction,
  });

function handleSortClick(event: MouseEvent, column: TableColumn): void {
  event.stopPropagation();
  table.value.sorting?.onSort(column.key);
}

function handleSortKeydown(event: KeyboardEvent, column: TableColumn): void {
  event.stopPropagation();

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    table.value.sorting?.onSort(column.key);
  }
}
</script>

<template>
  <thead :class="classes.header">
    <tr>
      <MznTableDragOrPinHandleCell
        v-if="hasDragOrPinHandle"
        :fixed="dragOrPinHandle.fixed"
        :fixed-offset="dragOrPinHandle.fixedOffset"
        is-header
        :mode="dragOrPinHandle.mode"
        :show-shadow="dragOrPinHandle.showShadow"
      />
      <MznTableExpandCell
        v-if="table.expansion"
        :expanded="false"
        :fixed="expandHeader.fixed"
        :fixed-offset="expandHeader.fixedOffset"
        is-header
        :show-shadow="expandHeader.showShadow"
      />
      <MznTableSelectionCell
        v-if="table.selection"
        :fixed="selectionHeader.fixed"
        :fixed-offset="selectionHeader.fixedOffset"
        :hidden="selectionHeader.hidden"
        :indeterminate="table.selection.isIndeterminate"
        is-header
        :mode="table.selection.mode"
        :selected="table.selection.isAllSelected"
        :show-shadow="selectionHeader.showShadow"
        @change="table.selection.toggleAll()"
      />
      <th
        v-for="(column, columnIndex) in data.columns"
        :key="column.key"
        :aria-sort="ariaSort(column)"
        :class="headerCellClasses(column)"
        scope="col"
        :style="headerCellStyle(column)"
      >
        <div :class="classes.headerCellContent">
          <div
            :class="
              clsx(classes.headerCellActions, getCellAlignClass(column.align))
            "
          >
            <span :class="classes.headerCellTitle">
              <component :is="() => column.title" />
            </span>
            <MznTooltip v-if="column.titleHelp" :disable-portal="false">
              <template #title>
                <component :is="() => column.titleHelp" />
              </template>
              <template
                #default="{ onMouseenter, onMouseleave, ref: setAnchor }"
              >
                <MznIcon
                  :ref="setAnchor"
                  :class="classes.headerCellIcon"
                  :icon="QuestionOutlineIcon"
                  :size="16"
                  :tabindex="0"
                  @mouseenter="onMouseenter"
                  @mouseleave="onMouseleave"
                />
              </template>
            </MznTooltip>
            <button
              v-if="column.onSort && table.sorting"
              :class="classes.sortIcons"
              type="button"
              @click="handleSortClick($event, column)"
              @keydown="handleSortKeydown($event, column)"
            >
              <MznIcon
                :class="sortIconClasses(column, 'ascend')"
                :icon="CaretUpIcon"
                :size="8"
              />
              <MznIcon
                :class="sortIconClasses(column, 'descend')"
                :icon="CaretDownIcon"
                :size="8"
              />
            </button>
          </div>
          <MznTableColumnTitleMenu :column="column" />
        </div>
        <MznTableResizeHandle
          v-if="table.resizable"
          :column="column"
          :column-index="columnIndex"
        />
      </th>
    </tr>
  </thead>
</template>
